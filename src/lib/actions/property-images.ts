"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteStoredFile, savePropertyImage } from "@/lib/storage/local";

function revalidatePropertyEdit(propertyId: string) {
  revalidatePath(`/admin/imoveis/${propertyId}/editar`);
}

export async function uploadPropertyImage(propertyId: string, file: File) {
  await requireSession();

  const [existingCount, hasCover] = await Promise.all([
    prisma.propertyImage.count({ where: { propertyId } }),
    prisma.propertyImage.findFirst({ where: { propertyId, isCover: true } }),
  ]);

  const { url, storagePath } = await savePropertyImage(propertyId, file);

  const image = await prisma.propertyImage.create({
    data: {
      propertyId,
      url,
      storagePath,
      order: existingCount,
      isCover: !hasCover,
    },
  });

  revalidatePropertyEdit(propertyId);
  return image;
}

export async function reorderPropertyImages(
  propertyId: string,
  orderedIds: string[]
) {
  await requireSession();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.propertyImage.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  revalidatePropertyEdit(propertyId);
}

export async function setCoverImage(propertyId: string, imageId: string) {
  await requireSession();

  await prisma.$transaction([
    prisma.propertyImage.updateMany({
      where: { propertyId },
      data: { isCover: false },
    }),
    prisma.propertyImage.update({
      where: { id: imageId },
      data: { isCover: true },
    }),
  ]);

  revalidatePropertyEdit(propertyId);
}

export async function deletePropertyImage(imageId: string) {
  await requireSession();

  const image = await prisma.propertyImage.findUnique({
    where: { id: imageId },
  });
  if (!image) return;

  await deleteStoredFile(image.storagePath);
  await prisma.propertyImage.delete({ where: { id: imageId } });

  if (image.isCover) {
    const next = await prisma.propertyImage.findFirst({
      where: { propertyId: image.propertyId },
      orderBy: { order: "asc" },
    });
    if (next) {
      await prisma.propertyImage.update({
        where: { id: next.id },
        data: { isCover: true },
      });
    }
  }

  revalidatePropertyEdit(image.propertyId);
}
