import initLogger from "./logger";
import { handlePrismaContainer } from "./prisma";
import { handleRepositoriesContainers } from "./repositories";
import { handleSocketContainer } from "./socket";
import { handleZapContainer } from "./zap";

export const startContainers = () => {
  handlePrismaContainer();
  handleRepositoriesContainers();
  handleZapContainer();
  handleSocketContainer();
  initLogger();
};
