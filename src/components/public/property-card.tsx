import Link from "next/link";
import { BedDouble, Building2, Car, MapPin, ShowerHead } from "lucide-react";

import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export type PropertyCardData = {
  slug: string;
  title: string;
  neighborhood: string;
  city: string;
  tipoNegocio: string;
  showPrice: boolean;
  priceSale: unknown;
  priceRent: unknown;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  areaUsable: unknown;
  images: { url: string }[];
};

export function PropertyCard({ property }: { property: PropertyCardData }) {
  const price =
    property.tipoNegocio === "VENDA" ? property.priceSale : property.priceRent;
  const priceLabel = property.showPrice
    ? (formatCurrency(price) ?? "Consulte")
    : "Consulte";
  const cover = property.images[0]?.url;

  return (
    <Link
      href={`/imoveis/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-background transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Building2 className="size-10 text-muted-foreground/40" strokeWidth={1.5} />
          </div>
        )}
        <Badge className="absolute top-2 left-2" variant="secondary">
          {property.tipoNegocio === "VENDA" ? "Venda" : "Aluguel"}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="line-clamp-2 font-medium leading-snug">{property.title}</p>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          {property.neighborhood}, {property.city}
        </p>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble className="size-4" /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <ShowerHead className="size-4" /> {property.bathrooms}
            </span>
          )}
          {property.parkingSpots > 0 && (
            <span className="flex items-center gap-1">
              <Car className="size-4" /> {property.parkingSpots}
            </span>
          )}
        </div>

        <p className="mt-auto pt-2 text-lg font-semibold">{priceLabel}</p>
      </div>
    </Link>
  );
}
