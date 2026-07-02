import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { LeadStatusSelect } from "@/components/admin/lead-row-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: { select: { title: true, slug: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">
          {leads.length} contato(s) recebido(s)
        </p>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Imóvel</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Nenhum contato recebido ainda.
                </TableCell>
              </TableRow>
            )}
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  <div>{lead.email}</div>
                  <div>{lead.phone}</div>
                </TableCell>
                <TableCell>
                  {lead.property ? (
                    <Link
                      href={`/imoveis/${lead.property.slug}`}
                      className="underline"
                      target="_blank"
                    >
                      {lead.property.title}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Contato geral</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(lead.createdAt)}
                </TableCell>
                <TableCell>
                  <LeadStatusSelect id={lead.id} status={lead.status} />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="text-sm underline"
                  >
                    Ver
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
