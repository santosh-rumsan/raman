/*
  Warnings:

  - You are about to drop the column `approvalChallenge` on the `tbl_invoices` table. All the data in the column will be lost.
  - You are about to drop the column `isApproved` on the `tbl_invoices` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `tbl_invoices` table. All the data in the column will be lost.
  - You are about to drop the column `reimbursedDate` on the `tbl_invoices` table. All the data in the column will be lost.
  - You are about to drop the column `reimbursedRemarks` on the `tbl_invoices` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tbl_invoices_approvalChallenge_key";

-- AlterTable
ALTER TABLE "tbl_invoices" DROP COLUMN "approvalChallenge",
DROP COLUMN "isApproved",
DROP COLUMN "reason",
DROP COLUMN "reimbursedDate",
DROP COLUMN "reimbursedRemarks",
ADD COLUMN     "approvalDetails" JSONB,
ADD COLUMN     "reimburseDetails" JSONB;
