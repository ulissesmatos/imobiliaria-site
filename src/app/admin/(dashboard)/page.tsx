import { getSession } from "@/lib/auth/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Olá, {session?.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Login funcionando. Cadastro de imóveis e gestão de leads chegam nas
          próximas etapas.
        </p>
      </div>

      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Imóveis cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">0</p>
        </CardContent>
      </Card>
    </div>
  );
}
