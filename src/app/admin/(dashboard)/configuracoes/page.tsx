import { prisma } from "@/lib/prisma";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Configurações do site
        </h1>
        <p className="text-sm text-muted-foreground">
          Nome, logo, contato e redes sociais exibidos no site público.
        </p>
      </div>

      <SiteSettingsForm
        defaults={{
          siteName: settings?.siteName,
          aboutText: settings?.aboutText ?? undefined,
          creci: settings?.creci ?? undefined,
          contactEmail: settings?.contactEmail ?? undefined,
          contactPhone: settings?.contactPhone ?? undefined,
          whatsappNumber: settings?.whatsappNumber ?? undefined,
          addressLine: settings?.addressLine ?? undefined,
          primaryColor: settings?.primaryColor ?? undefined,
          instagramUrl: settings?.instagramUrl ?? undefined,
          facebookUrl: settings?.facebookUrl ?? undefined,
          youtubeUrl: settings?.youtubeUrl ?? undefined,
          logoUrl: settings?.logoUrl ?? undefined,
          faviconUrl: settings?.faviconUrl ?? undefined,
          heroImageUrl: settings?.heroImageUrl ?? undefined,
        }}
      />
    </div>
  );
}
