import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

const R2_PUBLIC_URL = 
  process.env.NEXT_PUBLIC_R2_URL || 
  process.env.PUBLIC_R2_URL || 
  'https://pub-53dfba8fed9d48d3b927c25e22eb9cb1.r2.dev';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mode: 'server-side-proxy',
    env: {
      S3_ENDPOINT: process.env.S3_ENDPOINT ? `Defined (${process.env.S3_ENDPOINT.substring(0, 20)}...)` : 'MISSING',
      S3_BUCKET: process.env.S3_BUCKET ? `Defined (${process.env.S3_BUCKET})` : 'MISSING',
      R2_PUBLIC_URL: R2_PUBLIC_URL,
    }
  }, { headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // ── CASE 1: Multipart form upload (browser sends file directly to our API) ──
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const fileName = (formData.get('fileName') as string) || file?.name || 'upload';
      const fileType = (formData.get('contentType') as string) || file?.type || 'image/jpeg';
      const bucketKey = (formData.get('bucketKey') as string) || process.env.S3_BUCKET!;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400, headers: CORS_HEADERS });
      }

      const fileKey = fileName.replace(/\s+/g, '-');
      const bytes = await file.arrayBuffer();

      console.log(`[S3 Proxy] Uploading ${fileKey} (${bytes.byteLength} bytes) to R2`);

      await s3Client.send(new PutObjectCommand({
        Bucket: bucketKey,
        Key: fileKey,
        Body: Buffer.from(bytes),
        ContentType: fileType,
      }));

      const fileURL = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${fileKey}`;
      console.log(`[S3 Proxy] Upload complete: ${fileURL}`);

      return NextResponse.json({ 
        url: fileURL,
        fileURL,
        fileUrl: fileURL,
        publicUrl: fileURL,
        publicFileURL: fileURL,
      }, { headers: CORS_HEADERS });
    }

    // ── CASE 2: JSON request from sanity-plugin-s3-files (asks for a signed URL) ──
    const body = await req.json();
    console.log('[S3 API] JSON body:', JSON.stringify(body));

    const bucketKey = body.bucketKey || process.env.S3_BUCKET!;
    if (!bucketKey) {
      return NextResponse.json({ error: 'Missing bucketKey' }, { status: 400, headers: CORS_HEADERS });
    }

    // Deletion request
    if ('fileKey' in body && !('fileName' in body)) {
      await s3Client.send(new DeleteObjectCommand({ Bucket: bucketKey, Key: body.fileKey }));
      return NextResponse.json({ message: 'deleted' }, { headers: CORS_HEADERS });
    }

    // Signed-URL request — but we intercept: the plugin will PUT to our /api/s3/upload endpoint
    // We respond with a fake "presigned URL" that points back to our server-side upload proxy.
    // This bypasses all R2 CORS issues completely.
    if ('fileName' in body) {
      const { contentType: fileType, fileName } = body;
      const fileKey = fileName || `upload-${Date.now()}`;

      // The "url" we return is our own API endpoint which accepts PUT and proxies to R2
      const proxyUploadUrl = `${getOrigin(req)}/api/s3/upload?key=${encodeURIComponent(fileKey)}&bucket=${encodeURIComponent(bucketKey)}&type=${encodeURIComponent(fileType || 'image/jpeg')}`;
      const fileURL = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${fileKey}`;

      console.log(`[S3 API] Returning proxy URL: ${proxyUploadUrl}`);
      console.log(`[S3 API] Public fileURL: ${fileURL}`);

      return new Response(JSON.stringify({
        url: proxyUploadUrl,
        fileURL,
        fileUrl: fileURL,
        publicUrl: fileURL,
        publicFileURL: fileURL,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers: CORS_HEADERS });
  } catch (err) {
    console.error('[S3 Route] Error:', err);
    return NextResponse.json({ error: 'Server error', detail: String(err) }, { status: 500, headers: CORS_HEADERS });
  }
}

function getOrigin(req: Request): string {
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}
