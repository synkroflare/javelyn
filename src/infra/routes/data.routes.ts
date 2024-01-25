import { Router } from "express";
import { GetLeadRescuePanelDataController } from "../../server/modules/data/GetLeadRescuePanelDataControllerts";
import { GetQuoteRescuePanelDataController } from "../../server/modules/data/GetQuoteRescuePanelDataController";
import { GetRescuePanelDataController } from "../../server/modules/data/GetRescuePanelDataController";

const getRescuePanelDataController = new GetRescuePanelDataController();
const getLeadRescuePanelDataController = new GetLeadRescuePanelDataController();
const getQuoteRescuePanelDataController =
  new GetQuoteRescuePanelDataController();

const dataRoutes = Router();

dataRoutes.propfind("/rescue-panel", getRescuePanelDataController.handle);
dataRoutes.propfind(
  "/lead-rescue-panel",
  getLeadRescuePanelDataController.handle
);
dataRoutes.propfind(
  "/quote-rescue-panel",
  getQuoteRescuePanelDataController.handle
);

export { dataRoutes };
