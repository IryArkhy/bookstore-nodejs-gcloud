/*
  Warnings:

  - A unique constraint covering the columns `[id,bookID]` on the table `BookComment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BookComment" ADD COLUMN     "rating" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "BookComment_id_bookID_key" ON "BookComment"("id", "bookID");
