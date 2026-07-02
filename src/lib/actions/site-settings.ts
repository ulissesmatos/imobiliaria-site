"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { saveSiteAsset } from "@/lib/storage/local";
import { siteSettingsSchema } from "@/lib/validations/site-settings";

export type SiteSettingsFormState = {
  error?: string;
  success?: boolean;
};

async function uploadIfProvided(
  formData: FormData,
  field: string,
  kind: "logo" | "favicon" | "hero"
) {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    const { url } = await saveSiteAsset(kind, file);
    return url;
  }
  return undefined;
}

export async function updateSiteSettings(
  _prevState: SiteSettingsFormState,
  formData: FormData
): Promise<SiteSettingsFormState> {
  await requireSession();

  const parsed = siteSettingsSchema.safeParse({
    siteName: formData.get("siteName"),
    aboutText: formData.get("aboutText") || undefined,
    creci: formData.get("creci") || undefined,
    contactEmail: formData.get("contactEmail") || "",
    contactPhone: formData.get("contactPhone") || undefined,
    whatsappNumber: formData.get("whatsappNumber") || undefined,
    addressLine: formData.get("addressLine") || undefined,
    primaryColor: formData.get("primaryColor") || undefined,
    instagramUrl: formData.get("instagramUrl") || undefined,
    facebookUrl: formData.get("facebookUrl") || undefined,
    youtubeUrl: formData.get("youtubeUrl") || undefined,
  });

  if (!parsed.success) {
    return { error: "Verifique os campos preenchidos." };
  }

  const [logoUrl, faviconUrl, heroImageUrl] = await Promise.all([
    uploadIfProvided(formData, "logo", "logo"),
    uploadIfProvided(formData, "favicon", "favicon"),
    uploadIfProvided(formData, "hero", "hero"),
  ]);

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      ...parsed.data,
      ...(logoUrl ? { logoUrl } : {}),
      ...(faviconUrl ? { faviconUrl } : {}),
      ...(heroImageUrl ? { heroImageUrl } : {}),
    },
    create: {
      id: 1,
      ...parsed.data,
      logoUrl,
      faviconUrl,
      heroImageUrl,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracoes");
  return { success: true };
}
