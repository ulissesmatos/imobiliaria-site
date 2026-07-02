import { z } from "zod";

export const siteSettingsSchema = z.object({
  siteName: z.string().min(2, "Informe o nome do site"),
  aboutText: z.string().optional(),
  creci: z.string().optional(),
  contactEmail: z.email("E-mail inválido").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  addressLine: z.string().optional(),
  primaryColor: z.string().optional(),
  instagramUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
