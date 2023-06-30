/*
  Warnings:

  - You are about to drop the column `rank` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `rankName` on the `Lead` table. All the data in the column will be lost.
  - Added the required column `leadRank` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leadType` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Made the column `leadStatus` on table `Lead` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "rank",
DROP COLUMN "rankName",
ADD COLUMN     "leadRank" TEXT NOT NULL,
ADD COLUMN     "leadType" TEXT NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "leadStatus" SET NOT NULL;
