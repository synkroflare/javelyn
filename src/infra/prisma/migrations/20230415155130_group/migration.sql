-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "filters" JSONB NOT NULL,
    "javelynThrows" INTEGER NOT NULL DEFAULT 0,
    "javelynThrowsDates" TIMESTAMP(3)[],
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trashedAt" TIMESTAMP(3),

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientToGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientToGroup_AB_unique" ON "_ClientToGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientToGroup_B_index" ON "_ClientToGroup"("B");

-- AddForeignKey
ALTER TABLE "_ClientToGroup" ADD CONSTRAINT "_ClientToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToGroup" ADD CONSTRAINT "_ClientToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
