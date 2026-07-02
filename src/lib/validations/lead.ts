import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.email("E-mail inválido"),
  phone: z.string().min(8, "Informe um telefone válido"),
  message: z.string().min(5, "Escreva uma mensagem"),
  propertyId: z.string().optional(),
  honeypot: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
