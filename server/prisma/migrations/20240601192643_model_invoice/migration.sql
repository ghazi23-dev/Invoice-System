/*
  Warnings:

  - The primary key for the `invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Amount` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `InvoiceID` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `OrderID` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bank` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountType` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountValue` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNumber` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signatureName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalHT` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tva` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invoice` DROP FOREIGN KEY `Invoice_OrderID_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_Client_ID_fkey`;

-- AlterTable
ALTER TABLE `invoice` DROP PRIMARY KEY,
    DROP COLUMN `Amount`,
    DROP COLUMN `InvoiceID`,
    DROP COLUMN `OrderID`,
    ADD COLUMN `bank` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `customerName` VARCHAR(191) NOT NULL,
    ADD COLUMN `discount` DOUBLE NOT NULL,
    ADD COLUMN `discountType` VARCHAR(191) NOT NULL,
    ADD COLUMN `discountValue` DOUBLE NOT NULL,
    ADD COLUMN `dueDate` DATETIME(3) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `invoiceDate` DATETIME(3) NOT NULL,
    ADD COLUMN `invoiceNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `product` VARCHAR(191) NOT NULL,
    ADD COLUMN `referenceNumber` VARCHAR(191) NULL,
    ADD COLUMN `signatureImage` VARCHAR(191) NULL,
    ADD COLUMN `signatureName` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `tax` VARCHAR(191) NOT NULL,
    ADD COLUMN `terms` VARCHAR(191) NULL,
    ADD COLUMN `totalAmount` DOUBLE NOT NULL,
    ADD COLUMN `totalHT` DOUBLE NOT NULL,
    ADD COLUMN `tva` DOUBLE NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `order`;
