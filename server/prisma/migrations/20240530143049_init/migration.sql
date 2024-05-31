-- CreateTable
CREATE TABLE `User` (
    `User_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserName` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `UserEmail` VARCHAR(191) NOT NULL,
    `Role` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `Agency_ID` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`User_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agency` (
    `Agency_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `AgencyName` VARCHAR(191) NOT NULL,
    `AgencyAddress` VARCHAR(191) NOT NULL,
    `AgencyPhone` VARCHAR(191) NOT NULL,
    `AgencyEmail` VARCHAR(191) NOT NULL,
    `AgencyLocation` VARCHAR(191) NOT NULL,
    `SuperAdminID` INTEGER NOT NULL,
    `AdminID` INTEGER NOT NULL,

    UNIQUE INDEX `Agency_AdminID_key`(`AdminID`),
    PRIMARY KEY (`Agency_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `Client_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ClientName` VARCHAR(191) NOT NULL,
    `ClientPhone` VARCHAR(191) NOT NULL,
    `ClientEmail` VARCHAR(191) NOT NULL,
    `ClientAddress` VARCHAR(191) NOT NULL,
    `ClientLocation` VARCHAR(191) NOT NULL,
    `Agency_ID` INTEGER NOT NULL,

    PRIMARY KEY (`Client_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `OrderID` INTEGER NOT NULL AUTO_INCREMENT,
    `Client_ID` INTEGER NOT NULL,
    `OrderDetails` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`OrderID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `InvoiceID` INTEGER NOT NULL AUTO_INCREMENT,
    `OrderID` INTEGER NOT NULL,
    `Amount` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`InvoiceID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Agency` ADD CONSTRAINT `Agency_SuperAdminID_fkey` FOREIGN KEY (`SuperAdminID`) REFERENCES `User`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agency` ADD CONSTRAINT `Agency_AdminID_fkey` FOREIGN KEY (`AdminID`) REFERENCES `User`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_Agency_ID_fkey` FOREIGN KEY (`Agency_ID`) REFERENCES `Agency`(`Agency_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_Client_ID_fkey` FOREIGN KEY (`Client_ID`) REFERENCES `Client`(`Client_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_OrderID_fkey` FOREIGN KEY (`OrderID`) REFERENCES `Order`(`OrderID`) ON DELETE RESTRICT ON UPDATE CASCADE;
