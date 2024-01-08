import cors from "cors";
import express from "express";
import fs from "fs";
import https from "https";
import multer from "multer";
import { env } from "process";
import "reflect-metadata";
import { startContainers } from "./infra/container";
import { logHandler } from "./infra/logs/logHandler";
import { router } from "./infra/routes";

const app = express();
// Add headers before the routes are defined

const allowedOrigins = ["http://localhost:3000", "https://javelyn.vercel.app"]; // Substitua pelos seus valores

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE", "PROPFIND"],
};

app.use(cors(corsOptions));

app.use(multer().single("file"));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

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

app.on("uncaughtException", (e) => {
  console.log(e);
});

startContainers();

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack); // Log do erro no console do servidor
  res.status(500).send("Algo deu errado!"); // Resposta genérica ao cliente
});

const options = {
  key: fs.readFileSync(
    "../../../etc/letsencrypt/live/javelyn.link/privkey.pem"
  ),
  cert: fs.readFileSync(
    "../../../etc/letsencrypt/live/javelyn.link/fullchain.pem"
  ),
};
https
  .createServer(options, app)
  .listen(8080, () =>
    console.log(
      "Javelyn v0.0.4 https server online on 8080 and using node version " +
        process.version
    )
  );
