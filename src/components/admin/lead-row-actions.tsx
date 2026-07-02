"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { updateLeadStatus } from "@/lib/actions/leads";
import { STATUS_LEAD_LABELS } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LeadStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string | null) {
    if (!value) return;
    startTransition(async () => {
      await updateLeadStatus(id, value);
      toast.success("Status atualizado.");
    });
  }

  return (
    <Select defaultValue={status} onValueChange={handleChange}>
      <SelectTrigger size="sm" disabled={isPending} className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_LEAD_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
