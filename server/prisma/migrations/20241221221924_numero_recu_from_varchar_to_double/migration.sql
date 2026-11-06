/*
  Warnings:

  - You are about to alter the column `NUMERO_RECU` on the `achat_reservation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `achat_reservation` MODIFY `NUMERO_RECU` DOUBLE NOT NULL;
