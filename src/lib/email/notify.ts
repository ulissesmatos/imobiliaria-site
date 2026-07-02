import "server-only";

type LeadNotificationInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyTitle?: string;
  propertyUrl?: string;
  to: string;
};

export async function sendLeadNotificationEmail(input: LeadNotificationInput) {
  const subject = input.propertyTitle
    ? `Novo contato: ${input.propertyTitle}`
    : "Novo contato pelo site";

  const bodyLines = [
    `Nome: ${input.name}`,
    `E-mail: ${input.email}`,
    `Telefone: ${input.phone}`,
    input.propertyTitle ? `Imóvel: ${input.propertyTitle}` : null,
    input.propertyUrl ? `Link: ${input.propertyUrl}` : null,
    "",
    "Mensagem:",
    input.message,
  ].filter((line): line is string => line !== null);

  const text = bodyLines.join("\n");

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("\n=== [dev] Notificação de lead (RESEND_API_KEY não configurada) ===");
    console.log(`Para: ${input.to}`);
    console.log(`Assunto: ${subject}`);
    console.log(text);
    console.log("=== fim da notificação ===\n");
    return { delivered: false as const };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Site Imobiliária <onboarding@resend.dev>",
    to: input.to,
    subject,
    text,
  });

  return { delivered: true as const };
}
