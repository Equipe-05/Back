/*
  Warnings:

  - You are about to drop the column `products` on the `franchise` table. All the data in the column will be lost.
  - Made the column `address` on table `customer` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('AVEC', 'AVECGO', 'CROSSX', 'PAYMENTS', 'PLATAFORMA_HYPERLOCAL', 'SALAOVIP');

-- AlterTable
ALTER TABLE "customer" ALTER COLUMN "address" SET NOT NULL;

-- AlterTable
ALTER TABLE "franchise" DROP COLUMN "products";

-- AlterTable
ALTER TABLE "sale" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';

-- DropEnum
DROP TYPE "Product";

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "plan" "Plan" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FranchiseToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FranchiseToProduct_AB_unique" ON "_FranchiseToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_FranchiseToProduct_B_index" ON "_FranchiseToProduct"("B");

-- AddForeignKey
ALTER TABLE "_FranchiseToProduct" ADD CONSTRAINT "_FranchiseToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "franchise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FranchiseToProduct" ADD CONSTRAINT "_FranchiseToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
