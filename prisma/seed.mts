import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";

import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function ensureAdminAuthUser(email: string, password: string) {
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users.find((u) => u.email === email);
  if (found) return found;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`Falha ao criar usuário no Supabase Auth: ${error?.message}`);
  }
  return data.user;
}

const generatedHeroImageUrl = "/uploads/generated/hero-home.webp";

type GeneratedPropertyImage = {
  name: string;
  altText: string;
};

const generatedPropertyImages: Record<string, GeneratedPropertyImage[]> = {
  "apartamento-3-quartos-jardim-america-sao-paulo": [
    { name: "apartamento-jardim-america-1", altText: "Sala de estar integrada com janela ampla." },
    { name: "apartamento-jardim-america-2", altText: "Sala de estar com iluminação natural." },
    { name: "apartamento-jardim-america-3", altText: "Ambiente integrado com sofá e decoração moderna." },
    { name: "apartamento-jardim-america-4", altText: "Sala de estar com almofadas e acabamento clean." },
  ],
  "casa-2-quartos-vila-madalena-sao-paulo": [
    { name: "casa-vila-madalena-1", altText: "Fachada de casa moderna." },
    { name: "casa-vila-madalena-2", altText: "Vista externa da casa." },
    { name: "casa-vila-madalena-3", altText: "Fachada com detalhes em madeira." },
    { name: "casa-vila-madalena-4", altText: "Área externa da residência." },
  ],
  "cobertura-vista-mar-copacabana-rio-de-janeiro": [
    { name: "cobertura-copacabana-1", altText: "Vista panorâmica para o mar." },
    { name: "cobertura-copacabana-2", altText: "Ambiente com vista para o mar." },
    { name: "cobertura-copacabana-3", altText: "Quarto com vista para o mar ao entardecer." },
    { name: "cobertura-copacabana-4", altText: "Varanda com vista para o mar." },
  ],
  "kitnet-mobiliada-centro-campinas": [
    { name: "kitnet-campinas-1", altText: "Kitnet mobiliada com cozinha integrada." },
    { name: "kitnet-campinas-2", altText: "Ambiente compacto e funcional." },
    { name: "kitnet-campinas-3", altText: "Quarto com cama e mesa de trabalho." },
  ],
  "terreno-praia-grande-santos": [
    { name: "terreno-santos-1", altText: "Terreno gramado plano." },
    { name: "terreno-santos-2", altText: "Vista geral do terreno." },
  ],
};

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@imobiliaria.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";

  const authUser = await ensureAdminAuthUser(email, password);

  const admin = await prisma.adminProfile.upsert({
    where: { id: authUser.id },
    update: { email },
    create: {
      id: authUser.id,
      email,
      name: "Administrador",
      role: "SUPERADMIN",
    },
  });

  const settings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "Sua Imobiliária",
      contactEmail: email,
      aboutText:
        "Edite essas informações em Configurações no painel administrativo.",
      heroImageUrl: generatedHeroImageUrl,
    },
  });

  if (!settings.heroImageUrl) {
    await prisma.siteSettings.update({
      where: { id: 1 },
      data: { heroImageUrl: generatedHeroImageUrl },
    });
  }

  const sampleProperties = [
    {
      slug: "apartamento-3-quartos-jardim-america-sao-paulo",
      title: "Apartamento 3 quartos no Jardim América",
      description:
        "Lindo apartamento reformado, próximo ao metrô, com varanda gourmet e vista livre. Prédio com portaria 24h, salão de festas e academia.",
      tipoNegocio: "VENDA" as const,
      tipoImovel: "APARTAMENTO" as const,
      status: "DISPONIVEL" as const,
      priceSale: 650000,
      condoFee: 800,
      iptuValue: 150,
      showPrice: true,
      sortPrice: 650000,
      bedrooms: 3,
      suites: 1,
      bathrooms: 2,
      parkingSpots: 2,
      areaUsable: 95,
      areaTotal: 95,
      addressStreet: "Rua Augusta",
      addressNumber: "1200",
      neighborhood: "Jardim América",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-100",
      featured: true,
    },
    {
      slug: "casa-2-quartos-vila-madalena-sao-paulo",
      title: "Casa 2 quartos na Vila Madalena para alugar",
      description:
        "Casa térrea com quintal, ideal para quem busca tranquilidade perto de bares e restaurantes da região.",
      tipoNegocio: "ALUGUEL" as const,
      tipoImovel: "CASA" as const,
      status: "DISPONIVEL" as const,
      priceRent: 3800,
      condoFee: null,
      iptuValue: 90,
      showPrice: true,
      sortPrice: 3800,
      bedrooms: 2,
      suites: 0,
      bathrooms: 1,
      parkingSpots: 1,
      areaUsable: 70,
      areaTotal: 120,
      addressStreet: "Rua Harmonia",
      addressNumber: "450",
      neighborhood: "Vila Madalena",
      city: "São Paulo",
      state: "SP",
      zipCode: "05435-000",
      featured: false,
    },
    {
      slug: "cobertura-vista-mar-copacabana-rio-de-janeiro",
      title: "Cobertura duplex com vista para o mar em Copacabana",
      description:
        "Cobertura exclusiva com piscina privativa, terraço gourmet e vista panorâmica para o mar. Acabamento de altíssimo padrão.",
      tipoNegocio: "VENDA" as const,
      tipoImovel: "COBERTURA" as const,
      status: "DISPONIVEL" as const,
      priceSale: 4200000,
      condoFee: 2100,
      iptuValue: 900,
      showPrice: false,
      sortPrice: 4200000,
      bedrooms: 4,
      suites: 4,
      bathrooms: 5,
      parkingSpots: 3,
      areaUsable: 280,
      areaTotal: 320,
      addressStreet: "Avenida Atlântica",
      addressNumber: "2500",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "22021-001",
      featured: true,
    },
    {
      slug: "kitnet-mobiliada-centro-campinas",
      title: "Kitnet mobiliada no Centro de Campinas",
      description:
        "Kitnet compacta e mobiliada, perfeita para estudantes. A poucos minutos da Unicamp e do centro comercial.",
      tipoNegocio: "ALUGUEL" as const,
      tipoImovel: "KITNET_STUDIO" as const,
      status: "DISPONIVEL" as const,
      priceRent: 1200,
      condoFee: 250,
      iptuValue: null,
      showPrice: true,
      sortPrice: 1200,
      bedrooms: 1,
      suites: 0,
      bathrooms: 1,
      parkingSpots: 0,
      areaUsable: 28,
      areaTotal: 28,
      addressStreet: "Rua Barão de Jaguara",
      addressNumber: "800",
      neighborhood: "Centro",
      city: "Campinas",
      state: "SP",
      zipCode: "13015-001",
      featured: false,
    },
    {
      slug: "terreno-praia-grande-santos",
      title: "Terreno plano a 200m da praia em Santos",
      description:
        "Terreno plano, murado, em rua tranquila e residencial, a apenas dois quarteirões da praia.",
      tipoNegocio: "VENDA" as const,
      tipoImovel: "TERRENO_LOTE" as const,
      status: "RESERVADO" as const,
      priceSale: 380000,
      condoFee: null,
      iptuValue: 60,
      showPrice: true,
      sortPrice: 380000,
      bedrooms: 0,
      suites: 0,
      bathrooms: 0,
      parkingSpots: 0,
      areaUsable: null,
      areaTotal: 300,
      addressStreet: "Rua Marechal Hermes",
      addressNumber: "s/n",
      neighborhood: "Aparecida",
      city: "Santos",
      state: "SP",
      zipCode: "11035-000",
      featured: false,
    },
  ];

  for (const property of sampleProperties) {
    const savedProperty = await prisma.property.upsert({
      where: { slug: property.slug },
      update: {},
      create: {
        ...property,
        createdById: admin.id,
        publishedAt: new Date(),
      },
    });

    const images = generatedPropertyImages[property.slug] ?? [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const storagePath = `uploads/generated/${image.name}.webp`;

      const existingImage = await prisma.propertyImage.findFirst({
        where: { propertyId: savedProperty.id, storagePath },
      });

      if (!existingImage) {
        await prisma.propertyImage.create({
          data: {
            propertyId: savedProperty.id,
            url: `/${storagePath}`,
            storagePath,
            order: i,
            isCover: i === 0,
            altText: image.altText,
          },
        });
      }
    }
  }

  console.log("Seed concluído.");
  console.log(`Admin: ${admin.email}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`Senha (padrão de dev): ${password}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
