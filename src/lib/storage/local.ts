import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");
const MAX_DIMENSION = 2000;

export type StoredImage = {
  url: string;
  storagePath: string;
};

async function saveWebp(
  buffer: Buffer,
  dir: string,
  filename: string
): Promise<StoredImage> {
  const absoluteDir = path.join(UPLOADS_ROOT, dir);
  await mkdir(absoluteDir, { recursive: true });

  const outputBuffer = await sharp(buffer)
    .rotate()
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();

  const relativePath = path.posix.join("uploads", dir, filename);
  const absolutePath = path.join(UPLOADS_ROOT, dir, filename);

  await writeFile(absolutePath, outputBuffer);

  return { url: `/${relativePath}`, storagePath: relativePath };
}

export async function savePropertyImage(propertyId: string, file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}.webp`;
  return saveWebp(buffer, path.posix.join("properties", propertyId), filename);
}

export async function saveSiteAsset(kind: "logo" | "favicon" | "hero", file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${kind}-${randomUUID()}.webp`;
  return saveWebp(buffer, "site", filename);
}

export async function deleteStoredFile(storagePath: string) {
  const absolutePath = path.join(process.cwd(), "public", storagePath);
  try {
    await unlink(absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
