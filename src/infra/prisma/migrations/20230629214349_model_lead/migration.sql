-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_clientId_fkey";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "leadAdIdentifer" TEXT,
ADD COLUMN     "leadEvaluationDate" TIMESTAMP(3),
ADD COLUMN     "leadObservation" TEXT,
ADD COLUMN     "leadStatus" TEXT;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "isClientQuote" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isLeadQuote" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leadId" INTEGER,
ALTER COLUMN "clientId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "CPF" TEXT,
    "phone" TEXT,
    "mail" TEXT,
    "rank" INTEGER NOT NULL DEFAULT 50,
    "rankName" TEXT,
    "leadAdIdentifer" TEXT,
    "leadStatus" TEXT,
    "leadEvaluationDate" TIMESTAMP(3),
    "leadObservation" TEXT,
    "age" INTEGER,
    "neighborhood" TEXT,
    "adress" TEXT,
    "zipCode" INTEGER,
    "houseNumber" INTEGER,
    "profession" TEXT,
    "birthday" TIMESTAMP(3),
    "birthdayDay" INTEGER,
    "birthdayMonth" INTEGER,
    "birthdayYear" INTEGER,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "trashedReason" TEXT NOT NULL DEFAULT '',
    "statusActive" BOOLEAN NOT NULL DEFAULT false,
    "statusAvailableToReturn" BOOLEAN NOT NULL DEFAULT false,
    "javelynEntryDates" TIMESTAMP(3)[],
    "flexusEntryDates" TIMESTAMP(3)[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trashedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LeadToThrow" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LeadToTask" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToLead" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_CPF_key" ON "Lead"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_companyId_name_key" ON "Lead"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_LeadToThrow_AB_unique" ON "_LeadToThrow"("A", "B");

-- CreateIndex
CREATE INDEX "_LeadToThrow_B_index" ON "_LeadToThrow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LeadToTask_AB_unique" ON "_LeadToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_LeadToTask_B_index" ON "_LeadToTask"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToLead_AB_unique" ON "_EventToLead"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToLead_B_index" ON "_EventToLead"("B");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadToThrow" ADD CONSTRAINT "_LeadToThrow_A_fkey" FOREIGN KEY ("A") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadToThrow" ADD CONSTRAINT "_LeadToThrow_B_fkey" FOREIGN KEY ("B") REFERENCES "Throw"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadToTask" ADD CONSTRAINT "_LeadToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadToTask" ADD CONSTRAINT "_LeadToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToLead" ADD CONSTRAINT "_EventToLead_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToLead" ADD CONSTRAINT "_EventToLead_B_fkey" FOREIGN KEY ("B") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
