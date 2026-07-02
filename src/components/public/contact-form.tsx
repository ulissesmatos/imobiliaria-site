"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";

import { createLead, type LeadFormState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const initialState: LeadFormState = {};

export function ContactForm({
  propertyId,
  title = "Interessado? Entre em contato",
}: {
  propertyId?: string;
  title?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    createLead,
    initialState
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border bg-muted/30 p-6 text-center">
        <CheckCircle2 className="size-8 text-primary" />
        <p className="font-medium">Mensagem enviada com sucesso!</p>
        <p className="text-sm text-muted-foreground">
          Em breve entraremos em contato.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border bg-background p-6"
    >
      <h3 className="font-semibold">{title}</h3>

      {propertyId && (
        <input type="hidden" name="propertyId" value={propertyId} />
      )}

      {/* honeypot anti-spam: campo invisível, humanos não preenchem */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="empresa">Empresa</label>
        <input
          id="empresa"
          name="empresa"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input id="name" name="name" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input id="email" name="email" type="email" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">Telefone</FieldLabel>
          <Input id="phone" name="phone" type="tel" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="message">Mensagem</FieldLabel>
          <Textarea
            id="message"
            name="message"
            rows={4}
            defaultValue={
              propertyId
                ? "Olá, tenho interesse neste imóvel. Podem me passar mais informações?"
                : undefined
            }
            required
          />
        </Field>
      </FieldGroup>

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}
