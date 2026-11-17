-- AlterTable: add boardId, attributing pre-existing Scores to the first Board
-- (only one Board existed when Scores were introduced), then drop any orphans.
ALTER TABLE "Score" ADD COLUMN "boardId" INTEGER;
UPDATE "Score" SET "boardId" = (SELECT MIN("id") FROM "Board");
DELETE FROM "Score" WHERE "boardId" IS NULL;
ALTER TABLE "Score" ALTER COLUMN "boardId" SET NOT NULL;

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "session"("expire");

-- CreateIndex
CREATE INDEX "Score_boardId_score_idx" ON "Score"("boardId", "score");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
