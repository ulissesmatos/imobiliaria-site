import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";

import type { CatalogFilters } from "@/lib/queries/properties";
import { TIPO_IMOVEL_LABELS, TIPO_NEGOCIO_LABELS } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MIN_OPTIONS = [1, 2, 3, 4];

function FilterFields({
  defaults,
  cities,
}: {
  defaults: CatalogFilters;
  cities: string[];
}) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="negocio">Negócio</FieldLabel>
        <Select name="negocio" defaultValue={defaults.negocio ?? "TODOS"}>
          <SelectTrigger id="negocio" className="w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            {Object.entries(TIPO_NEGOCIO_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="tipo">Tipo de imóvel</FieldLabel>
        <Select name="tipo" defaultValue={defaults.tipo ?? "TODOS"}>
          <SelectTrigger id="tipo" className="w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            {Object.entries(TIPO_IMOVEL_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {cities.length > 0 && (
        <Field>
          <FieldLabel htmlFor="cidade">Cidade</FieldLabel>
          <Select name="cidade" defaultValue={defaults.cidade ?? "TODAS"}>
            <SelectTrigger id="cidade" className="w-full">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODAS">Todas</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="precoMin">Preço mín.</FieldLabel>
          <Input
            id="precoMin"
            name="precoMin"
            type="number"
            min={0}
            defaultValue={defaults.precoMin}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="precoMax">Preço máx.</FieldLabel>
          <Input
            id="precoMax"
            name="precoMax"
            type="number"
            min={0}
            defaultValue={defaults.precoMax}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="quartos">Quartos (mín.)</FieldLabel>
        <Select
          name="quartos"
          defaultValue={defaults.quartos?.toString() ?? "0"}
        >
          <SelectTrigger id="quartos" className="w-full">
            <SelectValue placeholder="Qualquer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Qualquer</SelectItem>
            {MIN_OPTIONS.map((n) => (
              <SelectItem key={n} value={n.toString()}>
                {n}+
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="banheiros">Banheiros (mín.)</FieldLabel>
        <Select
          name="banheiros"
          defaultValue={defaults.banheiros?.toString() ?? "0"}
        >
          <SelectTrigger id="banheiros" className="w-full">
            <SelectValue placeholder="Qualquer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Qualquer</SelectItem>
            {MIN_OPTIONS.map((n) => (
              <SelectItem key={n} value={n.toString()}>
                {n}+
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="vagas">Vagas (mín.)</FieldLabel>
        <Select name="vagas" defaultValue={defaults.vagas?.toString() ?? "0"}>
          <SelectTrigger id="vagas" className="w-full">
            <SelectValue placeholder="Qualquer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Qualquer</SelectItem>
            {MIN_OPTIONS.map((n) => (
              <SelectItem key={n} value={n.toString()}>
                {n}+
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Filtrar
        </Button>
        <Button variant="outline" render={<Link href="/imoveis" />}>
          Limpar
        </Button>
      </div>
    </FieldGroup>
  );
}

export function PropertyFilters({
  defaults,
  cities,
}: {
  defaults: CatalogFilters;
  cities: string[];
}) {
  return (
    <>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="size-4" /> Filtros
              </Button>
            }
          />
          <SheetContent side="left" className="overflow-y-auto p-4">
            <SheetHeader className="px-0">
              <SheetTitle>Filtrar imóveis</SheetTitle>
            </SheetHeader>
            <form method="GET" action="/imoveis" className="mt-4">
              <FilterFields defaults={defaults} cities={cities} />
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden md:block md:w-64 md:shrink-0">
        <form method="GET" action="/imoveis" className="sticky top-4 rounded-lg border bg-background p-4">
          <FilterFields defaults={defaults} cities={cities} />
        </form>
      </aside>
    </>
  );
}
