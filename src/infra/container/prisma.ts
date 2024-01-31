import { PrismaClient } from "@prisma/client";
import { container } from "tsyringe";

export const handlePrismaContainer = () => {
  const prisma = new PrismaClient();
  container.registerInstance<PrismaClient>("PrismaClient", prisma);
};
