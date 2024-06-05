/*
  Warnings:

  - Added the required column `Description` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `Description` VARCHAR(191) NOT NULL;
