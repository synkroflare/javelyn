/*
  Warnings:

  - A unique constraint covering the columns `[companyId,name]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,name]` on the table `Procedure` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_clientName_fkey";

-- DropIndex
DROP INDEX "Client_id_name_key";

-- DropIndex
DROP INDEX "Client_name_key";

-- DropIndex
DROP INDEX "Procedure_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Client_companyId_name_key" ON "Client"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Procedure_companyId_name_key" ON "Procedure"("companyId", "name");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_clientName_companyId_fkey" FOREIGN KEY ("clientName", "companyId") REFERENCES "Client"("name", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
