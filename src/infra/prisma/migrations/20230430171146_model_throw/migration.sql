-- CreateTable
CREATE TABLE "Throw" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "targetsIds" INTEGER[],
    "creatorId" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Throw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientToThrow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientToThrow_AB_unique" ON "_ClientToThrow"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientToThrow_B_index" ON "_ClientToThrow"("B");

-- AddForeignKey
ALTER TABLE "Throw" ADD CONSTRAINT "Throw_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToThrow" ADD CONSTRAINT "_ClientToThrow_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToThrow" ADD CONSTRAINT "_ClientToThrow_B_fkey" FOREIGN KEY ("B") REFERENCES "Throw"("id") ON DELETE CASCADE ON UPDATE CASCADE;
