import { handlePrismaContainer } from "./prisma"
import { handleRepositoriesContainers } from "./repositories"
import { handleZapContainer } from "./zap"

export const startContainers = () => {
  handlePrismaContainer()
  handleRepositoriesContainers()
  handleZapContainer()

  return "sucess"
}
