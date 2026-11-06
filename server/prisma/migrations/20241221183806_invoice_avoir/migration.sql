-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `InvoiceType` VARCHAR(50) NOT NULL DEFAULT 'Facture',
    ADD COLUMN `ReferencedInvoiceID` INTEGER NULL;
