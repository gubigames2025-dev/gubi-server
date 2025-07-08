/*
  Warnings:

  - You are about to drop the column `companyTpe` on the `Interests` table. All the data in the column will be lost.
  - Added the required column `companyType` to the `Interests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interests" DROP COLUMN "companyTpe",
ADD COLUMN     "companyType" TEXT NOT NULL;
