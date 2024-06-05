/*
  Warnings:

  - You are about to drop the column `bank` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `discountType` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `discountValue` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceDate` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNumber` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `product` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `referenceNumber` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `signatureImage` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `signatureName` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `terms` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `totalHT` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `tva` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `CustomerID` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InvoiceDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Status` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TotalAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `bank`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `customerName`,
    DROP COLUMN `discount`,
    DROP COLUMN `discountType`,
    DROP COLUMN `discountValue`,
    DROP COLUMN `dueDate`,
    DROP COLUMN `invoiceDate`,
    DROP COLUMN `invoiceNumber`,
    DROP COLUMN `notes`,
    DROP COLUMN `product`,
    DROP COLUMN `referenceNumber`,
    DROP COLUMN `signatureImage`,
    DROP COLUMN `signatureName`,
    DROP COLUMN `status`,
    DROP COLUMN `tax`,
    DROP COLUMN `terms`,
    DROP COLUMN `totalAmount`,
    DROP COLUMN `totalHT`,
    DROP COLUMN `tva`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `CustomerID` INTEGER NOT NULL,
    ADD COLUMN `InvoiceDate` DATETIME(3) NOT NULL,
    ADD COLUMN `Status` VARCHAR(50) NOT NULL,
    ADD COLUMN `TotalAmount` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `InvoiceItems` (
    `InvoiceItemID` INTEGER NOT NULL AUTO_INCREMENT,
    `InvoiceID` INTEGER NOT NULL,
    `ProductID` INTEGER NOT NULL,
    `Quantity` INTEGER NOT NULL,
    `Rate` DECIMAL(10, 2) NOT NULL,
    `Amount` DECIMAL(65, 30) NOT NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`InvoiceItemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvoiceItems` ADD CONSTRAINT `InvoiceItems_InvoiceID_fkey` FOREIGN KEY (`InvoiceID`) REFERENCES `Invoice`(`InvoiceID`) ON DELETE RESTRICT ON UPDATE CASCADE;
