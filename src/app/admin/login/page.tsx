"use client";

import { useActionState } from "react";
import { Building2 } from "lucide-react";

import { signIn, type LoginState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(
    signIn,
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Building2 className="size-8" strokeWidth={1.5} />
          <h1 className="text-xl font-semibold tracking-tight">
            Painel administrativo
          </h1>
          <p className="text-sm text-muted-foreground">
            Entre com seu e-mail e senha para gerenciar os imóveis.
          </p>
        </div>

        <form action={formAction} className="space-y-4 rounded-lg border bg-background p-6 shadow-sm">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </Field>
            {state.error && <FieldError>{state.error}</FieldError>}
          </FieldGroup>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
