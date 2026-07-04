import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { PrismaClient } from "@prisma/client";

import { getReverseGeocodeService } from "../src/shared/geo/reverse-geocode";

const CHECKPOINT_FILE = resolve(import.meta.dir, ".backfill-street-checkpoint.json");
const THROTTLE_MS = 1_100;
const BATCH_SIZE = 50;

interface Checkpoint {
  lastId: string | null;
  processed: number;
  updated: number;
  skipped: number;
  failed: number;
}

async function loadCheckpoint(): Promise<Checkpoint> {
  try {
    const raw = await readFile(CHECKPOINT_FILE, "utf8");
    return JSON.parse(raw) as Checkpoint;
  } catch {
    return { lastId: null, processed: 0, updated: 0, skipped: 0, failed: 0 };
  }
}

async function saveCheckpoint(checkpoint: Checkpoint): Promise<void> {
  await writeFile(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => {
    setTimeout(resolveSleep, ms);
  });
}

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  const geocode = getReverseGeocodeService();
  const checkpoint = await loadCheckpoint();

  console.info("Iniciando backfill de street…", checkpoint);

  while (true) {
    const rows = await prisma.sighting.findMany({
      where: {
        street: null,
        ...(checkpoint.lastId ? { id: { gt: checkpoint.lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH_SIZE,
      select: { id: true, latitude: true, longitude: true, locationLabel: true },
    });

    if (rows.length === 0) {
      break;
    }

    for (const row of rows) {
      checkpoint.lastId = row.id;
      checkpoint.processed += 1;

      const existing = row.locationLabel?.trim();
      if (existing) {
        await prisma.sighting.update({
          where: { id: row.id },
          data: { street: existing, locationLabel: existing },
        });
        checkpoint.updated += 1;
        checkpoint.skipped += 1;
        console.info(`[skip-copy] ${row.id} ← locationLabel`);
        continue;
      }

      const street = await geocode.resolve(row.latitude, row.longitude);
      if (street) {
        await prisma.sighting.update({
          where: { id: row.id },
          data: { street, locationLabel: street },
        });
        checkpoint.updated += 1;
        console.info(`[geocode] ${row.id} → ${street}`);
      } else {
        checkpoint.failed += 1;
        console.warn(`[fail] ${row.id} — geocode retornou null`);
      }

      await saveCheckpoint(checkpoint);
      await sleep(THROTTLE_MS);
    }
  }

  const metrics = geocode.getMetrics();
  console.info("Backfill concluído.", { checkpoint, metrics });
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
