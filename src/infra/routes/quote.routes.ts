import { Router } from "express"
import { CreateQuoteController } from "../../server/modules/quotes/CreateQuoteController"
import { ReadQuoteController } from "../../server/modules/quotes/ReadQuoteController"
import { FindQuotesController } from "../../server/modules/quotes/FindQuotesController"
import { UpdateQuoteController } from "../../server/modules/quotes/UpdateQuoteController"
import { UpdateManyQuoteController } from "../../server/modules/quotes/UpdateManyQuoteController"

const readQuoteController = new ReadQuoteController()
const findQuotesController = new FindQuotesController()
const createQuoteController = new CreateQuoteController()
const updateQuoteController = new UpdateQuoteController()
const updateManyQuoteController = new UpdateManyQuoteController()

const quoteRoutes = Router()

quoteRoutes.propfind("/read", readQuoteController.handle)
quoteRoutes.propfind("/find", findQuotesController.handle)
quoteRoutes.post("/", createQuoteController.handle)
quoteRoutes.patch("/update", updateQuoteController.handle)
quoteRoutes.patch("/update-many", updateManyQuoteController.handle)

export { quoteRoutes }
