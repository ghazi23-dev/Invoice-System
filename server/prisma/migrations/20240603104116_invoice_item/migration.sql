-- AddForeignKey
ALTER TABLE `InvoiceItems` ADD CONSTRAINT `InvoiceItems_ProductID_fkey` FOREIGN KEY (`ProductID`) REFERENCES `Product`(`ProductID`) ON DELETE RESTRICT ON UPDATE CASCADE;
