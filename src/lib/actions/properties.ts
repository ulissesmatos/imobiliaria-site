"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth/session";
import { slugify } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { deleteStoredFile } from "@/lib/storage/local";
import { propertySchema } from "@/lib/validations/property";

export type PropertyFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function computeSortPrice(data: {
  tipoNegocio: string;
  priceSale?: number;
  priceRent?: number;
}) {
  if (data.tipoNegocio === "VENDA") return data.priceSale ?? null;
  return data.priceRent ?? null;
}

async function generateUniqueSlug(title: string, city: string) {
  const base = slugify(`${title}-${city}`) || slugify(title) || "imovel";
  let slug = base;
  let suffix = 2;
  while (await prisma.property.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

function parsePropertyForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return propertySchema.safeParse(raw);
}

export async function createProperty(
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  const session = await requireSession();
  const parsed = parsePropertyForm(formData);

  if (!parsed.success) {
    return {
      error: "Verifique os campos destacados.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v?.[0] ?? "",
        ])
      ),
    };
  }

  const data = parsed.data;
  const slug = await generateUniqueSlug(data.title, data.city);

  const property = await prisma.property.create({
    data: {
      ...data,
      slug,
      sortPrice: computeSortPrice(data),
      createdById: session.adminId,
      publishedAt: new Date(),
    },
  });

  revalidatePath("/admin/imoveis");
  redirect(`/admin/imoveis/${property.id}/editar`);
}

export async function updateProperty(
  id: string,
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  await requireSession();
  const parsed = parsePropertyForm(formData);

  if (!parsed.success) {
    return {
      error: "Verifique os campos destacados.",
      fieldErrors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v?.[0] ?? "",
        ])
      ),
    };
  }

  const data = parsed.data;

  await prisma.property.update({
    where: { id },
    data: {
      ...data,
      sortPrice: computeSortPrice(data),
    },
  });

  revalidatePath("/admin/imoveis");
  revalidatePath(`/admin/imoveis/${id}/editar`);
  return {};
}

export async function updatePropertyStatus(id: string, status: string) {
  await requireSession();
  await prisma.property.update({
    where: { id },
    data: { status: status as never },
  });
  revalidatePath("/admin/imoveis");
}

export async function toggleFeatured(id: string, featured: boolean) {
  await requireSession();
  await prisma.property.update({
    where: { id },
    data: { featured },
  });
  revalidatePath("/admin/imoveis");
}

export async function deleteProperty(id: string) {
  await requireSession();

  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!property) return;

  await Promise.all(
    property.images.map((image) => deleteStoredFile(image.storagePath))
  );

  await prisma.property.delete({ where: { id } });
  revalidatePath("/admin/imoveis");
}
