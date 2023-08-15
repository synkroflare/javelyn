/*
  Warnings:

  - You are about to drop the column `rescheduleCount` on the `Evaluation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Evaluation" DROP COLUMN "rescheduleCount",
ADD COLUMN     "rescheduled" BOOLEAN NOT NULL DEFAULT false;
