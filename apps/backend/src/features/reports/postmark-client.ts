import { Attachment, ServerClient } from 'postmark';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import type { Readable } from 'node:stream';
import { ENV } from '#/env.js';

const s3Client = new S3Client({
  region: ENV.S3_REGION,
  endpoint: ENV.S3_ENDPOINT,
  forcePathStyle: ENV.S3_FORCE_PATH_STYLE,
  credentials: {
    accessKeyId: ENV.S3_ACCESS_KEY_ID,
    secretAccessKey: ENV.S3_SECRET_ACCESS_KEY,
  },
});

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(
      Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as ArrayBuffer)
    );
  }
  return Buffer.concat(chunks);
}

export async function downloadFileFromS3(
  bucket: string,
  filePath: string
): Promise<Buffer | null> {
  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: filePath });
    const response = await s3Client.send(command);
    if (!response.Body) return null;
    return await streamToBuffer(response.Body as Readable);
  } catch {
    return null;
  }
}

export async function sendMonthlyStatementEmail(params: {
  fromEmail: string;
  toEmail: string;
  ccEmails: string[];
  month: number;
  year: number;
  attachments: Attachment[];
}): Promise<void> {
  const postmarkClient = new ServerClient(ENV.POSTMARK_API_KEY);

  await postmarkClient.sendEmailWithTemplate({
    From: params.fromEmail,
    To: params.toEmail,
    ...(params.ccEmails.length > 0 ? { Cc: params.ccEmails.join(',') } : {}),
    TemplateAlias: ENV.POSTMARK_TEMPLATE_ALIAS,
    TemplateModel: {
      month: new Date(params.year, params.month - 1).toLocaleString('en-US', {
        month: 'long',
      }),
      year: params.year,
      project_name: ENV.COMPANY_NAME,
      company_name: ENV.COMPANY_NAME,
      company_address: ENV.COMPANY_ADDRESS,
    },
    Attachments: params.attachments,
  });
}
