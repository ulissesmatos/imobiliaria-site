import "dotenv/config";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@imobiliaria.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123";

  const admin = await prisma.adminProfile.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash: await hashPassword(password),
      name: "Administrador",
      role: "SUPERADMIN",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "Sua Imobiliária",
      contactEmail: email,
      aboutText:
        "Edite essas informações em Configurações no painel administrativo.",
    },
  });

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
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: {},
      create: {
        ...property,
        createdById: admin.id,
        publishedAt: new Date(),
      },
    });
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
