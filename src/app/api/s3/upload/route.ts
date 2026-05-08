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

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const R2_URL =
  process.env.NEXT_PUBLIC_R2_URL ||
  process.env.PUBLIC_R2_URL ||
  'https://pub-53dfba8fed9d48d3b927c25e22eb9cb1.r2.dev';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// The plugin PUTs the file binary here; we forward it to R2 server-side (no CORS needed)
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key') ?? '';
    const bucket = searchParams.get('bucket') || process.env.S3_BUCKET!;
    const mime = searchParams.get('mime') || req.headers.get('content-type') || 'image/jpeg';

    if (!key) return NextResponse.json({ error: 'missing key' }, { status: 400, headers: CORS });

    const data = await req.arrayBuffer();
    console.log(`[upload] key=${key} size=${data.byteLength}`);

    await s3Client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(data),
      ContentType: mime,
    }));

    const fileURL = `${R2_URL.replace(/\/$/, '')}/${key}`;
    console.log(`[upload] done → ${fileURL}`);

    return new NextResponse(null, { status: 200, headers: CORS });
  } catch (e) {
    console.error('[upload]', e);
    return NextResponse.json({ error: String(e) }, { status: 500, headers: CORS });
  }
}
