/*
  Warnings:

  - Made the column `mfaSecret` on table `Wallet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "mfaSecret" SET NOT NULL;
