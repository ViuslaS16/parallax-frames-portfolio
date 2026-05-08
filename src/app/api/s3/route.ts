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

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    env: {
      S3_ENDPOINT: process.env.S3_ENDPOINT ? `Defined (${process.env.S3_ENDPOINT.substring(0, 10)}...)` : 'MISSING',
      S3_BUCKET: process.env.S3_BUCKET ? `Defined (${process.env.S3_BUCKET})` : 'MISSING',
      PUBLIC_R2_URL: process.env.PUBLIC_R2_URL ? `Defined (${process.env.PUBLIC_R2_URL})` : 'MISSING',
      NEXT_PUBLIC_R2_URL: process.env.NEXT_PUBLIC_R2_URL ? `Defined (${process.env.NEXT_PUBLIC_R2_URL})` : 'MISSING',
      NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? 'Defined' : 'MISSING',
    }
  });
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
    
    // Logging for debugging in Vercel
    console.log('S3 API Request Body:', JSON.stringify(body));
    
    const bucketKey = body.bucketKey || process.env.S3_BUCKET;
    if (!bucketKey) {
      return NextResponse.json({ message: 'Missing bucketKey' }, { status: 400 });
    }

    /** SIGNED URL CREATION */
    if ('fileName' in body) {
      const { contentType, fileName } = body;
      const fileKey = fileName || `${getRandomKey()}-${getRandomKey()}-${(contentType || 'image/jpeg').split('/')[1]}`;

      const createSignedUrl = new PutObjectCommand({
        Bucket: bucketKey,
        Key: fileKey,
        ContentType: contentType || 'image/jpeg',
      });

      const url = await getSignedUrl(s3Client, createSignedUrl, { expiresIn: 3600 });

      // Build the public fileURL using the R2 public domain
      const publicBase = process.env.NEXT_PUBLIC_R2_URL || process.env.PUBLIC_R2_URL;
      
      let fileURL = '';
      if (publicBase) {
        fileURL = `${publicBase.replace(/\/$/, '')}/${fileKey}`;
      } else {
        fileURL = url.split('?')[0];
      }

      console.log('Final URL for Sanity:', fileURL);

      // Return every possible key name that different versions of the plugin might expect
      return NextResponse.json({ 
        url, 
        signedUrl: url,
        fileURL, 
        fileUrl: fileURL,
        publicUrl: fileURL,
        publicFileURL: fileURL,
        publicFileUrl: fileURL
      }, {
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
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
