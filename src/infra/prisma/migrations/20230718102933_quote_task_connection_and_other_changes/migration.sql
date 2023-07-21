/*
  Warnings:

  - You are about to drop the column `statusAvailableToReturn` on the `Lead` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "statusAvailableToReturn",
ADD COLUMN     "statusConverted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Quote" ALTER COLUMN "quoteRank" SET DEFAULT 'MEDIO',
ALTER COLUMN "quoteRank" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "proceduresData" JSONB;

-- CreateTable
CREATE TABLE "_QuoteToTask" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuoteToTask_AB_unique" ON "_QuoteToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_QuoteToTask_B_index" ON "_QuoteToTask"("B");

-- AddForeignKey
ALTER TABLE "_QuoteToTask" ADD CONSTRAINT "_QuoteToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuoteToTask" ADD CONSTRAINT "_QuoteToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
