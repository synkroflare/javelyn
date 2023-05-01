/*
  Warnings:

  - A unique constraint covering the columns `[CPF]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "CPF" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "Client_CPF_key" ON "Client"("CPF");
