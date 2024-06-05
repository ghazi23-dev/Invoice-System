-- AlterTable
ALTER TABLE `invoiceitems` MODIFY `Rate` DECIMAL(10, 3) NOT NULL,
    MODIFY `Amount` DECIMAL(10, 3) NOT NULL,
    MODIFY `DiscountValue` DECIMAL(10, 3) NOT NULL,
    MODIFY `TotalTTC` DECIMAL(10, 3) NOT NULL;
