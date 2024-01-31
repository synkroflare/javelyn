import cors from "cors";
import express from "express";
import fs from "fs";
import https from "https";
import multer from "multer";
import { env } from "process";
import "reflect-metadata";
import { startContainers } from "./infra/container";
import { handleSocketContainer } from "./infra/container/socket";
import { logHandler } from "./infra/logs/logHandler";
import { router } from "./infra/routes";

process.on("uncaughtException", (err) => {
  console.error("\x1b[31m%s\x1b[0m", "UNCAUGHT EXCEPTION!");
  console.error("\x1b[31m%s\x1b[0m", err);
});

const app = express();

const allowedOrigins = ["http://localhost:3000", "https://javelyn.vercel.app"]; // Substitua pelos seus valores

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE", "PROPFIND"],
};

app.use(cors(corsOptions));

app.use(multer().single("file"));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

app.use((req, res, next) => {
  const secret = req.get("Secret");
  if (!secret || secret !== env.JAVELYN_SECRET) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      "FORBIDDEN ORIGIN/ID DETECTED !!!!!!!!!!!!!!!!!!!!"
    );
    console.log(
      "\x1b[31m%s\x1b[0m",
      "##################################################"
    );
    console.log({ secret, ip: req.ip });
    logHandler(req, "\x1b[31m%s\x1b[0m");
    console.log(
      "\x1b[31m%s\x1b[0m",
      "FORBIDDEN ORIGIN/ID DETECTED !!!!!!!!!!!!!!!!!!!!"
    );
    console.log(
      "\x1b[31m%s\x1b[0m",
      "##################################################"
    );

    logHandler(req, "\x1b[36m%s\x1b[0m");
    res.status(400).send("forbidden");
    return;
  }
  logHandler(req, "\x1b[36m%s\x1b[0m");
  next();
});

app.use(router);

startContainers();

const options = {
  key: fs.readFileSync(
    "../../../etc/letsencrypt/live/javelyn.link/privkey.pem"
  ),
  cert: fs.readFileSync(
    "../../../etc/letsencrypt/live/javelyn.link/fullchain.pem"
  ),
};
const server = https
  .createServer(options, app)
  .listen(8080, () =>
    console.log(
      "Javelyn v0.9.0 https server online on 8080 and using node version " +
        process.version
    )
  );

handleSocketContainer(server);
