-- AlterTable: add image (nullable first for backfill)
ALTER TABLE "Board" ADD COLUMN "image" TEXT;

-- Backfill existing boards using name + .jpg (matches images/Game1.jpg)
UPDATE "Board" SET "image" = "name" || '.jpg' WHERE "image" IS NULL;

-- Make image required
ALTER TABLE "Board" ALTER COLUMN "image" SET NOT NULL;
