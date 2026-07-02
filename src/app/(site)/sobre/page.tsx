import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Sobre",
};

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const siteName = settings?.siteName ?? "Sua Imobiliária";

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        Sobre a {siteName}
      </h1>
      <p className="mt-4 whitespace-pre-line text-muted-foreground">
        {settings?.aboutText ??
          "Em breve, mais informações sobre a nossa imobiliária."}
      </p>
      {settings?.creci && (
        <p className="mt-6 text-sm text-muted-foreground">
          CRECI: {settings.creci}
        </p>
      )}
    </div>
  );
}
