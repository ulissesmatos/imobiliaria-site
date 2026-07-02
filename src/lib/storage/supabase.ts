import "server-only";

import { randomUUID } from "node:crypto";

import sharp from "sharp";

import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "uploads";
const MAX_DIMENSION = 2000;

export type StoredImage = {
  url: string;
  storagePath: string;
};

async function processAndUpload(
  buffer: Buffer,
  storagePath: string
): Promise<StoredImage> {
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

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, outputBuffer, {
      contentType: "image/webp",
      upsert: true,
    });

  if (error) {
    throw new Error(`Falha ao enviar imagem para o storage: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return { url: data.publicUrl, storagePath };
}

export async function savePropertyImage(propertyId: string, file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const storagePath = `properties/${propertyId}/${randomUUID()}.webp`;
  return processAndUpload(buffer, storagePath);
}

export async function saveSiteAsset(
  kind: "logo" | "favicon" | "hero",
  file: File
) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const storagePath = `site/${kind}-${randomUUID()}.webp`;
  return processAndUpload(buffer, storagePath);
}

export async function deleteStoredFile(storagePath: string) {
  const supabase = createAdminClient();
  await supabase.storage.from(BUCKET).remove([storagePath]);
}
