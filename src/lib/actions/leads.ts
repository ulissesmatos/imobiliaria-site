"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth/session";
import { sendLeadNotificationEmail } from "@/lib/email/notify";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations/lead";

export type LeadFormState = {
  error?: string;
  success?: boolean;
};

export async function createLead(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    propertyId: formData.get("propertyId") || undefined,
    honeypot: formData.get("empresa") || "",
  });

  if (!parsed.success) {
    return { error: "Verifique os campos preenchidos." };
  }

  // Honeypot: campo invisível para humanos. Se veio preenchido, é bot —
  // finge sucesso sem gravar nada.
  if (parsed.data.honeypot) {
    return { success: true };
  }

  const { name, email, phone, message, propertyId } = parsed.data;

  const [property, settings] = await Promise.all([
    propertyId
      ? prisma.property.findUnique({ where: { id: propertyId } })
      : null,
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  await prisma.lead.create({
    data: {
      name,
      email,
      phone,
      message,
      propertyId: property?.id,
      origem: property ? "PAGINA_IMOVEL" : "PAGINA_CONTATO",
    },
  });

  const notifyEmail = settings?.contactEmail;
  if (notifyEmail) {
    try {
      await sendLeadNotificationEmail({
        name,
        email,
        phone,
        message,
        propertyTitle: property?.title,
        propertyUrl: property
          ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/imoveis/${property.slug}`
          : undefined,
        to: notifyEmail,
      });
    } catch (error) {
      console.error("Falha ao enviar e-mail de notificação de lead:", error);
    }
  }

  revalidatePath("/admin/leads");
  return { success: true };
}

export async function updateLeadStatus(id: string, status: string) {
  await requireSession();
  await prisma.lead.update({ where: { id }, data: { status: status as never } });
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

export async function updateLeadNotes(id: string, internalNotes: string) {
  await requireSession();
  await prisma.lead.update({ where: { id }, data: { internalNotes } });
  revalidatePath(`/admin/leads/${id}`);
}
