import Link from "next/link";
import { Building2 } from "lucide-react";

import { signOut } from "@/lib/actions/auth";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/imoveis", label: "Imóveis" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background px-6 py-3 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="size-5" strokeWidth={1.5} />
            Painel Administrativo
          </div>
          <div className="flex items-center gap-4">
            {session && (
              <span className="text-sm text-muted-foreground">
                {session.name}
              </span>
            )}
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </div>
        <nav className="mx-auto mt-3 flex max-w-6xl gap-4 text-sm text-muted-foreground">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1 bg-muted/30 px-6 py-6 sm:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
