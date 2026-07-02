import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { LeadStatusSelect } from "@/components/admin/lead-row-actions";
import { LeadNotesForm } from "@/components/admin/lead-notes-form";
import { Card, CardContent } from "@/components/ui/card";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { property: { select: { title: true, slug: true } } },
  });

  if (!lead) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/admin/leads"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar para leads
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
          <p className="text-sm text-muted-foreground">
            Recebido em {formatDate(lead.createdAt)}
          </p>
        </div>
        <LeadStatusSelect id={lead.id} status={lead.status} />
      </div>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <div>
            <p className="text-xs text-muted-foreground">E-mail</p>
            <p>{lead.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Telefone</p>
            <p>{lead.phone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Imóvel de interesse</p>
            {lead.property ? (
              <Link
                href={`/imoveis/${lead.property.slug}`}
                target="_blank"
                className="underline"
              >
                {lead.property.title}
              </Link>
            ) : (
              <p className="text-muted-foreground">Contato geral (institucional)</p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mensagem</p>
            <p className="whitespace-pre-line">{lead.message}</p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-2 font-medium">Anotações internas</h2>
        <LeadNotesForm id={lead.id} initialNotes={lead.internalNotes ?? ""} />
      </div>
    </div>
  );
}
