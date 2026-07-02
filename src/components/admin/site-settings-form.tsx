"use client";

import { useActionState } from "react";

import {
  updateSiteSettings,
  type SiteSettingsFormState,
} from "@/lib/actions/site-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";

export type SiteSettingsDefaults = Partial<{
  siteName: string;
  aboutText: string;
  creci: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  addressLine: string;
  primaryColor: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  logoUrl: string;
  faviconUrl: string;
  heroImageUrl: string;
}>;

const initialState: SiteSettingsFormState = {};

export function SiteSettingsForm({
  defaults,
}: {
  defaults: SiteSettingsDefaults;
}) {
  const [state, formAction, isPending] = useActionState(
    updateSiteSettings,
    initialState
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      <FieldSet>
        <FieldLegend>Identidade</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="siteName">Nome da imobiliária</FieldLabel>
            <Input id="siteName" name="siteName" defaultValue={defaults.siteName} required />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="logo">Logo</FieldLabel>
              {defaults.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={defaults.logoUrl} alt="Logo atual" className="mb-1 h-10 object-contain" />
              )}
              <Input id="logo" name="logo" type="file" accept="image/*" />
            </Field>
            <Field>
              <FieldLabel htmlFor="favicon">Favicon</FieldLabel>
              {defaults.faviconUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={defaults.faviconUrl} alt="Favicon atual" className="mb-1 size-8 object-contain" />
              )}
              <Input id="favicon" name="favicon" type="file" accept="image/*" />
            </Field>
            <Field>
              <FieldLabel htmlFor="primaryColor">Cor principal</FieldLabel>
              <Input
                id="primaryColor"
                name="primaryColor"
                type="color"
                defaultValue={defaults.primaryColor ?? "#171717"}
                className="h-8 w-full p-1"
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="hero">Foto de destaque da home</FieldLabel>
            {defaults.heroImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={defaults.heroImageUrl} alt="Foto atual" className="mb-1 h-32 w-full rounded-md object-cover" />
            )}
            <Input id="hero" name="hero" type="file" accept="image/*" />
          </Field>

          <Field>
            <FieldLabel htmlFor="aboutText">Sobre a imobiliária</FieldLabel>
            <Textarea
              id="aboutText"
              name="aboutText"
              rows={4}
              defaultValue={defaults.aboutText}
            />
            <FieldDescription>
              Aparece na home e na página Sobre.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Contato</FieldLegend>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="contactEmail">
                E-mail (recebe os leads)
              </FieldLabel>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={defaults.contactEmail}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="contactPhone">Telefone</FieldLabel>
              <Input
                id="contactPhone"
                name="contactPhone"
                defaultValue={defaults.contactPhone}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="whatsappNumber">WhatsApp</FieldLabel>
              <Input
                id="whatsappNumber"
                name="whatsappNumber"
                placeholder="5511999999999"
                defaultValue={defaults.whatsappNumber}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="creci">CRECI</FieldLabel>
              <Input id="creci" name="creci" defaultValue={defaults.creci} />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="addressLine">Endereço do escritório</FieldLabel>
            <Input
              id="addressLine"
              name="addressLine"
              defaultValue={defaults.addressLine}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend>Redes sociais</FieldLegend>
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="instagramUrl">Instagram</FieldLabel>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                defaultValue={defaults.instagramUrl}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="facebookUrl">Facebook</FieldLabel>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                defaultValue={defaults.facebookUrl}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="youtubeUrl">YouTube</FieldLabel>
              <Input
                id="youtubeUrl"
                name="youtubeUrl"
                defaultValue={defaults.youtubeUrl}
              />
            </Field>
          </div>
        </FieldGroup>
      </FieldSet>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-primary">Configurações salvas com sucesso!</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar configurações"}
      </Button>
    </form>
  );
}
