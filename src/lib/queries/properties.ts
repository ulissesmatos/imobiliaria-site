import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const PAGE_SIZE = 12;

export type CatalogFilters = {
  negocio?: string;
  tipo?: string;
  cidade?: string;
  precoMin?: number;
  precoMax?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  ordenar?: string;
  pagina?: number;
};

function parseNumber(value: string | undefined) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function parseCatalogSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): CatalogFilters {
  const get = (key: string) => {
    const value = searchParams[key];
    const single = Array.isArray(value) ? value[0] : value;
    return single && single !== "TODOS" && single !== "TODAS"
      ? single
      : undefined;
  };

  return {
    negocio: get("negocio"),
    tipo: get("tipo"),
    cidade: get("cidade"),
    precoMin: parseNumber(get("precoMin")),
    precoMax: parseNumber(get("precoMax")),
    quartos: parseNumber(get("quartos")),
    banheiros: parseNumber(get("banheiros")),
    vagas: parseNumber(get("vagas")),
    ordenar: get("ordenar"),
    pagina: parseNumber(get("pagina")),
  };
}

function buildWhere(filters: CatalogFilters): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = { status: "DISPONIVEL" };

  if (filters.negocio) where.tipoNegocio = filters.negocio as never;
  if (filters.tipo) where.tipoImovel = filters.tipo as never;
  if (filters.cidade) where.city = filters.cidade;
  if (filters.quartos) where.bedrooms = { gte: filters.quartos };
  if (filters.banheiros) where.bathrooms = { gte: filters.banheiros };
  if (filters.vagas) where.parkingSpots = { gte: filters.vagas };

  if (filters.precoMin || filters.precoMax) {
    where.sortPrice = {
      ...(filters.precoMin ? { gte: filters.precoMin } : {}),
      ...(filters.precoMax ? { lte: filters.precoMax } : {}),
    };
  }

  return where;
}

function buildOrderBy(ordenar?: string): Prisma.PropertyOrderByWithRelationInput {
  switch (ordenar) {
    case "menor-preco":
      return { sortPrice: "asc" };
    case "maior-preco":
      return { sortPrice: "desc" };
    default:
      return { publishedAt: "desc" };
  }
}

export async function getCatalogProperties(filters: CatalogFilters) {
  const where = buildWhere(filters);
  const orderBy = buildOrderBy(filters.ordenar);
  const page = Math.max(1, filters.pagina ?? 1);

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        images: { where: { isCover: true }, take: 1 },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getAvailableCities() {
  const cities = await prisma.property.findMany({
    where: { status: "DISPONIVEL" },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  return cities.map((c) => c.city);
}

export async function getFeaturedProperties(take = 6) {
  return prisma.property.findMany({
    where: { status: "DISPONIVEL", featured: true },
    orderBy: { publishedAt: "desc" },
    take,
    include: {
      images: { where: { isCover: true }, take: 1 },
    },
  });
}
