import { Router } from "express";
import playerController from "../controllers/player.controller";

const playerRouter = Router();

playerRouter.post("/create", playerController.create);
playerRouter.post("/login", playerController.login);

export default playerRouter;
