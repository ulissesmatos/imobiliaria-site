import { z } from "zod";

const optionalNumber = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  const n = typeof val === "string" ? Number(val) : val;
  return Number.isNaN(n) ? undefined : n;
}, z.number().nonnegative().optional());

const requiredNumber = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  const n = typeof val === "string" ? Number(val) : val;
  return Number.isNaN(n) ? undefined : n;
}, z.number().int().nonnegative());

export const propertySchema = z
  .object({
    title: z.string().min(5, "Título muito curto").max(150),
    description: z.string().min(10, "Descreva melhor o imóvel").max(5000),
    tipoNegocio: z.enum(["VENDA", "ALUGUEL"]),
    tipoImovel: z.enum([
      "APARTAMENTO",
      "CASA",
      "CASA_CONDOMINIO",
      "COBERTURA",
      "KITNET_STUDIO",
      "TERRENO_LOTE",
      "SALA_COMERCIAL",
      "GALPAO",
      "CHACARA_SITIO_FAZENDA",
      "OUTRO",
    ]),
    status: z
      .enum(["DISPONIVEL", "RESERVADO", "VENDIDO", "ALUGADO", "INATIVO"])
      .default("DISPONIVEL"),

    priceSale: optionalNumber,
    priceRent: optionalNumber,
    condoFee: optionalNumber,
    iptuValue: optionalNumber,
    showPrice: z.preprocess(
      (val) => val === "on" || val === true || val === "true",
      z.boolean()
    ),

    bedrooms: requiredNumber.default(0),
    suites: requiredNumber.default(0),
    bathrooms: requiredNumber.default(0),
    parkingSpots: requiredNumber.default(0),
    areaTotal: optionalNumber,
    areaUsable: optionalNumber,

    addressStreet: z.string().min(2, "Informe a rua"),
    addressNumber: z.string().max(20).optional(),
    addressComplement: z.string().max(100).optional(),
    neighborhood: z.string().min(2, "Informe o bairro"),
    city: z.string().min(2, "Informe a cidade"),
    state: z.string().length(2, "UF deve ter 2 letras"),
    zipCode: z.string().min(8, "CEP inválido").max(9),
    latitude: optionalNumber,
    longitude: optionalNumber,

    featured: z.preprocess(
      (val) => val === "on" || val === true || val === "true",
      z.boolean()
    ),
  })
  .refine(
    (data) =>
      data.tipoNegocio !== "VENDA" ||
      (data.priceSale !== undefined && data.priceSale > 0) ||
      !data.showPrice,
    {
      message: "Informe o preço de venda ou desative a exibição de preço",
      path: ["priceSale"],
    }
  )
  .refine(
    (data) =>
      data.tipoNegocio !== "ALUGUEL" ||
      (data.priceRent !== undefined && data.priceRent > 0) ||
      !data.showPrice,
    {
      message: "Informe o valor do aluguel ou desative a exibição de preço",
      path: ["priceRent"],
    }
  );

export type PropertyInput = z.infer<typeof propertySchema>;
