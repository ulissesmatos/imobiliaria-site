import Link from "next/link";

import {
  getAvailableCities,
  getCatalogProperties,
  parseCatalogSearchParams,
} from "@/lib/queries/properties";
import { PropertyCard } from "@/components/public/property-card";
import { PropertyFilters } from "@/components/public/property-filters";
import { PropertySort } from "@/components/public/property-sort";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const metadata = {
  title: "Imóveis",
};

function buildPageHref(
  searchParams: Record<string, string | string[] | undefined>,
  page: number
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (!value || key === "pagina") continue;
    params.set(key, Array.isArray(value) ? value[0] : value);
  }
  params.set("pagina", page.toString());
  return `/imoveis?${params.toString()}`;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawSearchParams = await searchParams;
  const filters = parseCatalogSearchParams(rawSearchParams);

  const [{ items, total, page, totalPages }, cities] = await Promise.all([
    getCatalogProperties(filters),
    getAvailableCities(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Imóveis</h1>
        <p className="text-sm text-muted-foreground">
          {total} imóvel(is) encontrado(s)
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <PropertyFilters defaults={filters} cities={cities} />

        <div className="flex-1 space-y-6">
          <div className="flex justify-end">
            <PropertySort current={filters.ordenar} />
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
              <p>Nenhum imóvel encontrado com esses filtros.</p>
              <Link href="/imoveis" className="mt-2 inline-block underline">
                Limpar filtros
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={buildPageHref(rawSearchParams, Math.max(1, page - 1))}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={buildPageHref(rawSearchParams, p)}
                        isActive={p === page}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href={buildPageHref(
                      rawSearchParams,
                      Math.min(totalPages, page + 1)
                    )}
                    className={
                      page >= totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
