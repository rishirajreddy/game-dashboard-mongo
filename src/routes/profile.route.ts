import { Router } from "express";
import profileController from "../controllers/profile.controller";
import protection from "../middleware/master.middleware";
import { Roles } from "../lib/types";

const profileRouter = Router();

profileRouter.get("/me", protection(Roles.Player), profileController.me);

profileRouter.post(
  "/create",
  protection(Roles.Player),
  profileController.create({ isMaster: false })
);

// Master
profileRouter.post(
  "/master/create",
  protection(Roles.Master),
  profileController.create({ isMaster: true })
);

export default profileRouter;
