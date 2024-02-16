/*
  Warnings:

  - You are about to drop the `BaseItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BaseMission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Mission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shop` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_baseItemName_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_holderId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_shopId_fkey";

-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_baseMissionName_fkey";

-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_userId_fkey";

-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_companyId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roleId" INTEGER;

-- DropTable
DROP TABLE "BaseItem";

-- DropTable
DROP TABLE "BaseMission";

-- DropTable
DROP TABLE "Item";

-- DropTable
DROP TABLE "Mission";

-- DropTable
DROP TABLE "Pet";

-- DropTable
DROP TABLE "Shop";

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "canEditTickets" BOOLEAN NOT NULL,
    "canSeeAllTickets" BOOLEAN NOT NULL,
    "canEditLeads" BOOLEAN NOT NULL,
    "canSeeAllLeads" BOOLEAN NOT NULL,
    "canEditClients" BOOLEAN NOT NULL,
    "canSeeAllClients" BOOLEAN NOT NULL,
    "canSeeDashboard" BOOLEAN NOT NULL,
    "canSeeRescuePanel" BOOLEAN NOT NULL,
    "canSeeUsersPanel" BOOLEAN NOT NULL,
    "canSeeAllTasks" BOOLEAN NOT NULL,
    "canSeeContactPanel" BOOLEAN NOT NULL,
    "statusTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
