-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "adress" TEXT,
ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "houseNumber" INTEGER,
ADD COLUMN     "neighborhood" TEXT,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "zipCode" INTEGER;
