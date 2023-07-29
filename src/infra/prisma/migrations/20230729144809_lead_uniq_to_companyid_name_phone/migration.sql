/*
  Warnings:

  - A unique constraint covering the columns `[companyId,name,phone]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Lead_companyId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Lead_companyId_name_phone_key" ON "Lead"("companyId", "name", "phone");
