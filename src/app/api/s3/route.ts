import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const R2_URL =
  process.env.NEXT_PUBLIC_R2_URL ||
  process.env.PUBLIC_R2_URL ||
  'https://pub-53dfba8fed9d48d3b927c25e22eb9cb1.r2.dev';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET() {
  return NextResponse.json({ status: 'ok', r2: R2_URL, bucket: process.env.S3_BUCKET }, { headers: CORS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const bucket = body.bucketKey || process.env.S3_BUCKET!;

    // Delete
    if ('fileKey' in body && !('fileName' in body)) {
      await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: body.fileKey }));
      return NextResponse.json({ ok: true }, { headers: CORS });
    }

    // Upload: plugin POSTs metadata, we upload the file ourselves via PUT to this same server
    if ('fileName' in body) {
      const { fileName, contentType } = body;
      const key = fileName || `upload-${Date.now()}`;
      const mime = contentType || 'image/jpeg';

      // Build proxy URL using URLSearchParams to avoid any encoding issues
      const params = new URLSearchParams({ key, bucket, mime });
      const origin = new URL(req.url).origin;
      const proxyUrl = `${origin}/api/s3/upload?${params.toString()}`;
      const fileURL = `${R2_URL.replace(/\/$/, '')}/${key}`;

      return new Response(
        JSON.stringify({ url: proxyUrl, fileURL, fileUrl: fileURL, publicUrl: fileURL, publicFileURL: fileURL }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...CORS } }
      );
    }

    return NextResponse.json({ error: 'bad request' }, { status: 400, headers: CORS });
  } catch (e) {
    console.error('[s3]', e);
    return NextResponse.json({ error: String(e) }, { status: 500, headers: CORS });
  }
}
