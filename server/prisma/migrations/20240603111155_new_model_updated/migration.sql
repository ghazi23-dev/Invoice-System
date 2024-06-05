/*
  Warnings:

  - You are about to drop the column `Timbre_Fiscal` on the `invoiceitems` table. All the data in the column will be lost.
  - You are about to drop the column `TotalHT` on the `invoiceitems` table. All the data in the column will be lost.
  - You are about to drop the column `Tva` on the `invoiceitems` table. All the data in the column will be lost.
  - Added the required column `Discount` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Timbre_Fiscal` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TotalHT` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Tva` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TotalTTC` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `Discount` DOUBLE NOT NULL,
    ADD COLUMN `Timbre_Fiscal` DOUBLE NOT NULL,
    ADD COLUMN `TotalHT` DOUBLE NOT NULL,
    ADD COLUMN `Tva` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `invoiceitems` DROP COLUMN `Timbre_Fiscal`,
    DROP COLUMN `TotalHT`,
    DROP COLUMN `Tva`,
    ADD COLUMN `TotalTTC` DOUBLE NOT NULL;
