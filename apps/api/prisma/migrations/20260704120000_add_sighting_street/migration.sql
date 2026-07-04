-- AlterTable
ALTER TABLE "Sighting" ADD COLUMN "street" TEXT;

-- Backfill from existing locationLabel where available
UPDATE "Sighting" SET "street" = "locationLabel" WHERE "locationLabel" IS NOT NULL AND "street" IS NULL;
