/*
  Warnings:

  - You are about to drop the column `Agency_ID` on the `client` table. All the data in the column will be lost.
  - Added the required column `Matricule_fiscale` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `client` DROP FOREIGN KEY `Client_Agency_ID_fkey`;

-- AlterTable
ALTER TABLE `client` DROP COLUMN `Agency_ID`,
    ADD COLUMN `Matricule_fiscale` VARCHAR(191) NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
