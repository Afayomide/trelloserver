/*
  Warnings:

  - You are about to drop the column `userId` on the `Conversation` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
