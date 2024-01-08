import cors from "cors";
import express from "express";
import multer from "multer";
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
  logHandler(req, "white");
  next();
});

app.use(router);

startContainers();

app.listen(8080, () =>
  console.log(
    "Javelyn v0.0.4 https server online on 8080 and using node version " +
      process.version
  )
);
