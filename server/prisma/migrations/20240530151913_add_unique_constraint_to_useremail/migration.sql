/*
  Warnings:

  - A unique constraint covering the columns `[UserEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_UserEmail_key` ON `User`(`UserEmail`);
