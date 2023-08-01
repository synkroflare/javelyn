import { cronJobs } from "../../server/cron/cronJobs"
import initLogger from "./logger"
import { handlePrismaContainer } from "./prisma"
import { handleRepositoriesContainers } from "./repositories"
import { handleZapContainer } from "./zap"

export const startContainers = async () => {
  await handlePrismaContainer()
  handleRepositoriesContainers()
  handleZapContainer()
  initLogger()

  return "sucess"
}
