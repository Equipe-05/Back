/*
  Warnings:

  - You are about to drop the column `product` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the `_FranchiseToProduct` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `franchise` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_FranchiseToProduct" DROP CONSTRAINT "_FranchiseToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_FranchiseToProduct" DROP CONSTRAINT "_FranchiseToProduct_B_fkey";

-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "franchise" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sale" DROP COLUMN "product",
DROP COLUMN "quantity",
DROP COLUMN "value",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "_FranchiseToProduct";

-- CreateTable
CREATE TABLE "_CustomerToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CustomerToProduct_AB_unique" ON "_CustomerToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomerToProduct_B_index" ON "_CustomerToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "franchise_userId_key" ON "franchise"("userId");

-- AddForeignKey
ALTER TABLE "franchise" ADD CONSTRAINT "franchise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale" ADD CONSTRAINT "sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerToProduct" ADD CONSTRAINT "_CustomerToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomerToProduct" ADD CONSTRAINT "_CustomerToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
