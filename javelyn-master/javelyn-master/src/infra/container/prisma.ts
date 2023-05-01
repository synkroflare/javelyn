import { PrismaClient } from "@prisma/client"
import { container } from "tsyringe"

export const handlePrismaContainer = () => {
  container.registerInstance<PrismaClient>("PrismaClient", new PrismaClient())
}
