/*
  Warnings:

  - You are about to drop the column `discount` on the `invoiceitems` table. All the data in the column will be lost.
  - You are about to drop the column `discountType` on the `invoiceitems` table. All the data in the column will be lost.
  - You are about to drop the column `discountValue` on the `invoiceitems` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `invoiceitems` table. All the data in the column will be lost.
  - You are about to drop the column `signatureName` on the `invoiceitems` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `invoiceitems` table. All the data in the column will be lost.
  - You are about to drop the column `terms` on the `invoiceitems` table. All the data in the column will be lost.
  - You are about to drop the column `totalHT` on the `invoiceitems` table. All the data in the column will be lost.
  - You are about to drop the column `tva` on the `invoiceitems` table. All the data in the column will be lost.
  - You are about to alter the column `Rate` on the `invoiceitems` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Double`.
  - You are about to alter the column `Amount` on the `invoiceitems` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - Added the required column `Discount` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DiscountType` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DiscountValue` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Notes` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SignatureName` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Tax` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Terms` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Timbre_Fiscal` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TotalHT` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Tva` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoiceitems` DROP COLUMN `discount`,
    DROP COLUMN `discountType`,
    DROP COLUMN `discountValue`,
    DROP COLUMN `notes`,
    DROP COLUMN `signatureName`,
    DROP COLUMN `tax`,
    DROP COLUMN `terms`,
    DROP COLUMN `totalHT`,
    DROP COLUMN `tva`,
    ADD COLUMN `Discount` DOUBLE NOT NULL,
    ADD COLUMN `DiscountType` VARCHAR(191) NOT NULL,
    ADD COLUMN `DiscountValue` DOUBLE NOT NULL,
    ADD COLUMN `Notes` VARCHAR(191) NOT NULL,
    ADD COLUMN `SignatureName` VARCHAR(191) NOT NULL,
    ADD COLUMN `Tax` VARCHAR(191) NOT NULL,
    ADD COLUMN `Terms` VARCHAR(191) NOT NULL,
    ADD COLUMN `Timbre_Fiscal` DOUBLE NOT NULL,
    ADD COLUMN `TotalHT` DOUBLE NOT NULL,
    ADD COLUMN `Tva` DOUBLE NOT NULL,
    MODIFY `Rate` DOUBLE NOT NULL,
    MODIFY `Amount` DOUBLE NOT NULL;
