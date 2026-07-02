import Link from "next/link";
import { Building2 } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getFeaturedProperties } from "@/lib/queries/properties";
import { PropertyCard } from "@/components/public/property-card";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    getFeaturedProperties(),
  ]);

  const siteName = settings?.siteName ?? "Sua Imobiliária";

  return (
    <div>
      <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-muted">
        {settings?.heroImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.heroImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
            <Building2 className="size-24 text-muted-foreground/20" strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center text-white">
          <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Encontre o imóvel ideal com a {siteName}
          </h1>
          <p className="max-w-md text-white/90">
            {settings?.aboutText ??
              "Imóveis selecionados para compra e aluguel, com atendimento próximo do início ao fim."}
          </p>
          <Button size="lg" render={<Link href="/imoveis" />}>
            Ver imóveis disponíveis
          </Button>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Imóveis em destaque
            </h2>
            <Link href="/imoveis" className="text-sm underline">
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-12 text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Não encontrou o que procurava?
          </h2>
          <p className="max-w-md text-muted-foreground">
            Fale com a nossa equipe e conte o que você está buscando.
          </p>
          <Button variant="outline" render={<Link href="/contato" />}>
            Entrar em contato
          </Button>
        </div>
      </section>
    </div>
  );
}
