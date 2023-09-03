/*
  Warnings:

  - You are about to drop the column `userId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Note` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `user_id` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Credential` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_userId_fkey";

-- DropForeignKey
ALTER TABLE "Credential" DROP CONSTRAINT "Credential_userId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
