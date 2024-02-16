import { Router } from "express";
import { FindCompanyController } from "../../server/modules/company/FindCompanyController";
import { UpdateCompanyController } from "../../server/modules/company/UpdateCompanyController";

const findCompanyController = new FindCompanyController();
const updateCompanyController = new UpdateCompanyController();

const companyRoutes = Router();

companyRoutes.propfind("/", findCompanyController.handle);
companyRoutes.patch("/", updateCompanyController.handle);

export { companyRoutes };
