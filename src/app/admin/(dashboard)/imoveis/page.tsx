import Link from "next/link";
import { Plus, Star } from "lucide-react";

import { prisma } from "@/lib/prisma";
import {
  STATUS_IMOVEL_LABELS,
  TIPO_NEGOCIO_LABELS,
  formatCurrency,
} from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PropertyRowActions } from "@/components/admin/property-row-actions";

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: { where: { isCover: true }, take: 1 },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Imóveis</h1>
          <p className="text-sm text-muted-foreground">
            {properties.length} imóvel(is) cadastrado(s)
          </p>
        </div>
        <Button render={<Link href="/admin/imoveis/novo" />}>
          <Plus className="size-4" /> Novo imóvel
        </Button>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Negócio</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Nenhum imóvel cadastrado ainda.{" "}
                  <Link href="/admin/imoveis/novo" className="underline">
                    Cadastre o primeiro
                  </Link>
                  .
                </TableCell>
              </TableRow>
            )}
            {properties.map((property) => {
              const price =
                property.tipoNegocio === "VENDA"
                  ? property.priceSale
                  : property.priceRent;
              return (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="size-12 overflow-hidden rounded-md bg-muted">
                      {property.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={property.images[0].url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-64">
                    <div className="flex items-center gap-1.5 truncate font-medium">
                      {property.featured && (
                        <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
                      )}
                      <span className="truncate">{property.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {property.neighborhood}, {property.city}
                  </TableCell>
                  <TableCell>
                    {TIPO_NEGOCIO_LABELS[property.tipoNegocio]}
                  </TableCell>
                  <TableCell>
                    {property.showPrice
                      ? (formatCurrency(price?.toString()) ?? "—")
                      : "Consulte"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {STATUS_IMOVEL_LABELS[property.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <PropertyRowActions
                      id={property.id}
                      status={property.status}
                      featured={property.featured}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
