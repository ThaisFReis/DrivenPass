/*
  Warnings:

  - Made the column `username` on table `Credential` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Credential" ALTER COLUMN "username" SET NOT NULL;
