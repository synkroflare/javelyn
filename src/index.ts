import express, { NextFunction, Request, Response } from "express"
import "reflect-metadata"
import { startContainers } from "./infra/container"
import { router } from "./infra/routes"
import fs from "fs"
import https from "https"
import { logHandler } from "./infra/logs/logHandler"

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

app.use((req, res, next) => {
  logHandler(req)
  next()
})

app.use(router)

startContainers()

const test = false

if (test) {
  const options = {
    key: fs.readFileSync(
      "../../../etc/letsencrypt/live/javelyn.link/privkey.pem"
    ),
    cert: fs.readFileSync(
      "../../../etc/letsencrypt/live/javelyn.link/fullchain.pem"
    ),
  }
  https
    .createServer(options, app)
    .listen(8080, () =>
      console.log(
        "Javelyn v0.0.4 https server online on 8080 and using node version " +
          process.version
      )
    )
}

app.listen(8080, () =>
  console.log(
    "Javelyn v0.0.4 https server online on 8080 and using node version " +
      process.version
  )
)
