import express, { NextFunction, Request, Response } from "express"
import "reflect-metadata"
import { startContainers } from "./infra/container"
import { router } from "./infra/routes"
import fs from "fs"
import https from "https"
import { logHandler } from "./infra/logs/logHandler"
import multer from "multer"
import cors from "cors"

const app = express()
// Add headers before the routes are defined

const allowedOrigins = ["http://localhost:3000", "https://javelyn.vercel.app"] // Substitua pelos seus valores

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE", "PROPFIND"],
}

app.use(cors(corsOptions))

app.use(multer().single("file"))
app.use(express.json({ limit: "25mb" }))
app.use(express.urlencoded({ limit: "25mb", extended: true }))

app.use(express.json({ limit: "25mb" }))
app.use(express.urlencoded({ limit: "25mb", extended: true }))

app.use((req, res, next) => {
  const origin = req.get("Origin")
  console.log("Origem da requisição:", origin)

  if (origin !== "https://javelyn.vercel.app") {
    console.log("forbidden origin:", origin)
    return
  }
  logHandler(req)
  next()
})

app.use(router)

app.on("uncaughtException", (e) => {
  console.log(e)
})

startContainers()

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
