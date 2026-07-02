import { prisma } from "@/lib/prisma";
import { ContactForm } from "@/components/public/contact-form";

export const metadata = {
  title: "Contato",
};

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Fale conosco</h1>
      <p className="mt-2 text-muted-foreground">
        Preencha o formulário abaixo e entraremos em contato o quanto antes.
      </p>

      <div className="mt-6 space-y-1 text-sm text-muted-foreground">
        {settings?.contactPhone && <p>Telefone: {settings.contactPhone}</p>}
        {settings?.contactEmail && <p>E-mail: {settings.contactEmail}</p>}
        {settings?.addressLine && <p>{settings.addressLine}</p>}
      </div>

      <div className="mt-6">
        <ContactForm title="Envie sua mensagem" />
      </div>
    </div>
  );
}
