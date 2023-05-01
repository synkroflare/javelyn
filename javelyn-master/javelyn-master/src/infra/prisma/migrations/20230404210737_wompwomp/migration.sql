-- CreateTable
CREATE TABLE "_availableToReturn" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_availableToReturn_AB_unique" ON "_availableToReturn"("A", "B");

-- CreateIndex
CREATE INDEX "_availableToReturn_B_index" ON "_availableToReturn"("B");

-- AddForeignKey
ALTER TABLE "_availableToReturn" ADD CONSTRAINT "_availableToReturn_A_fkey" FOREIGN KEY ("A") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_availableToReturn" ADD CONSTRAINT "_availableToReturn_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
