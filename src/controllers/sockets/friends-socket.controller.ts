// import { z } from "zod";
// import { MapValue } from "../../sockets/friends.socket";
// import e from "express";
// import ProfileStore from "../../database/schema/profile/profile.store";
// import RequestStore from "../../database/schema/requests/requests.store";

// type Connection = Map<string, MapValue>;

// const incomingRequestValidation = z.object({
//   username: z.string(),
// });

// const incomingRequest = async (
//   username: string,
//   userId: string,
//   connection: Connection
// ) => {
//   const user = connection.get(userId);
//   const ws = user?.ws;
//   if (!user) {
//     return false;
//   }

//   const request = await RequestStore.create(
//     {
//       status: "PENDING",
//       requestBy: userId,
//       requestTo: username,
//     },
//     true
//   );

//   switch (request.msg) {
//     case "REQUEST SENT":
//       ws?.send("REQUEST SENT");

//       connection
//         .get(request.data?.toString() || "")
//         ?.ws.send("REQUEST RECIEVED");
//   }
// };

// const request = async (
//   requestId: string,
//   userId: string,
//   connection: Connection,
//   type: "ACCEPT" | "REJECT"
// ) => {
//   const user = connection.get(userId);
//   const ws = user?.ws;

//   if (!user) {
//     return false;
//   }

//   const requestAck = await RequestStore.action({ action: type, requestId });

//   ws?.send(requestAck === true ? "ACCEPTED" : requestAck);
// };

// const friendSocketController = {
//   incomingRequest,
//   request,
// };

// export default friendSocketController;
