import { cronJobs } from "../../server/cron/cronJobs"
import { handlePrismaContainer } from "./prisma"
import { handleRepositoriesContainers } from "./repositories"
import { handleZapContainer } from "./zap"

export const startContainers = async () => {
  await handlePrismaContainer()
  handleRepositoriesContainers()
  handleZapContainer()
  cronJobs()

  return "sucess"
}
