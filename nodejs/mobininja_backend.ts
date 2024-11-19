import http from "http";
import express, { Express } from "express";
import { config } from "./src/config";
import mongoose from "mongoose";
import { route } from "./src/routes";
import cors from "cors";
import { io, Socket } from "socket.io-client";
import { connectTosocket } from "./src/socket";
// import cron from 'node-cron';
// import { getAccessToken } from "./src/controllers/v1/WhatsappTokenCtrl";
import fileUpload from "express-fileupload";
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      // "https://ui.mobiililinja.fi/",
      "https://vaihde.mobiililinja.fi/",
      "https://ccdemo.sheerbit.com/",
      "https://ccdemo.sheerbit.com",
    ],
  })
);
app.use(fileUpload({
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/", route);

const server = http.createServer(app);

mongoose
  .connect(config.mongo.uri, {
    dbName: config.db.dbname,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("mongo db conneccted"))
  .catch((error) => console.log("db not connected", error));

// cron.schedule("*/1 * * * *", () => {
//     console.log('Refreshing access token...');
//     getAccessToken();
// });

connectTosocket();

server.listen(config.server.port, function () {
  console.log("server running on port", config.server.port);
});
