"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import type { PropertyFormState } from "@/lib/actions/properties";
import {
  ESTADOS_BR,
  STATUS_IMOVEL_LABELS,
  TIPO_IMOVEL_LABELS,
  TIPO_NEGOCIO_LABELS,
} from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PropertyDefaults = Partial<{
  title: string;
  description: string;
  tipoNegocio: string;
  tipoImovel: string;
  status: string;
  priceSale: number | null;
  priceRent: number | null;
  condoFee: number | null;
  iptuValue: number | null;
  showPrice: boolean;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpots: number;
  areaTotal: number | null;
  areaUsable: number | null;
  addressStreet: string;
  addressNumber: string | null;
  addressComplement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  featured: boolean;
}>;

const initialState: PropertyFormState = {};

export function PropertyForm({
  mode,
  defaults,
  action,
}: {
  mode: "create" | "edit";
  defaults?: PropertyDefaults;
  action: (
    prevState: PropertyFormState,
    formData: FormData
  ) => Promise<PropertyFormState>;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [tipoNegocio, setTipoNegocio] = useState(
    defaults?.tipoNegocio ?? "VENDA"
  );
  const router = useRouter();

  const fieldError = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={formAction} className="space-y-8">
      <FieldSet>
        <FieldLegend>Informações básicas</FieldLegend>
        <FieldGroup>
          <Field data-invalid={!!fieldError("title")}>
            <FieldLabel htmlFor="title">Título do anúncio</FieldLabel>
            <Input
              id="title"
              name="title"
              defaultValue={defaults?.title}
              placeholder="Ex: Apartamento 3 quartos no Jardim América"
              required
            />
            {fieldError("title") && (
              <FieldError>{fieldError("title")}</FieldError>
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="tipoNegocio">Negócio</FieldLabel>
              <Select
                name="tipoNegocio"
                defaultValue={defaults?.tipoNegocio ?? "VENDA"}
                onValueChange={(value) => setTipoNegocio(value as string)}
              >
                <SelectTrigger id="tipoNegocio" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPO_NEGOCIO_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="tipoImovel">Tipo de imóvel</FieldLabel>
              <Select
                name="tipoImovel"
                defaultValue={defaults?.tipoImovel ?? "APARTAMENTO"}
              >
                <SelectTrigger id="tipoImovel" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPO_IMOVEL_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="status">Situação</FieldLabel>
              <Select name="status" defaultValue={defaults?.status ?? "DISPONIVEL"}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_IMOVEL_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field data-invalid={!!fieldError("description")}>
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <Textarea
              id="description"
              name="description"
              defaultValue={defaults?.description}
              rows={5}
              placeholder="Descreva os diferenciais do imóvel, estado de conservação, proximidades..."
              required
            />
            {fieldError("description") && (
              <FieldError>{fieldError("description")}</FieldError>
            )}
          </Field>

          <Field orientation="horizontal">
            <Switch
              id="featured"
              name="featured"
              defaultChecked={defaults?.featured ?? false}
            />
            <FieldLabel htmlFor="featured" className="font-normal">
              Destacar este imóvel na página inicial
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Preço</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <Switch
              id="showPrice"
              name="showPrice"
              defaultChecked={defaults?.showPrice ?? true}
            />
            <FieldLabel htmlFor="showPrice" className="font-normal">
              Exibir o valor publicamente (se desligado, mostra botão
              &quot;Consulte&quot;)
            </FieldLabel>
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            {tipoNegocio === "VENDA" ? (
              <Field data-invalid={!!fieldError("priceSale")}>
                <FieldLabel htmlFor="priceSale">Preço de venda (R$)</FieldLabel>
                <Input
                  id="priceSale"
                  name="priceSale"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={defaults?.priceSale ?? undefined}
                />
                {fieldError("priceSale") && (
                  <FieldError>{fieldError("priceSale")}</FieldError>
                )}
              </Field>
            ) : (
              <Field data-invalid={!!fieldError("priceRent")}>
                <FieldLabel htmlFor="priceRent">Valor do aluguel (R$)</FieldLabel>
                <Input
                  id="priceRent"
                  name="priceRent"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={defaults?.priceRent ?? undefined}
                />
                {fieldError("priceRent") && (
                  <FieldError>{fieldError("priceRent")}</FieldError>
                )}
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="condoFee">Condomínio (R$)</FieldLabel>
              <Input
                id="condoFee"
                name="condoFee"
                type="number"
                min={0}
                step="0.01"
                defaultValue={defaults?.condoFee ?? undefined}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="iptuValue">IPTU (R$)</FieldLabel>
              <Input
                id="iptuValue"
                name="iptuValue"
                type="number"
                min={0}
                step="0.01"
                defaultValue={defaults?.iptuValue ?? undefined}
              />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Características</FieldLegend>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field>
              <FieldLabel htmlFor="bedrooms">Quartos</FieldLabel>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min={0}
                defaultValue={defaults?.bedrooms ?? 0}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="suites">Suítes</FieldLabel>
              <Input
                id="suites"
                name="suites"
                type="number"
                min={0}
                defaultValue={defaults?.suites ?? 0}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bathrooms">Banheiros</FieldLabel>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min={0}
                defaultValue={defaults?.bathrooms ?? 0}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="parkingSpots">Vagas</FieldLabel>
              <Input
                id="parkingSpots"
                name="parkingSpots"
                type="number"
                min={0}
                defaultValue={defaults?.parkingSpots ?? 0}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="areaUsable">Área privativa (m²)</FieldLabel>
              <Input
                id="areaUsable"
                name="areaUsable"
                type="number"
                min={0}
                step="0.01"
                defaultValue={defaults?.areaUsable ?? undefined}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="areaTotal">Área total/terreno (m²)</FieldLabel>
              <Input
                id="areaTotal"
                name="areaTotal"
                type="number"
                min={0}
                step="0.01"
                defaultValue={defaults?.areaTotal ?? undefined}
              />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Endereço</FieldLegend>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <Field data-invalid={!!fieldError("addressStreet")}>
              <FieldLabel htmlFor="addressStreet">Rua</FieldLabel>
              <Input
                id="addressStreet"
                name="addressStreet"
                defaultValue={defaults?.addressStreet}
                required
              />
              {fieldError("addressStreet") && (
                <FieldError>{fieldError("addressStreet")}</FieldError>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="addressNumber">Número</FieldLabel>
              <Input
                id="addressNumber"
                name="addressNumber"
                defaultValue={defaults?.addressNumber ?? undefined}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="addressComplement">Complemento</FieldLabel>
            <Input
              id="addressComplement"
              name="addressComplement"
              defaultValue={defaults?.addressComplement ?? undefined}
              placeholder="Bloco, apto, referência..."
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-4">
            <Field data-invalid={!!fieldError("neighborhood")}>
              <FieldLabel htmlFor="neighborhood">Bairro</FieldLabel>
              <Input
                id="neighborhood"
                name="neighborhood"
                defaultValue={defaults?.neighborhood}
                required
              />
              {fieldError("neighborhood") && (
                <FieldError>{fieldError("neighborhood")}</FieldError>
              )}
            </Field>
            <Field data-invalid={!!fieldError("city")}>
              <FieldLabel htmlFor="city">Cidade</FieldLabel>
              <Input
                id="city"
                name="city"
                defaultValue={defaults?.city}
                required
              />
              {fieldError("city") && <FieldError>{fieldError("city")}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="state">UF</FieldLabel>
              <Select name="state" defaultValue={defaults?.state ?? "SP"}>
                <SelectTrigger id="state" className="w-full">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_BR.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field data-invalid={!!fieldError("zipCode")}>
              <FieldLabel htmlFor="zipCode">CEP</FieldLabel>
              <Input
                id="zipCode"
                name="zipCode"
                defaultValue={defaults?.zipCode}
                placeholder="00000-000"
                required
              />
              {fieldError("zipCode") && (
                <FieldError>{fieldError("zipCode")}</FieldError>
              )}
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      {state.error && (
        <FieldDescription className="text-destructive">
          {state.error}
        </FieldDescription>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Salvando..."
            : mode === "create"
              ? "Criar imóvel e continuar para fotos"
              : "Salvar alterações"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/imoveis")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
