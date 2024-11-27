import http from "http";
import HttpProxy from "http-proxy";
import { config } from "./src/config";
import mongoose from "mongoose";
import { connect } from "./src/socket";


HttpProxy.createProxyServer({
  target: "https://localhost:8081",
  ws: true,
  secure: true 
}).listen(91, "0.0.0.0");

mongoose.connect(config.mongo.uri, {
  dbName: config.db.dbname,
}).then(() => console.log("mongo db conneccted")).catch((error) => console.log("db not connected", error))

const server = http.createServer();
connect(server)

server.listen(config.server.port, function () {
  console.log(`WTS Chat socket Backend........${config.server.port}`);
});
