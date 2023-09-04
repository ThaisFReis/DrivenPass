/*
  Warnings:

  - Made the column `url` on table `Credential` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Credential" ALTER COLUMN "url" SET NOT NULL;
