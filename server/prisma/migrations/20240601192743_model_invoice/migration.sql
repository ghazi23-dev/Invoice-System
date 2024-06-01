/*
  Warnings:

  - The primary key for the `invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `InvoiceID` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `InvoiceID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`InvoiceID`);
