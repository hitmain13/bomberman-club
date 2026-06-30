import { PrismaClient, type SpecValueType } from "@prisma/client";

const prisma = new PrismaClient();

interface PartCategorySeed {
  slug: string;
  name: string;
}

interface SpecDefinitionSeed {
  key: string;
  name: string;
  type: SpecValueType;
  unit?: string;
  category?: string;
  enumOptions?: string[];
}

const partCategories: PartCategorySeed[] = [
  { slug: "turbo", name: "Turbina" },
  { slug: "intercooler", name: "Intercooler" },
  { slug: "fuel", name: "Combustível / Injeção" },
  { slug: "intake", name: "Admissão" },
  { slug: "exhaust", name: "Escapamento" },
  { slug: "suspension", name: "Suspensão" },
  { slug: "transmission", name: "Transmissão" },
  { slug: "cooling", name: "Arrefecimento" },
  { slug: "engine", name: "Motor" },
  { slug: "brakes", name: "Freios" },
  { slug: "wheels", name: "Rodas e Pneus" },
  { slug: "electronics", name: "Eletrônica / ECU" },
];

const specDefinitions: SpecDefinitionSeed[] = [
  {
    key: "stage",
    name: "Stage",
    type: "ENUM",
    category: "engine",
    enumOptions: ["Stock", "Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5"],
  },
  { key: "boost", name: "Pressão de turbo", type: "NUMBER", unit: "bar", category: "engine" },
  { key: "compression", name: "Taxa de compressão", type: "STRING", category: "engine" },
  { key: "ecu", name: "Mapeamento / ECU", type: "STRING", category: "electronics" },
  {
    key: "injector",
    name: "Injetores",
    type: "STRING",
    unit: "cc/min",
    category: "fuel",
  },
  { key: "turbo_model", name: "Modelo da turbina", type: "STRING", category: "turbo" },
  {
    key: "launch_control_rpm",
    name: "Launch control",
    type: "NUMBER",
    unit: "rpm",
    category: "electronics",
  },
  {
    key: "drivetrain",
    name: "Tração",
    type: "ENUM",
    enumOptions: ["FWD", "RWD", "AWD", "4WD"],
    category: "transmission",
  },
  {
    key: "transmission_type",
    name: "Câmbio",
    type: "ENUM",
    enumOptions: ["Manual", "Automático", "DSG / DCT", "CVT"],
    category: "transmission",
  },
  {
    key: "intake_type",
    name: "Admissão",
    type: "STRING",
    category: "intake",
  },
  {
    key: "exhaust_type",
    name: "Escapamento",
    type: "STRING",
    category: "exhaust",
  },
  {
    key: "fuel_type",
    name: "Combustível usado",
    type: "ENUM",
    enumOptions: ["Gasolina", "Etanol", "Flex", "Diesel", "E85", "Metanol"],
    category: "fuel",
  },
  {
    key: "has_intercooler",
    name: "Possui intercooler",
    type: "BOOLEAN",
    category: "intercooler",
  },
];

async function seedPartCategories(): Promise<void> {
  for (const category of partCategories) {
    await prisma.partCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }
}

async function seedSpecDefinitions(): Promise<void> {
  for (const spec of specDefinitions) {
    await prisma.specificationDefinition.upsert({
      where: { key: spec.key },
      update: {
        name: spec.name,
        type: spec.type,
        unit: spec.unit ?? null,
        category: spec.category ?? null,
        enumOptions: spec.enumOptions ?? [],
      },
      create: {
        key: spec.key,
        name: spec.name,
        type: spec.type,
        unit: spec.unit ?? null,
        category: spec.category ?? null,
        enumOptions: spec.enumOptions ?? [],
      },
    });
  }
}

async function main(): Promise<void> {
  await seedPartCategories();
  await seedSpecDefinitions();
  process.stdout.write(
    `Seed ok: ${partCategories.length} part categories, ${specDefinitions.length} spec definitions.\n`,
  );
}

main()
  .catch((error: unknown) => {
    process.stderr.write(
      `${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
    );
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
