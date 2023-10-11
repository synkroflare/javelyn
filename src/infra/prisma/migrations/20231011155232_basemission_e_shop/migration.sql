/*
  Warnings:

  - You are about to drop the column `briefing` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `reward` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `totalObjectives` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Mission` table. All the data in the column will be lost.
  - Added the required column `baseMissionName` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "shopId" INTEGER;

-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "briefing",
DROP COLUMN "level",
DROP COLUMN "name",
DROP COLUMN "reward",
DROP COLUMN "totalObjectives",
DROP COLUMN "type",
ADD COLUMN     "baseMissionName" TEXT NOT NULL,
ADD COLUMN     "doneAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BaseMission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "briefing" TEXT NOT NULL,
    "baseLevel" INTEGER NOT NULL,
    "baseReward" INTEGER NOT NULL,
    "totalObjectives" INTEGER NOT NULL,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BaseMission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BaseMission_name_key" ON "BaseMission"("name");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_baseMissionName_fkey" FOREIGN KEY ("baseMissionName") REFERENCES "BaseMission"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
