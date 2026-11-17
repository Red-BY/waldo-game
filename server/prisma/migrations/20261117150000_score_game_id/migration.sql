-- AlterTable: every Score now records the Game it came from; backfill existing rows with unique ids.
ALTER TABLE "Score" ADD COLUMN "gameId" TEXT;
UPDATE "Score" SET "gameId" = gen_random_uuid()::text WHERE "gameId" IS NULL;
ALTER TABLE "Score" ALTER COLUMN "gameId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Score_gameId_key" ON "Score"("gameId");
