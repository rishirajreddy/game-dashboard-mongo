import ProfileStore from "../../database/schema/profile/profile.store";
import RequestStore from "../../database/schema/requests/requests.store";
import { MapValue } from "../../sockets/realtime.socket";
import e from "express";

type Connection = Map<string, MapValue>;

const request = async (
  requestId: string,
  userId: string,
  connection: Connection
) => {
  try {
    const profile = connection.get(userId);

    if (!profile) {
      return false;
    }

    const request = await RequestStore.create({
      status: "PENDING",
      requestBy: userId,
      requestTo: requestId,
    });

    profile.ws.send(request);

    if (request === "REQUEST SENT") {
      console.log(request);
      const user = await ProfileStore.getLean({ username: requestId }, {});

      if (!user) {
        return;
      }
      console.log(user);
      const connectedUser = connection.get(
        user?.player ? user.player.toString() : ""
      );
      console.log(connectedUser);
      connectedUser?.ws.send("RECIEVED REQUEST");
    }
  } catch (error) {
    console.error(error);
  }
};

const requestAccept = async (
  requestId: string,
  userId: string,
  connection: Connection
) => {
  const profile = connection.get(userId);
  try {
    if (!profile) {
      return false;
    }

    const requestAccept = await RequestStore.actionRequest(
      requestId,
      userId,
      "ACCEPT"
    );

    if (requestAccept === "INVALID REQUEST") {
      profile.ws.send(requestAccept);
      return;
    }

    profile.ws.send("REQUEST ACCEPTED");

    const connectedClient = connection.get(
      requestAccept ? requestAccept?.toString() : ""
    );

    if (connectedClient) {
      connectedClient.ws.send("REQUEST ACCEPTED");
    }
  } catch (error) {
    profile?.ws.send("INVALID REQUEST");
    console.error(error);
  }
};

const requestReject = async (
  requestId: string,
  userId: string,
  connection: Connection
) => {
  const profile = connection.get(userId);
  try {
    if (!profile) {
      return false;
    }

    const requestReject = await RequestStore.actionRequest(
      requestId,
      userId,
      "REJECT"
    );

    if (requestReject === "INVALID REQUEST") {
      profile.ws.send(requestReject);
      return;
    }

    profile.ws.send("REQUEST REJECTED");

    const connectedClient = connection.get(
      requestReject ? requestReject.toString() : ""
    );

    if (connectedClient) {
      connectedClient.ws.send("REQUEST REJECTED");
    }
  } catch (error) {
    profile?.ws.send("INVALID REQUEST");
    console.error(error);
  }
};

const friendRemove = async (
  username: string,
  userId: string,
  connection: Connection
) => {
  const profile = connection.get(userId);
  try {
    if (!profile) {
      return false;
    }

    const removed = await ProfileStore.removeFriend(userId, username);
    console.log(removed)
    if (removed === "INVALID FRIEND REMOVE") {
      profile?.ws?.send("INVALID FRIEND REMOVE");
      return;
    }

    profile?.ws?.send("FRIEND REMOVED");
    console.log(removed);
    const connectedUser = connection.get(removed ? removed.toString() : "");

    connectedUser?.ws?.send("FRIEND REMOVED");
  } catch (error) {
    profile?.ws?.send("INVALID FRIEND REMOVE");
    console.log(error);
  }
};

const Friend = {
  request,
  requestAccept,
  requestReject,
  friendRemove,
};

export default Friend;
