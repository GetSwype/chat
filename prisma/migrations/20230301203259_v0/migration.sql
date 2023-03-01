/*
  Warnings:

  - Added the required column `author` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Author" AS ENUM ('user', 'assistant', 'system');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "author" "Author" NOT NULL;
