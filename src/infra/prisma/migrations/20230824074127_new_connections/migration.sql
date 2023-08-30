/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "quoteId" INTEGER,
ADD COLUMN     "rescheduledEvaluationId" INTEGER,
ADD COLUMN     "ticketId" INTEGER;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "clientId" INTEGER;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "evaluationId" INTEGER,
ADD COLUMN     "taskId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Lead_clientId_key" ON "Lead"("clientId");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_rescheduledEvaluationId_fkey" FOREIGN KEY ("rescheduledEvaluationId") REFERENCES "Evaluation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
