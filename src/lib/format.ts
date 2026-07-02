export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatCurrency(value: unknown) {
  if (value === null || value === undefined) return null;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function formatArea(value: unknown) {
  if (value === null || value === undefined) return null;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return null;
  return `${new Intl.NumberFormat("pt-BR").format(numeric)} m²`;
}

export const TIPO_NEGOCIO_LABELS: Record<string, string> = {
  VENDA: "Venda",
  ALUGUEL: "Aluguel",
};

export const TIPO_IMOVEL_LABELS: Record<string, string> = {
  APARTAMENTO: "Apartamento",
  CASA: "Casa",
  CASA_CONDOMINIO: "Casa em condomínio",
  COBERTURA: "Cobertura",
  KITNET_STUDIO: "Kitnet/Studio",
  TERRENO_LOTE: "Terreno/Lote",
  SALA_COMERCIAL: "Sala comercial",
  GALPAO: "Galpão",
  CHACARA_SITIO_FAZENDA: "Chácara/Sítio/Fazenda",
  OUTRO: "Outro",
};

export const STATUS_IMOVEL_LABELS: Record<string, string> = {
  DISPONIVEL: "Disponível",
  RESERVADO: "Reservado",
  VENDIDO: "Vendido",
  ALUGADO: "Alugado",
  INATIVO: "Inativo",
};

export const STATUS_LEAD_LABELS: Record<string, string> = {
  NOVO: "Novo",
  EM_CONTATO: "Em contato",
  VISITA_AGENDADA: "Visita agendada",
  FECHADO: "Fechado",
  PERDIDO: "Perdido",
};

export const ESTADOS_BR = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;
