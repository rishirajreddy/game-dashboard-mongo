import { Request } from "express";
import WebSocket from "ws";
import { JwtService } from "../services/jwt.service";
import { z } from "zod";
import ProfileStore from "../database/schema/profile/profile.store";
import { Document, Types } from "mongoose";
import Friend from "../controllers/sockets/friend.socket";

const masterProtectionValidation = z.object({
  userId: z.string(),
  role: z.string(),
});

export interface MapValue {
  ws: WebSocket;
  document: Document<
    unknown,
    {},
    {
      username: string;
      friends: Types.ObjectId[];
      requests: Types.ObjectId[];
      stats?: Types.ObjectId | undefined;
      player?: Types.ObjectId | undefined;
      inventory?: Types.ObjectId | undefined;
    }
  >;
}

const connections = new Map<string, MapValue>();

const action = {
  REQUEST: Friend.request,
  ACCEPT: Friend.requestAccept,
  REJECT: Friend.requestReject,
  "FRIEND-REMOVE": Friend.friendRemove,
};

const realtime = async (ws: WebSocket, req: Request) => {
  console.log("hii");
  const authorization = req.headers.authorization?.split(" ")[1];

  if (!authorization) {
    ws.close(1008, "MISSING AUTH TOKEN");
    return;
  }

  try {
    const user = JwtService.decodeToken(authorization);
    const userInfo = masterProtectionValidation.parse(user);

    const profileInfo = await ProfileStore.get(
      { playerId: userInfo.userId },
      { select: ["requests", "username", "friends"] }
    );

    if (!profileInfo) {
      ws.send("UNAUTHORIZED");
      ws.close();
      return;
    }

    connections.set(userInfo.userId, { ws: ws, document: profileInfo });

    ws.on("message", (data) => {
      const context = JSON.parse(data.toString());

      if (context?.action && context?.data) {
        const handler = action[context?.action as "REQUEST"] as any;
        if (handler) {
          handler(context?.data?.id, userInfo.userId, connections);
        } else {
          ws.send("INVALID ACTION");
        }
      } else {
        ws.send("INVALID ACTION");
      }
    });
  } catch (error) {}
};

export default realtime;
