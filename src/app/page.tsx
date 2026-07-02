import { Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <Building2 className="size-10 text-muted-foreground" strokeWidth={1.5} />
      <h1 className="text-2xl font-semibold tracking-tight">
        Site em construção
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Fundação do projeto pronta (Next.js, Tailwind, shadcn/ui, schema do
        banco). Próximo passo: conectar Supabase para landing page, catálogo e
        painel admin.
      </p>
    </div>
  );
}
