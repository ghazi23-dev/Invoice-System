/*
  Warnings:

  - Added the required column `Matricule_fiscale` to the `Agency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `agency` ADD COLUMN `Matricule_fiscale` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `tag_actif` INTEGER NOT NULL DEFAULT 1;
