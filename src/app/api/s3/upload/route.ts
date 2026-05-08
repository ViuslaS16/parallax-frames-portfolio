import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
  'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

const R2_PUBLIC_URL =
  process.env.NEXT_PUBLIC_R2_URL ||
  process.env.PUBLIC_R2_URL ||
  'https://pub-53dfba8fed9d48d3b927c25e22eb9cb1.r2.dev';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * This endpoint receives the file PUT directly from the browser
 * (because the Sanity plugin does a PUT to whatever URL we returned in /api/s3).
 * We then forward the file to R2 server-side — no browser CORS needed.
 */
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const bucket = searchParams.get('bucket') || process.env.S3_BUCKET!;
    const contentType = searchParams.get('type') || req.headers.get('content-type') || 'image/jpeg';

    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400, headers: CORS_HEADERS });
    }

    console.log(`[S3 Upload] Receiving PUT for key: ${key}, bucket: ${bucket}`);

    const body = await req.arrayBuffer();
    console.log(`[S3 Upload] File size: ${body.byteLength} bytes`);

    await s3Client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(body),
      ContentType: contentType,
    }));

    const fileURL = `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
    console.log(`[S3 Upload] Success. Public URL: ${fileURL}`);

    // Return 200 OK so the plugin's presignedPromise resolves with res.ok = true
    return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error('[S3 Upload] Error:', err);
    return NextResponse.json({ error: 'Upload failed', detail: String(err) }, { status: 500, headers: CORS_HEADERS });
  }
}
