/*
  Warnings:

  - You are about to alter the column `TotalAmount` on the `invoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.

*/
-- AlterTable
ALTER TABLE `invoice` MODIFY `TotalAmount` DECIMAL(10, 3) NOT NULL,
    MODIFY `Discount` DECIMAL(10, 3) NOT NULL,
    MODIFY `Timbre_Fiscal` DECIMAL(10, 3) NOT NULL,
    MODIFY `TotalHT` DECIMAL(10, 3) NOT NULL,
    MODIFY `Tva` DECIMAL(10, 3) NOT NULL;
