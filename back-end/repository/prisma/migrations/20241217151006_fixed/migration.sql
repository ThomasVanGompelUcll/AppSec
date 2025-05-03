/*
  Warnings:

  - You are about to drop the `_UserToWallet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ownerId` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserToWallet" DROP CONSTRAINT "_UserToWallet_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToWallet" DROP CONSTRAINT "_UserToWallet_B_fkey";

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_UserToWallet";

-- CreateTable
CREATE TABLE "_SharedWallets" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SharedWallets_AB_unique" ON "_SharedWallets"("A", "B");

-- CreateIndex
CREATE INDEX "_SharedWallets_B_index" ON "_SharedWallets"("B");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SharedWallets" ADD CONSTRAINT "_SharedWallets_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SharedWallets" ADD CONSTRAINT "_SharedWallets_B_fkey" FOREIGN KEY ("B") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
