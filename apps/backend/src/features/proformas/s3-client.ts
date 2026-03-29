import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ENV } from '#/env.js';
import { v7 } from 'uuid';

const s3Client = new S3Client({
  region: ENV.S3_REGION,
  endpoint: ENV.S3_ENDPOINT,
  forcePathStyle: ENV.S3_FORCE_PATH_STYLE,
  credentials: {
    accessKeyId: ENV.S3_ACCESS_KEY_ID,
    secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = ENV.S3_PROFORMA_BUCKET_NAME;

export async function uploadPdfBuffer(
  buffer: Buffer,
  proformaId: string
): Promise<string> {
  const filePath = `${proformaId}/${v7()}.pdf`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
    Body: buffer,
    ContentType: 'application/pdf',
  });
  await s3Client.send(command);
  return filePath;
}

export async function getPresignedDownloadUrl(
  filePath: string,
  expiresIn: number = 900
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
  });
  return await getSignedUrl(s3Client, command, { expiresIn });
}
