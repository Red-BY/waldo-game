-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "CharacterLocation" (
    "id" SERIAL NOT NULL,
    "boardName" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "x1" DOUBLE PRECISION NOT NULL,
    "y1" DOUBLE PRECISION NOT NULL,
    "x2" DOUBLE PRECISION NOT NULL,
    "y2" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CharacterLocation_pkey" PRIMARY KEY ("id")
);
