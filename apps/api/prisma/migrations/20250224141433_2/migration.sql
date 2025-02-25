/*
  Warnings:

  - You are about to drop the column `balanceLastUpdatedAt` on the `tbl_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `tbl_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `tbl_accounts_txns` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `tbl_accounts_txns` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `tbl_accounts_txns` table. All the data in the column will be lost.
  - You are about to drop the column `refId` on the `tbl_accounts_txns` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId,txnId]` on the table `tbl_accounts_txns` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `balanceAmount` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creditAmount` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debitAmount` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pstdDate` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txnAmount` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txnCurrencyCode` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txnDate` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txnId` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txnType` to the `tbl_accounts_txns` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountTxnStatus" AS ENUM ('UNRECONCILED', 'RECONCILED', 'DISCARDED');

-- CreateEnum
CREATE TYPE "AccountTxnType" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER', 'ADJUSTMENT');

-- DropForeignKey
ALTER TABLE "tbl_accounts_txns" DROP CONSTRAINT "tbl_accounts_txns_expenseId_fkey";

-- AlterTable
ALTER TABLE "tbl_accounts" DROP COLUMN "balanceLastUpdatedAt",
DROP COLUMN "number",
ADD COLUMN     "acctNumber" TEXT,
ADD COLUMN     "bankCode" TEXT;

-- AlterTable
ALTER TABLE "tbl_accounts_txns" DROP COLUMN "amount",
DROP COLUMN "category",
DROP COLUMN "name",
DROP COLUMN "refId",
ADD COLUMN     "balanceAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "chequeNumber" TEXT,
ADD COLUMN     "creditAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "debitAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "pstdDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "AccountTxnStatus" NOT NULL DEFAULT 'UNRECONCILED',
ADD COLUMN     "txnAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "txnCurrencyCode" TEXT NOT NULL,
ADD COLUMN     "txnDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "txnId" TEXT NOT NULL,
ADD COLUMN     "txnType" TEXT NOT NULL,
ADD COLUMN     "type" "AccountTxnType",
ALTER COLUMN "expenseId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tbl_accounts_txns_accountId_txnId_key" ON "tbl_accounts_txns"("accountId", "txnId");

-- AddForeignKey
ALTER TABLE "tbl_accounts_txns" ADD CONSTRAINT "tbl_accounts_txns_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "tbl_expenses"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;
