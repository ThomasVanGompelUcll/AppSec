/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Wallet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_ownerId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "createdAt",
DROP COLUMN "ownerId",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "_UserToWallet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToWallet_AB_unique" ON "_UserToWallet"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToWallet_B_index" ON "_UserToWallet"("B");

-- AddForeignKey
ALTER TABLE "_UserToWallet" ADD CONSTRAINT "_UserToWallet_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWallet" ADD CONSTRAINT "_UserToWallet_B_fkey" FOREIGN KEY ("B") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
