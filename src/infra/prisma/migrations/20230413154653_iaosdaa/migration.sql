/*
  Warnings:

  - You are about to drop the `DefaultModel` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "javelynContactAttemptsDates" TIMESTAMP(3)[];

-- DropTable
DROP TABLE "DefaultModel";

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_key" ON "Client"("phone");
