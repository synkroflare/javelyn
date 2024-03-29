import cors from "cors";
import express from "express";
import multer from "multer";
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
  logHandler(req, "white");
  next();
});

app.use(router);

startContainers();

const server = app.listen(8080, () =>
  console.log(
    "Javelyn v0.0.4 https server online on 8080 and using node version " +
      process.version
  )
);

handleSocketContainer(server);
