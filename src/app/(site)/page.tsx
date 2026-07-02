import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <h1 className="max-w-xl text-3xl font-semibold tracking-tight">
        Encontre o imóvel ideal para você
      </h1>
      <p className="max-w-md text-muted-foreground">
        Landing page completa chega na próxima etapa. Por enquanto, veja os
        imóveis já cadastrados no catálogo.
      </p>
      <Button size="lg" render={<Link href="/imoveis" />}>
        Ver imóveis disponíveis
      </Button>
    </div>
  );
}
