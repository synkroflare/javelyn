-- CreateTable
CREATE TABLE "DefaultModel" (
    "id" SERIAL NOT NULL,
    "sampleField" TEXT NOT NULL,

    CONSTRAINT "DefaultModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone1" TEXT NOT NULL,
    "phone2" TEXT,
    "plan" TEXT NOT NULL,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "creatorUserId" INTEGER,
    "assignedUserId" INTEGER,
    "permitedUserIds" INTEGER[],
    "procedureNames" TEXT[],
    "clientId" INTEGER,
    "clientName" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "value" DOUBLE PRECISION,
    "salesCode" INTEGER,
    "salesmanName" TEXT,
    "procedureTypeInjetavelCount" INTEGER NOT NULL DEFAULT 0,
    "procedureTypeCorporalCount" INTEGER NOT NULL DEFAULT 0,
    "procedureTypeFacialCount" INTEGER NOT NULL DEFAULT 0,
    "procedureTotalCount" INTEGER NOT NULL DEFAULT 0,
    "procedureType" TEXT NOT NULL DEFAULT 'PADRÃO',
    "returnDate" TIMESTAMP(3),
    "assignedDate" TIMESTAMP(3),
    "postponedDate" TIMESTAMP(3),
    "statusPostponed" BOOLEAN NOT NULL DEFAULT false,
    "statusAbsent" BOOLEAN NOT NULL DEFAULT false,
    "statusDone" BOOLEAN NOT NULL DEFAULT false,
    "statusCanceled" BOOLEAN NOT NULL DEFAULT false,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "doneDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" INTEGER,
    "mail" TEXT,
    "rank" INTEGER NOT NULL DEFAULT 50,
    "age" INTEGER,
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "canceledTickets" INTEGER NOT NULL DEFAULT 0,
    "acomplishedTickets" INTEGER NOT NULL DEFAULT 0,
    "absences" INTEGER NOT NULL DEFAULT 0,
    "daysSinceLastTicket" INTEGER NOT NULL DEFAULT 0,
    "procedureTypeInjetavelCount" INTEGER NOT NULL DEFAULT 0,
    "procedureTypeCorporalCount" INTEGER NOT NULL DEFAULT 0,
    "procedureTypeFacialCount" INTEGER NOT NULL DEFAULT 0,
    "procedureTotalCount" INTEGER NOT NULL DEFAULT 0,
    "procedureType" TEXT NOT NULL DEFAULT 'PADRÃO',
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "statusActive" BOOLEAN NOT NULL DEFAULT false,
    "javelynEntryDates" TIMESTAMP(3)[],
    "flexusEntryDates" TIMESTAMP(3)[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trashedAt" TIMESTAMP(3),

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procedure" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "type" TEXT DEFAULT 'PADRÃO',
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProcedureToTicket" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DefaultModel_sampleField_key" ON "DefaultModel"("sampleField");

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_key" ON "Client"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_name_key" ON "Client"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Procedure_name_key" ON "Procedure"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_ProcedureToTicket_AB_unique" ON "_ProcedureToTicket"("A", "B");

-- CreateIndex
CREATE INDEX "_ProcedureToTicket_B_index" ON "_ProcedureToTicket"("B");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_clientName_fkey" FOREIGN KEY ("clientName") REFERENCES "Client"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProcedureToTicket" ADD CONSTRAINT "_ProcedureToTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProcedureToTicket" ADD CONSTRAINT "_ProcedureToTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
