/*
  Warnings:

  - You are about to alter the column `Tax` on the `invoiceitems` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `invoiceitems` MODIFY `Tax` DOUBLE NOT NULL;
