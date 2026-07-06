import { prisma } from "@/database/prisma";

export class UploadsCleanupRepository {
  async deleteUploadRecord(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.user.updateMany({
        where: { avatarUploadId: id },
        data: { avatarUploadId: null },
      });

      await tx.car.updateMany({
        where: { coverUploadId: id },
        data: { coverUploadId: null },
      });

      await tx.carImage.deleteMany({ where: { uploadId: id } });

      const primarySighting = await tx.sighting.findUnique({
        where: { uploadId: id },
        include: { images: { orderBy: { position: "asc" } } },
      });

      if (primarySighting) {
        const remainingImages = primarySighting.images.filter((image) => image.uploadId !== id);
        if (remainingImages.length === 0) {
          await tx.sighting.delete({ where: { id: primarySighting.id } });
        } else {
          const nextPrimary = remainingImages[0];
          if (nextPrimary) {
            await tx.sighting.update({
              where: { id: primarySighting.id },
              data: { uploadId: nextPrimary.uploadId },
            });
          }
          await tx.sightingImage.deleteMany({
            where: { sightingId: primarySighting.id, uploadId: id },
          });
        }
      } else {
        await tx.sightingImage.deleteMany({ where: { uploadId: id } });
      }

      await tx.upload.delete({ where: { id } });
    });
  }

  async collectCarUploadIds(carId: string): Promise<string[]> {
    const car = await prisma.car.findUnique({
      where: { id: carId },
      select: {
        coverUploadId: true,
        images: { select: { uploadId: true } },
      },
    });
    if (!car) {
      return [];
    }
    const ids = new Set<string>();
    if (car.coverUploadId) {
      ids.add(car.coverUploadId);
    }
    for (const image of car.images) {
      ids.add(image.uploadId);
    }
    return [...ids];
  }

  async collectSightingUploadIds(sightingId: string): Promise<string[]> {
    const sighting = await prisma.sighting.findUnique({
      where: { id: sightingId },
      select: {
        uploadId: true,
        images: { select: { uploadId: true } },
      },
    });
    if (!sighting) {
      return [];
    }
    const ids = new Set<string>([sighting.uploadId]);
    for (const image of sighting.images) {
      ids.add(image.uploadId);
    }
    return [...ids];
  }
}

export const uploadsCleanupRepository = new UploadsCleanupRepository();
