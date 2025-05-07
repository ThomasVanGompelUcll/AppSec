/*
  Warnings:

  - Added the required column `mfaSecret` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Add the mfaSecret column with a default value for existing rows
ALTER TABLE "Wallet" ADD COLUMN "mfaSecret" TEXT DEFAULT '';

-- Remove the default value after the column is added (optional)
ALTER TABLE "Wallet" ALTER COLUMN "mfaSecret" DROP DEFAULT;
