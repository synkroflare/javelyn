-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "birthdayDay" INTEGER,
ADD COLUMN     "birthdayMonth" INTEGER,
ADD COLUMN     "birthdayYear" INTEGER;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "dateDay" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dateMonth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dateYear" INTEGER NOT NULL DEFAULT 0;
