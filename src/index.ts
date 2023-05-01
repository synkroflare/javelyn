import express, { NextFunction, Request, Response } from "express"
import "reflect-metadata"
import { startContainers } from "./infra/container"
import { router } from "./infra/routes"

const app = express()
// Add headers before the routes are defined

app.use(function (req: Request, res: Response, next: NextFunction) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*")

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, PROPFIND"
  )

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-Type,Accept"
  )

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", "true")

  // Pass to next layer of middleware
  next()
})

app.use(express.json({ limit: "25mb" }))
app.use(express.urlencoded({ limit: "25mb", extended: true }))

app.use(router)

startContainers()
app.listen(4000, function () {
  console.log("listening on port 4000")
})
