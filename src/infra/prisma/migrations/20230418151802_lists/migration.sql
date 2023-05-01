-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT 'linear-gradient(to right, MediumPurple, MediumSlateBlue)',
    "filters" JSONB NOT NULL,
    "javelynThrowsDates" TIMESTAMP(3)[],
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trashedAt" TIMESTAMP(3),

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_sent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_pending" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_sent_AB_unique" ON "_sent"("A", "B");

-- CreateIndex
CREATE INDEX "_sent_B_index" ON "_sent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_pending_AB_unique" ON "_pending"("A", "B");

-- CreateIndex
CREATE INDEX "_pending_B_index" ON "_pending"("B");

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_sent" ADD CONSTRAINT "_sent_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_sent" ADD CONSTRAINT "_sent_B_fkey" FOREIGN KEY ("B") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pending" ADD CONSTRAINT "_pending_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_pending" ADD CONSTRAINT "_pending_B_fkey" FOREIGN KEY ("B") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
