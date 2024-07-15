import { Router } from "express";
import friendsController from "../controllers/friends.controller";
import protection from "../middleware/master.middleware";
import { Roles } from "../lib/types";

const friendsRouter = Router();

friendsRouter.use(protection(Roles.Player));

friendsRouter.post(
  "/request",
  protection(Roles.Player),
  friendsController.request
);

// friendsRouter.post(
//   "/request/accept",
//   protection(Roles.Player),
//   friendsController.requestAccept
// );

friendsRouter.post("/request/accept", friendsController.acceptRequest);
friendsRouter.post("/request/reject", friendsController.rejectRequest);
friendsRouter.get("/request", friendsController.getRequest);
friendsRouter.get("/", friendsController.getFriends);

friendsRouter.post("/remove", friendsController.removeFriend)

// friendsRouter.get(
//   "/socket",
//   protection(Roles.Player),
//   friendsController.socket
// );

export default friendsRouter;
