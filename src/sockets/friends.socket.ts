// import { Request } from "express";
// import WebSocket from "ws";
// import { JwtService } from "../services/jwt.service";

// import { z } from "zod";
// import ProfileStore from "../database/schema/profile/profile.store";
// import { Document, Types } from "mongoose";
// import { getFromObject } from "../lib/utils";
// import friendSocketController from "../controllers/sockets/friends-socket.controller";

// const masterProtectionValidation = z.object({
//   userId: z.string(),
//   role: z.string(),
// });

// const usernameValidation = z.object({
//   username: z.string(),
// });

// const requestIdValidation = z.object({
//   id: z.string().min(24).max(24),
// });

// export interface MapValue {
//   ws: WebSocket;
//   document: Document<
//     unknown,
//     {},
//     {
//       username: string;
//       friends: Types.ObjectId[];
//       requests: Types.ObjectId[];
//       stats?: Types.ObjectId | undefined;
//       player?: Types.ObjectId | undefined;
//       inventory?: Types.ObjectId | undefined;
//     }
//   >;
// }

// const connections = new Map<string, MapValue>();

// const friendSocket = async (ws: WebSocket, req: Request) => {
//   const authorization = req.headers.authorization?.split(" ")[1];
//   console.log(getFromObject(req, "role"));
//   if (!authorization) {
//     ws.close(1008, "Missing Auth Token");
//     return;
//   }

//   try {
//     const user = JwtService.decodeToken(authorization);
//     const userInfo = masterProtectionValidation.parse(user);

//     const profileInfo = await ProfileStore.get(
//       {
//         playerId: userInfo.userId,
//       },
//       { select: ["requests", "username", "friends"] }
//     );

//     if (!profileInfo) {
//       ws.send("Unauthorized");
//       ws.close();
//       return;
//     }

//     connections.set(userInfo.userId, { ws: ws, document: profileInfo });

//     ws.on("message", (data) => {
//       const context = JSON.parse(data.toString());

//       console.log(context?.action);

//       // Handling Cases
//       switch (context?.action) {
//         case "REQUEST":
//           const { username } = z
//             .object({ username: z.string() })
//             .parse(context?.data);
//           friendSocketController.incomingRequest(
//             username,
//             userInfo.userId,
//             connections
//           );
//           break;

//         case "REQUEST-ACCEPT": {
//           const { id } = requestIdValidation.parse(context?.data);
//           friendSocketController.request(
//             id,
//             userInfo.userId,
//             connections,
//             "ACCEPT"
//           );
//           break;
//         }

//         case "REQUEST-REJECT": {
//           const { id } = requestIdValidation.parse(context?.data);
//           friendSocketController.request(
//             id,
//             userInfo.userId,
//             connections,
//             "REJECT"
//           );
//           break;
//         }
//       }

//       ws.on("error", (err) => {
//         ws.send("Error");
//       });
//     });
//   } catch (error) {
//     ws.close(1008, "Access denied");
//     return;
//   }
// };

// export default friendSocket;
