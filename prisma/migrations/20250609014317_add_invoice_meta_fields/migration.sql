/*
  Warnings:

  - Added the required column `clientName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `clientEmail` VARCHAR(191) NULL,
    ADD COLUMN `clientName` VARCHAR(191) NOT NULL,
    ADD COLUMN `companyLogo` VARCHAR(191) NULL,
    ADD COLUMN `discount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `dueDate` DATETIME(3) NOT NULL,
    ADD COLUMN `issueDate` DATETIME(3) NOT NULL,
    ADD COLUMN `taxRate` DOUBLE NOT NULL DEFAULT 0;
