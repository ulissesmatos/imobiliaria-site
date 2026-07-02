"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateLeadNotes } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function LeadNotesForm({
  id,
  initialNotes,
}: {
  id: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateLeadNotes(id, notes);
      toast.success("Anotações salvas.");
    });
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Anotações internas sobre este contato..."
      />
      <Button size="sm" onClick={handleSave} disabled={isPending}>
        {isPending ? "Salvando..." : "Salvar anotações"}
      </Button>
    </div>
  );
}
