// import convertToObjectId from "../../../lib/convert";
// import Profile from "../profile/profile.schema";
// import ProfileStore from "../profile/profile.store";
// import Request from "./requests.schema";

// type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";
// type RequestFields = "status" | "requestBy" | "requestTo";

// interface CreateRequestField {
//   status: RequestStatus;
//   requestBy: string;
//   requestTo: string;
// }

// interface CheckRequestExistsField {
//   requestBy: string;
//   requestTo: string;
// }

// interface RequestAction {
//   requestId: string;
//   action: "ACCEPT" | "REJECT";
// }

// const create = async (data: CreateRequestField, uid?: boolean) => {
//   const msg = (msg: string, data: unknown) => {
//     return { msg, data };
//   };
//   const [requestingUser, requestedUser] = await Promise.all([
//     ProfileStore.get(
//       { playerId: data.requestBy },
//       { select: ["requests", "username"] }
//     ),
//     ProfileStore.get({ username: data.requestTo }, { select: ["requests"] }),
//   ]);

//   if (!requestingUser || !requestedUser) {
//     return msg("INVALID PROFILES TO FOLLOW", "");
//   }

//   if (requestingUser.id === requestedUser.id) {
//     return msg("SELF ERROR", "");
//   }

//   if (requestingUser.requests.length > 50) {
//     return msg("YOUR_MAX", "");
//   }

//   if (requestedUser.requests.length > 50) {
//     return msg("OTHER_MAX", "");
//   }

//   const isRequestExists = await Request.findOne({
//     $or: [
//       { requestBy: requestingUser._id },
//       { requestTo: data.requestTo },
//     ],
//   });

//   if (isRequestExists) {
//     return msg("REQUEST ALREADY EXISTS", "");
//   }

//   const request = new Request(data);
//   requestingUser.requests.push(request._id);
//   requestedUser.requests.push(request._id);

//   await Promise.all([
//     request.save(),
//     requestingUser.save(),
//     requestedUser.save(),
//   ]);

//   return msg("REQUEST SENT", requestedUser._id);
// };

// const checkIfExists = async (data: CheckRequestExistsField) => {
//   const isRequestExists = await Request.findOne({
//     $or: [{ requestBy: data.requestBy }, { requestTo: data.requestTo }],
//   }).lean();

//   return !!isRequestExists;
// };

// const action = async (data: RequestAction) => {
//   const request = await Request.findById(convertToObjectId(data.requestId));

//   if (!request) {
//     return "NO REQUEST EXISTS";
//   }

//   const [requestingUser, requestedUser] = await Promise.all([
//     ProfileStore.get({ playerId: request.requestBy.toString() }, { select: [] }),
//     ProfileStore.get({ username: request.requestTo }, {}),
//   ]);

//   if (requestingUser && requestedUser) {
//     if (data.action === "ACCEPT") {
//       requestedUser.friends.push(requestingUser._id);
//       requestingUser.friends.push(requestedUser._id);
//       const requestForRequestedUser = requestedUser.requests.filter(
//         (f) => f !== convertToObjectId(data.requestId)
//       );
//       const requestForRequestingUser = requestingUser.requests.filter(
//         (f) => f !== convertToObjectId(data.requestId)
//       );

//       requestedUser.requests = requestForRequestedUser;
//       requestingUser.requests = requestForRequestingUser;
//     }

//     const [profileOne, profileTwo, requestRemoved] = await Promise.all([
//       requestedUser.save(),
//       requestingUser.save(),
//       request.deleteOne(),
//     ]);

//     return true;
//   }

//   return "INVALID REQUEST";
// };

// const RequestStore = {
//   create,
//   checkIfExists,
//   action,
// };

// export default RequestStore;

import ProfileStore from "../profile/profile.store";
import Request from "./requests.schema";
import convertToObjectId from "../../../lib/convert";
import Profile from "../profile/profile.schema";

type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";
type RequestFields = "status" | "requestBy" | "requestTo";

type PlayerID = string;
type Username = string;
type ProfileID = string;
type RequestID = string;

interface CreateRequestField {
  status: RequestStatus;
  requestBy: PlayerID;
  requestTo: Username;
}

interface CheckRequestExistsField {
  requestBy: ProfileID;
  requestTo: ProfileID;
}

const create = async (data: CreateRequestField) => {
  const [requestBy, requestTo] = await Promise.all([
    ProfileStore.get({ playerId: data.requestBy }, { select: ["requests"] }),
    ProfileStore.get({ username: data.requestTo }, { select: ["requests"] }),
  ]);

  if (requestBy && requestTo) {
    if (requestBy.requests.length >= 50) {
      return "YOUR MAX";
    }

    if (requestTo.requests.length >= 50) {
      return "OTHER MAX";
    }

    const isRequestExists = await checkIfExists({
      requestBy: requestBy.id,
      requestTo: requestTo.id,
    });

    if (isRequestExists) {
      return "REQUEST EXISTS";
    }

    const request = new Request({
      status: "PENDING",
      requestBy: requestBy._id,
      requestTo: requestTo._id,
    });

    requestBy.requests.push(request._id);
    requestTo.requests.push(request._id);

    await Promise.all([request.save(), requestBy.save(), requestTo.save()]);

    return "REQUEST SENT";
  } else {
    return "NO USERS FOUND";
  }
};

const checkIfExists = async (data: CheckRequestExistsField) => {
  const isRequestExists = await Request.findOne({
    $or: [
      { requestBy: convertToObjectId(data.requestBy) },
      { requestTo: convertToObjectId(data.requestTo) },
    ],
  }).lean();

  return !!isRequestExists;
};

const actionRequest = async (
  requestId: RequestID,
  player: PlayerID,
  type: "ACCEPT" | "REJECT"
) => {
  const profile = await Profile.findOne({
    player: player,
    requests: { $elemMatch: { $eq: convertToObjectId(requestId) } },
  });

  if (!profile) {
    return "INVALID REQUEST";
  }

  const request = await Request.findById(convertToObjectId(requestId));
  console.log(request?.requestTo.toString() === profile._id.toString());
  if (!(request?.requestTo.toString() === profile._id.toString())) {
    return "INVALID REQUEST";
  }

  const getOtherProfile = await Profile.findById(request.requestBy);

  if (!getOtherProfile) {
    return "INVALID REQUEST";
  }

  if (type === "ACCEPT") {
    getOtherProfile?.friends.push(profile._id);
    profile.friends.push(getOtherProfile?._id);
  }

  const newRequestForOtherProfile = getOtherProfile.requests.filter(
    (f) => f._id.toString() !== request._id.toString()
  );
  const newRequestForProfile = profile.requests.filter(
    (f) => f._id.toString() !== request._id.toString()
  );

  console.log([newRequestForProfile, newRequestForOtherProfile]);

  getOtherProfile.requests = newRequestForOtherProfile;
  profile.requests = newRequestForProfile;

  await Promise.all([
    request.deleteOne(),
    profile.save(),
    getOtherProfile.save(),
  ]);

  return getOtherProfile.player;
};

const RequestStore = {
  create,
  actionRequest,
};

export default RequestStore;
