import { notFound } from "next/navigation";
import { Bath, BedDouble, Car, MapPin, Ruler } from "lucide-react";

import { prisma } from "@/lib/prisma";
import {
  STATUS_IMOVEL_LABELS,
  TIPO_IMOVEL_LABELS,
  TIPO_NEGOCIO_LABELS,
  formatArea,
  formatCurrency,
} from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { PropertyGallery } from "@/components/public/property-gallery";
import { ContactForm } from "@/components/public/contact-form";

async function getProperty(slug: string) {
  const property = await prisma.property.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!property) return null;

  prisma.property
    .update({
      where: { id: property.id },
      data: { viewsCount: { increment: 1 } },
    })
    .catch(() => {});

  return property;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
    select: { title: true, description: true },
  });
  if (!property) return {};
  return {
    title: property.title,
    description: property.description.slice(0, 160),
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    notFound();
  }

  const price =
    property.tipoNegocio === "VENDA" ? property.priceSale : property.priceRent;
  const priceLabel = property.showPrice
    ? (formatCurrency(price) ?? "Consulte")
    : "Consulte";
  const canContact =
    property.status === "DISPONIVEL" || property.status === "RESERVADO";

  const specs = [
    { icon: BedDouble, label: "Quartos", value: property.bedrooms },
    { icon: Bath, label: "Banheiros", value: property.bathrooms },
    { icon: Car, label: "Vagas", value: property.parkingSpots },
    {
      icon: Ruler,
      label: "Área privativa",
      value: formatArea(property.areaUsable) ?? "—",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <PropertyGallery images={property.images} title={property.title} />

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {TIPO_NEGOCIO_LABELS[property.tipoNegocio]}
              </Badge>
              <Badge variant="outline">
                {TIPO_IMOVEL_LABELS[property.tipoImovel]}
              </Badge>
              {property.status !== "DISPONIVEL" && (
                <Badge variant="outline">
                  {STATUS_IMOVEL_LABELS[property.status]}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {property.title}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-4 shrink-0" />
              {property.addressStreet}
              {property.addressNumber ? `, ${property.addressNumber}` : ""}
              {property.addressComplement ? ` - ${property.addressComplement}` : ""}
              {" · "}
              {property.neighborhood}, {property.city} - {property.state}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label} className="flex flex-col items-center gap-1 text-center">
                <spec.icon className="size-5 text-muted-foreground" />
                <span className="font-medium">{spec.value}</span>
                <span className="text-xs text-muted-foreground">{spec.label}</span>
              </div>
            ))}
          </div>

          <div>
            <h2 className="mb-2 font-semibold">Descrição</h2>
            <p className="whitespace-pre-line text-muted-foreground">
              {property.description}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-background p-6">
            <p className="text-sm text-muted-foreground">
              {property.tipoNegocio === "VENDA" ? "Preço de venda" : "Aluguel"}
            </p>
            <p className="text-2xl font-semibold">{priceLabel}</p>
            {property.tipoNegocio === "ALUGUEL" && property.condoFee && (
              <p className="text-sm text-muted-foreground">
                + {formatCurrency(property.condoFee)} condomínio
              </p>
            )}
            {property.iptuValue && (
              <p className="text-sm text-muted-foreground">
                IPTU: {formatCurrency(property.iptuValue)}
              </p>
            )}
          </div>

          {canContact ? (
            <ContactForm propertyId={property.id} />
          ) : (
            <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              Este imóvel não está mais disponível.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
