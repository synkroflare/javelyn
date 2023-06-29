-- CreateTable
CREATE TABLE "Quote" (
    "id" SERIAL NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "quoteRank" INTEGER NOT NULL,
    "observation" TEXT,
    "proceduresData" JSONB NOT NULL,
    "targetDate" TIMESTAMP(3),
    "handledAtDate" TIMESTAMP(3),
    "statusAbsent" BOOLEAN NOT NULL DEFAULT false,
    "statusAccomplished" BOOLEAN NOT NULL DEFAULT false,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProcedureToQuote" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProcedureToQuote_AB_unique" ON "_ProcedureToQuote"("A", "B");

-- CreateIndex
CREATE INDEX "_ProcedureToQuote_B_index" ON "_ProcedureToQuote"("B");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProcedureToQuote" ADD CONSTRAINT "_ProcedureToQuote_A_fkey" FOREIGN KEY ("A") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProcedureToQuote" ADD CONSTRAINT "_ProcedureToQuote_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
