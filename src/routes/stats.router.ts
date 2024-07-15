import { Router } from "express";
import protection from "../middleware/master.middleware";
import { Roles } from "../lib/types";
import statsController from "../controllers/stats.controller";

const statsRouter = Router();

statsRouter.post(
  "/add",
  protection(Roles.Player),
  statsController.add({ isMaster: false })
);

statsRouter.get("/", protection(Roles.Player), statsController.getStats);

statsRouter.post(
  "/master/add",
  protection(Roles.Master),
  statsController.add({ isMaster: true })
);

export default statsRouter;
