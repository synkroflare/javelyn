-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "responsibleUserId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "zapQrcode" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_responsibleUserId_fkey" FOREIGN KEY ("responsibleUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
