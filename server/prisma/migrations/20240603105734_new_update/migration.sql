/*
  Warnings:

  - You are about to drop the column `Description` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `DescriptionProduct` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `Description`,
    ADD COLUMN `DescriptionProduct` VARCHAR(191) NOT NULL;
