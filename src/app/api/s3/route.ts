import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Endpoint = process.env.S3_ENDPOINT || 'https://182583985b0bed525336539c279022d7.r2.cloudflarestorage.com';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: s3Endpoint,
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED', // CRITICAL for Cloudflare R2
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-store',
};

const R2_URL =
  process.env.NEXT_PUBLIC_R2_URL ||
  process.env.PUBLIC_R2_URL ||
  'https://pub-53dfba8fed9d48d3b927c25e22eb9cb1.r2.dev';

export async function GET() {
  return NextResponse.json(
    { status: 'ok', r2_url: R2_URL, bucket: process.env.S3_BUCKET },
    { headers: CORS }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const bucket = body.bucketKey || process.env.S3_BUCKET || 'josa-assets';

    if (!process.env.S3_ACCESS_KEY) {
      throw new Error('Missing S3_ACCESS_KEY in environment');
    }

    // Delete flow
    if ('fileKey' in body && !('fileName' in body)) {
      await s3Client.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: body.fileKey })
      );
      return NextResponse.json({ ok: true }, { headers: CORS });
    }

    // Presigned PUT upload
    if ('fileName' in body) {
      const key = body.fileName || `upload-${Date.now()}`;
      
      const url = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          ContentType: body.contentType || 'image/jpeg',
        }),
        { expiresIn: 3600 }
      );

      const fileURL = `${R2_URL.replace(/\/$/, '')}/${key}`;

      // We ONLY return url and fileURL. 
      // Do NOT return 'fields' so that sanity-plugin-s3-files uses fetch(..., { method: 'PUT', body: file })
      return new Response(
        JSON.stringify({
          url,
          fileURL,
          fileUrl: fileURL,
          publicUrl: fileURL,
          publicFileURL: fileURL,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...CORS },
        }
      );
    }

    return NextResponse.json({ error: 'bad request' }, { status: 400, headers: CORS });
  } catch (e) {
    console.error('[s3]', e);
    return NextResponse.json({ error: String(e) }, { status: 500, headers: CORS });
  }
}
