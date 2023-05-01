-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "statusAvailableToReturn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "statusReturnAlreadyManaged" BOOLEAN NOT NULL DEFAULT false;
