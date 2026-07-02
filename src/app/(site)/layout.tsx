import Link from "next/link";
import { Building2 } from "lucide-react";

import { prisma } from "@/lib/prisma";

async function getSiteSettings() {
  return prisma.siteSettings.findUnique({ where: { id: 1 } });
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? "Sua Imobiliária";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            {settings?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logoUrl} alt={siteName} className="h-8 object-contain" />
            ) : (
              <Building2 className="size-5" strokeWidth={1.75} />
            )}
            {siteName}
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Início
            </Link>
            <Link href="/imoveis" className="hover:text-foreground">
              Imóveis
            </Link>
            <Link href="/sobre" className="hover:text-foreground">
              Sobre
            </Link>
            <Link href="/contato" className="hover:text-foreground">
              Contato
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-medium text-foreground">{siteName}</p>
            {settings?.contactEmail && <p>{settings.contactEmail}</p>}
            {settings?.contactPhone && <p>{settings.contactPhone}</p>}
            {settings?.addressLine && <p>{settings.addressLine}</p>}
            {settings?.creci && <p>CRECI: {settings.creci}</p>}
            <Link href="/politica-privacidade" className="mt-1 inline-block underline">
              Política de Privacidade
            </Link>
          </div>
          {(settings?.instagramUrl ||
            settings?.facebookUrl ||
            settings?.youtubeUrl) && (
            <div className="flex gap-4">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline"
                >
                  Instagram
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline"
                >
                  Facebook
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground hover:underline"
                >
                  YouTube
                </a>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
