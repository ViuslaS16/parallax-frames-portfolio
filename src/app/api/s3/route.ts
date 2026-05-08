import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

const R2_PUBLIC_URL =
  process.env.NEXT_PUBLIC_R2_URL ||
  process.env.PUBLIC_R2_URL ||
  'https://pub-53dfba8fed9d48d3b927c25e22eb9cb1.r2.dev';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    r2_url: R2_PUBLIC_URL,
    env: {
      S3_ENDPOINT: process.env.S3_ENDPOINT ? `Defined` : 'MISSING',
      S3_BUCKET: process.env.S3_BUCKET ? `Defined (${process.env.S3_BUCKET})` : 'MISSING',
      R2_URL: R2_PUBLIC_URL,
    }
  }, { headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('[S3 API] Request:', JSON.stringify(body));

    const bucketKey = body.bucketKey || process.env.S3_BUCKET!;
    if (!bucketKey) {
      return NextResponse.json({ error: 'Missing bucketKey' }, { status: 400, headers: CORS_HEADERS });
    }

    // ── DELETION ──
    if ('fileKey' in body && !('fileName' in body)) {
      await s3Client.send(new DeleteObjectCommand({ Bucket: bucketKey, Key: body.fileKey }));
      return NextResponse.json({ message: 'deleted' }, { headers: CORS_HEADERS });
    }

    // ── PRESIGNED URL FOR UPLOAD ──
    if ('fileName' in body) {
      const { contentType: fileType, fileName } = body;
      const fileKey = fileName || `upload-${Date.now()}`;
      const mimeType = fileType || 'image/jpeg';

      // Generate a real presigned PUT URL to R2
      const signedUrl = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: bucketKey,
          Key: fileKey,
          ContentType: mimeType,
        }),
        { expiresIn: 3600 }
      );

      const fileURL = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${fileKey}`;

      console.log(`[S3 API] Presigned URL generated for: ${fileKey}`);
      console.log(`[S3 API] Public fileURL: ${fileURL}`);

      return new Response(JSON.stringify({
        url: signedUrl,
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
