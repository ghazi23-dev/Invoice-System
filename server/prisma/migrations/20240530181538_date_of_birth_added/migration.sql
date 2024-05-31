/*
  Warnings:

  - Added the required column `DateOfBirth` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `DateOfBirth` DATETIME(3) NOT NULL;
