import { createProperty } from "@/lib/actions/properties";
import { PropertyForm } from "@/components/admin/property-form";

export default function NewPropertyPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Novo imóvel</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados do imóvel. Depois de salvar, você poderá
          adicionar as fotos.
        </p>
      </div>
      <PropertyForm mode="create" action={createProperty} />
    </div>
  );
}
