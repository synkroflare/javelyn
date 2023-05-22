import { Router } from "express"
import { FindCompanyController } from "../../server/modules/company/FindCompanyController"

const findCompanyController = new FindCompanyController()

const companyRoutes = Router()

companyRoutes.propfind("/", findCompanyController.handle)

export { companyRoutes }
