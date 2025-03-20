/*
  Warnings:

  - You are about to drop the column `receipts` on the `tbl_invoices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[approvalChallenge]` on the table `tbl_invoices` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tbl_invoices" DROP COLUMN "receipts",
ADD COLUMN     "approvalChallenge" TEXT,
ADD COLUMN     "attachments" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "tbl_invoices_approvalChallenge_key" ON "tbl_invoices"("approvalChallenge");
