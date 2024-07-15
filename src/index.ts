import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import socket from "express-ws";

import errorHandler from "./middleware/error.middleware";

import masterRouter from "./routes/master.route";
import playerRouter from "./routes/player.route";
import profileRouter from "./routes/profile.route";
import settingRouter from "./routes/settings.route";
import statsRouter from "./routes/stats.router";
import friendsRouter from "./routes/friends.route";
import friendSocket from "./sockets/realtime.socket";
import { addToObject } from "./lib/utils";
import realtime from "./sockets/realtime.socket";

const app = express();
const appSocket = socket(app);

app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/master", masterRouter);
app.use("/api/player", playerRouter);
app.use("/api/profile", profileRouter);
app.use("/api/stats", statsRouter);
app.use("/api/settings", settingRouter);
app.use("/api/friends", friendsRouter);

appSocket.app.ws("/api/realtime", realtime)

app.use(errorHandler);

app.listen(8000, () => {
  console.log("running");
});
