import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

function getRandomKey() {
  return Math.random().toFixed(10).replace('0.', '');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Fallback to environment variables if the plugin doesn't provide them
    const bucketKey = body.bucketKey || process.env.S3_BUCKET;

    if (!bucketKey) {
      return NextResponse.json({ message: 'Missing bucketKey' }, { status: 400 });
    }

    /** SIGNED URL CREATION */
    if ('fileName' in body) {
      const { contentType, fileName } = body;
      const fileKey = fileName || `${getRandomKey()}-${getRandomKey()}-${contentType || 'unknown-type'}`;

      const createSignedUrl = new PutObjectCommand({
        Bucket: bucketKey,
        Key: fileKey,
        ContentType: contentType,
      });

      const url = await getSignedUrl(s3Client, createSignedUrl, { expiresIn: 3600 });

      // Build the public fileURL using the R2 public domain
      const publicBase = process.env.PUBLIC_R2_URL;
      const fileURL = publicBase
        ? `${publicBase.replace(/\/$/, '')}/${fileKey}`
        : url.split('?')[0]; // fallback: strip query params from signed URL

      return NextResponse.json({ url, fileURL }, {
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    /** OBJECT DELETION */
    if ('fileKey' in body) {
      const { fileKey } = body;

      const deleteObject = new DeleteObjectCommand({
        Bucket: bucketKey,
        Key: fileKey,
      });

      await s3Client.send(deleteObject);
      return NextResponse.json({ message: 'success' }, {
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('S3 Route Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
