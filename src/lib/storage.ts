import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { AwsClient } from 'aws4fetch';

const MAX_BYTES = 3 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

export class UploadError extends Error {}

function r2Config() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
    return null;
  }
  return { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL };
}

/**
 * Validates then stores an image and returns its public URL.
 *
 * Content type is taken from the sniffed file, not from the filename, and the
 * stored name is a UUID — an uploaded `x.php` can therefore never be served back
 * under a name that any host would execute.
 */
export async function storeImage(file: File, prefix = 'uploads'): Promise<string> {
  if (!ALLOWED.has(file.type)) {
    throw new UploadError('Only JPEG, PNG, WebP or AVIF images are allowed');
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError('Image must be 3 MB or smaller');
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const key = `${prefix}/${randomUUID()}.${EXT[file.type]}`;
  const cfg = r2Config();

  if (cfg) {
    const client = new AwsClient({
      accessKeyId: cfg.R2_ACCESS_KEY_ID,
      secretAccessKey: cfg.R2_SECRET_ACCESS_KEY,
      service: 's3',
      region: 'auto',
    });

    const res = await client.fetch(
      `https://${cfg.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${cfg.R2_BUCKET}/${key}`,
      {
        method: 'PUT',
        body: bytes,
        headers: { 'Content-Type': file.type, 'Cache-Control': 'public, max-age=31536000, immutable' },
      }
    );
    if (!res.ok) throw new UploadError(`Storage rejected the upload (${res.status})`);

    return `${cfg.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
  }

  // Dev fallback. Not durable on serverless hosts — configure R2 before deploying.
  const dir = path.join(process.cwd(), 'public', prefix);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(process.cwd(), 'public', key), bytes);
  return `/${key}`;
}

export function isRemoteStorageConfigured(): boolean {
  return r2Config() !== null;
}
