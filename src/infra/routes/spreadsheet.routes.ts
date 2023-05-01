import express, { Router } from "express"
import { ImportSpreadsheetController } from "../../server/modules/spreadsheets/ImportSpreadsheetController"

const importSpreadsheetController = new ImportSpreadsheetController()

const spreadsheetRoutes = Router()
spreadsheetRoutes.post(
  "/",
  express.json({ limit: "25mb" }),
  importSpreadsheetController.handle
)

export { spreadsheetRoutes }
