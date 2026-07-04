-- CreateTable
CREATE TABLE "SightingImage" (
    "id" TEXT NOT NULL,
    "sightingId" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SightingImage_pkey" PRIMARY KEY ("id")
);

-- Backfill from existing single-photo sightings
INSERT INTO "SightingImage" ("id", "sightingId", "uploadId", "position", "createdAt")
SELECT
    'si_' || substr(md5("id" || "uploadId"), 1, 22),
    "id",
    "uploadId",
    0,
    "createdAt"
FROM "Sighting";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN "parentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SightingImage_sightingId_uploadId_key" ON "SightingImage"("sightingId", "uploadId");
CREATE INDEX "SightingImage_sightingId_idx" ON "SightingImage"("sightingId");
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- AddForeignKey
ALTER TABLE "SightingImage" ADD CONSTRAINT "SightingImage_sightingId_fkey" FOREIGN KEY ("sightingId") REFERENCES "Sighting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SightingImage" ADD CONSTRAINT "SightingImage_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Upload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
