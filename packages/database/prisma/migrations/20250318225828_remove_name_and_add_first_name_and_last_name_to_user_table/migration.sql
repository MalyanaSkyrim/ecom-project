/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";
ALTER TABLE "User" ADD COLUMN     "firstName" STRING NOT NULL;
ALTER TABLE "User" ADD COLUMN     "lastName" STRING;
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;
