"use client";

import { useTransition } from "react";
import Link from "next/link";
import { MoreHorizontal, Star, StarOff } from "lucide-react";
import { toast } from "sonner";

import {
  deleteProperty,
  toggleFeatured,
  updatePropertyStatus,
} from "@/lib/actions/properties";
import { STATUS_IMOVEL_LABELS } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PropertyRowActions({
  id,
  status,
  featured,
}: {
  id: string;
  status: string;
  featured: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(newStatus: string) {
    startTransition(async () => {
      await updatePropertyStatus(id, newStatus);
      toast.success("Situação atualizada.");
    });
  }

  function handleToggleFeatured() {
    startTransition(async () => {
      await toggleFeatured(id, !featured);
      toast.success(featured ? "Destaque removido." : "Imóvel destacado.");
    });
  }

  function handleDelete() {
    if (!window.confirm("Excluir este imóvel e todas as suas fotos? Essa ação não pode ser desfeita.")) {
      return;
    }
    startTransition(async () => {
      await deleteProperty(id);
      toast.success("Imóvel excluído.");
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" disabled={isPending}>
            <MoreHorizontal className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          render={<Link href={`/admin/imoveis/${id}/editar`}>Editar</Link>}
        />
        <DropdownMenuItem onClick={handleToggleFeatured}>
          {featured ? (
            <>
              <StarOff className="size-4" /> Remover destaque
            </>
          ) : (
            <>
              <Star className="size-4" /> Destacar na home
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {Object.entries(STATUS_IMOVEL_LABELS)
          .filter(([value]) => value !== status)
          .map(([value, label]) => (
            <DropdownMenuItem
              key={value}
              onClick={() => handleStatusChange(value)}
            >
              Marcar como {label}
            </DropdownMenuItem>
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleDelete}
        >
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
