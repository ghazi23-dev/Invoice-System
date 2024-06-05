-- DropForeignKey
ALTER TABLE `agency` DROP FOREIGN KEY `Agency_AdminID_fkey`;

-- AlterTable
ALTER TABLE `agency` MODIFY `AdminID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Agency` ADD CONSTRAINT `Agency_AdminID_fkey` FOREIGN KEY (`AdminID`) REFERENCES `User`(`User_ID`) ON DELETE SET NULL ON UPDATE CASCADE;
