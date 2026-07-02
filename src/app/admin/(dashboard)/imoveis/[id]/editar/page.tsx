import { notFound } from "next/navigation";

import { updateProperty } from "@/lib/actions/properties";
import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!property) {
    notFound();
  }

  const updateAction = updateProperty.bind(null, property.id);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar imóvel
        </h1>
        <p className="text-sm text-muted-foreground">{property.title}</p>
      </div>

      <Tabs defaultValue="dados">
        <TabsList>
          <TabsTrigger value="dados">Dados do imóvel</TabsTrigger>
          <TabsTrigger value="fotos">
            Fotos ({property.images.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dados" className="pt-4">
          <PropertyForm
            mode="edit"
            action={updateAction}
            defaults={{
              title: property.title,
              description: property.description,
              tipoNegocio: property.tipoNegocio,
              tipoImovel: property.tipoImovel,
              status: property.status,
              priceSale: property.priceSale ? Number(property.priceSale) : null,
              priceRent: property.priceRent ? Number(property.priceRent) : null,
              condoFee: property.condoFee ? Number(property.condoFee) : null,
              iptuValue: property.iptuValue ? Number(property.iptuValue) : null,
              showPrice: property.showPrice,
              bedrooms: property.bedrooms,
              suites: property.suites,
              bathrooms: property.bathrooms,
              parkingSpots: property.parkingSpots,
              areaTotal: property.areaTotal ? Number(property.areaTotal) : null,
              areaUsable: property.areaUsable
                ? Number(property.areaUsable)
                : null,
              addressStreet: property.addressStreet,
              addressNumber: property.addressNumber,
              addressComplement: property.addressComplement,
              neighborhood: property.neighborhood,
              city: property.city,
              state: property.state,
              zipCode: property.zipCode,
              featured: property.featured,
            }}
          />
        </TabsContent>
        <TabsContent value="fotos" className="pt-4">
          <ImageUploader
            propertyId={property.id}
            initialImages={property.images.map((image) => ({
              id: image.id,
              url: image.url,
              isCover: image.isCover,
            }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
