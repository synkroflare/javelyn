-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "rescheduleCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "conclusionCategory" TEXT NOT NULL DEFAULT 'INDEFINIDO';
