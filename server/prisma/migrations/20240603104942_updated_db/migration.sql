/*
  Warnings:

  - You are about to drop the column `CustomerID` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `customerName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNumber` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Description` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountType` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountValue` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signatureName` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terms` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalHT` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tva` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `CustomerID`,
    ADD COLUMN `customerName` VARCHAR(191) NOT NULL,
    ADD COLUMN `dueDate` DATETIME(3) NOT NULL,
    ADD COLUMN `invoiceNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `referenceNumber` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `invoiceitems` ADD COLUMN `Description` VARCHAR(191) NOT NULL,
    ADD COLUMN `discount` DOUBLE NOT NULL,
    ADD COLUMN `discountType` VARCHAR(191) NOT NULL,
    ADD COLUMN `discountValue` DOUBLE NOT NULL,
    ADD COLUMN `notes` VARCHAR(191) NOT NULL,
    ADD COLUMN `signatureName` VARCHAR(191) NOT NULL,
    ADD COLUMN `tax` VARCHAR(191) NOT NULL,
    ADD COLUMN `terms` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalHT` DOUBLE NOT NULL,
    ADD COLUMN `tva` DOUBLE NOT NULL;
