/*
  Warnings:

  - You are about to alter the column `Tax` on the `invoiceitems` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `invoiceitems` MODIFY `Tax` VARCHAR(191) NOT NULL;
