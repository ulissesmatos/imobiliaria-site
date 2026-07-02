import { Building2 } from "lucide-react";

import { signOut } from "@/lib/actions/auth";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-background px-6 py-3">
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
      </header>
      <main className="flex-1 bg-muted/30 p-6">{children}</main>
    </div>
  );
}
