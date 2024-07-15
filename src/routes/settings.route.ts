import { Router } from "express";
import protection from "../middleware/master.middleware";
import { Roles } from "../lib/types";
import settingsController from "../controllers/settings.controller";

const settingRouter = Router();

settingRouter.use(protection(Roles.Master));

settingRouter.post("/stats/create", settingsController.statsCreate);
settingRouter.patch("/stats/add", settingsController.statsAdd);
settingRouter.post("/stats/cache/build", settingsController.statsCacheBuild);

export default settingRouter;

