import { Router } from "express";
import masterController from "../controllers/master.controller";
import protection from "../middleware/master.middleware";
import { Roles } from "../lib/types";

const masterRouter = Router();

masterRouter.post("/create", masterController.create);
masterRouter.post("/verify", masterController.verify);
masterRouter.get("/me", protection(Roles.Master), masterController.me);

export default masterRouter;
