/*
  Warnings:

  - You are about to drop the column `cpf` on the `customer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "customer" DROP CONSTRAINT "customer_franchiseId_fkey";

-- DropForeignKey
ALTER TABLE "franchise" DROP CONSTRAINT "franchise_userId_fkey";

-- DropIndex
DROP INDEX "customer_cpf_key";

-- AlterTable
ALTER TABLE "customer" DROP COLUMN "cpf";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "owner_id" TEXT;

-- AddForeignKey
ALTER TABLE "franchise" ADD CONSTRAINT "franchise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
