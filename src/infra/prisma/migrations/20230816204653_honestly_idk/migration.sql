-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "ticketId" INTEGER;

-- CreateTable
CREATE TABLE "_openProcedures" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_openProcedures_AB_unique" ON "_openProcedures"("A", "B");

-- CreateIndex
CREATE INDEX "_openProcedures_B_index" ON "_openProcedures"("B");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_openProcedures" ADD CONSTRAINT "_openProcedures_A_fkey" FOREIGN KEY ("A") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_openProcedures" ADD CONSTRAINT "_openProcedures_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
