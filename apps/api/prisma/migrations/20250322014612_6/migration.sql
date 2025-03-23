/*
  Warnings:

  - You are about to drop the column `expenseId` on the `tbl_invoices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receiptId]` on the table `tbl_expenses` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "tbl_invoices" DROP CONSTRAINT "tbl_invoices_expenseId_fkey";

-- AlterTable
ALTER TABLE "tbl_expenses" ADD COLUMN     "bankTransferFees" DOUBLE PRECISION,
ADD COLUMN     "receiptId" TEXT;

-- AlterTable
ALTER TABLE "tbl_invoices" DROP COLUMN "expenseId",
ADD COLUMN     "bankTransferFees" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "tbl_expenses_receiptId_key" ON "tbl_expenses"("receiptId");

-- AddForeignKey
ALTER TABLE "tbl_expenses" ADD CONSTRAINT "tbl_expenses_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "tbl_invoices"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;
