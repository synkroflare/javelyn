import { Router } from "express";
import { GetRescuePanelDataController } from "../../server/modules/data/GetRescuePanelDataController";

const getRescuePanelDataController = new GetRescuePanelDataController();

const dataRoutes = Router();

dataRoutes.propfind("/rescue-panel", getRescuePanelDataController.handle);

export { dataRoutes };
