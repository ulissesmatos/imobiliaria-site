import Link from "next/link";

import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const session = await getSession();

  const [propertiesCount, availableCount, newLeadsCount] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: "DISPONIVEL" } }),
    prisma.lead.count({ where: { status: "NOVO" } }),
  ]);

  const cards = [
    { label: "Imóveis cadastrados", value: propertiesCount, href: "/admin/imoveis" },
    { label: "Imóveis disponíveis", value: availableCount, href: "/admin/imoveis" },
    { label: "Leads novos", value: newLeadsCount, href: "/admin/leads" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Olá, {session?.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumo do painel administrativo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-colors hover:bg-muted/30">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{card.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
