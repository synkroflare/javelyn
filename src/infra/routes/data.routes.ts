import { Router } from "express";
import { GetLeadRescuePanelDataController } from "../../server/modules/data/GetLeadRescuePanelDataControllerts";
import { GetRescuePanelDataController } from "../../server/modules/data/GetRescuePanelDataController";

const getRescuePanelDataController = new GetRescuePanelDataController();
const getLeadRescuePanelDataController = new GetLeadRescuePanelDataController();

const dataRoutes = Router();

dataRoutes.propfind("/rescue-panel", getRescuePanelDataController.handle);
dataRoutes.propfind(
  "/lead-rescue-panel",
  getLeadRescuePanelDataController.handle
);

export { dataRoutes };
