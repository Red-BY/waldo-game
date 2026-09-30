-- CreateTable
CREATE TABLE "Board" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_name_key" ON "Board"("name");

-- Create boards from existing character location board names
INSERT INTO "Board" ("name")
SELECT DISTINCT "boardName" FROM "CharacterLocation";

-- AlterTable: add boardId (nullable first for backfill)
ALTER TABLE "CharacterLocation" ADD COLUMN "boardId" INTEGER;

-- Backfill boardId from boardName
UPDATE "CharacterLocation" AS cl
SET "boardId" = b."id"
FROM "Board" AS b
WHERE cl."boardName" = b."name";

-- Make boardId required and drop boardName
ALTER TABLE "CharacterLocation" ALTER COLUMN "boardId" SET NOT NULL;
ALTER TABLE "CharacterLocation" DROP COLUMN "boardName";

-- AddForeignKey
ALTER TABLE "CharacterLocation" ADD CONSTRAINT "CharacterLocation_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
