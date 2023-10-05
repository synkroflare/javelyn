/*
  Warnings:

  - A unique constraint covering the columns `[companyId,CPF]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId,CPF]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Client_CPF_key";

-- DropIndex
DROP INDEX "Lead_CPF_key";

-- CreateIndex
CREATE UNIQUE INDEX "Client_companyId_CPF_key" ON "Client"("companyId", "CPF");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_companyId_CPF_key" ON "Lead"("companyId", "CPF");
