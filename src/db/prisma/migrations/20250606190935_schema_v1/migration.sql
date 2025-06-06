-- CreateEnum
CREATE TYPE "Badge" AS ENUM ('NPC', 'NGMI', 'MGMI', 'YGMI', 'WAGMI');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "profileUrl" TEXT,
    "ghStars" INTEGER NOT NULL,
    "remarks" TEXT NOT NULL,
    "Trepos" INTEGER NOT NULL,
    "Tcommits" INTEGER NOT NULL,
    "jobLevel" TEXT NOT NULL,
    "Xid" TEXT NOT NULL,
    "Xusername" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "Xname" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'ForkedUp Inc.',
    "FullName" TEXT NOT NULL,
    "QrUrl" TEXT NOT NULL,
    "NgmiBadge" TEXT NOT NULL DEFAULT 'NPC',
    "Worth" TEXT NOT NULL,
    "created_At" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_Xid_key" ON "user"("Xid");
