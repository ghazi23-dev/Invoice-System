/*
  Warnings:

  - Added the required column `Montant_Achat` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Montant_Debourser` to the `InvoiceItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoiceitems` ADD COLUMN `Montant_Achat` DECIMAL(10, 3) NOT NULL,
    ADD COLUMN `Montant_Debourser` DECIMAL(10, 3) NOT NULL;
