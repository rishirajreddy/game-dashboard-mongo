import { z } from "zod";
import requestHandler from "../lib/request-handler";
import { getFromObject } from "../lib/utils";
import RequestStore from "../database/schema/requests/requests.store";
import ApiResponse from "../lib/api-response";
import ProfileStore from "../database/schema/profile/profile.store";
import Profile from "../database/schema/profile/profile.schema";
import convertToObjectId from "../lib/convert";

const requestValidation = z.object({
  username: z.string(),
});

const requestIdValidation = z.object({
  id: z.string().min(24).max(24),
});

const request = requestHandler(async (req, res, next) => {
  const { username } = requestValidation.parse(req.body);
  const userId = getFromObject(res, "userId");

  const createRequest = await RequestStore.create({
    status: "PENDING",
    requestBy: userId,
    requestTo: username,
  });

  res.send(createRequest);

  // switch (createRequest.msg) {
  //   case "REQUEST SENT":
  //     res.status(201).send(new ApiResponse(201, "Friend request sent"));
  //     break;

  //   case "YOUR_MAX":
  //     res
  //       .status(400)
  //       .send(new ApiResponse(400, "Maximum friend request limit reached"));
  //     break;

  //   case "OTHER_MAX":
  //     res
  //       .status(400)
  //       .send(
  //         new ApiResponse(
  //           400,
  //           `${username} has reached maximum pending requests`
  //         )
  //       );
  //     break;

  //   case "REQUEST ALREADY EXISTS":
  //     res.status(400).send(new ApiResponse(400, "Request already exists"));
  //     break;

  //   case "INVALID PROFILES TO FOLLOW":
  //     res
  //       .status(400)
  //       .send(new ApiResponse(400, "Invalid profiles to send request "));
  //     break;

  //   case "SELF ERROR":
  //     res
  //       .status(400)
  //       .send(new ApiResponse(400, "You can't make yourself friend."));
  //     break;

  //   default:
  //     res.send("Something went wrong");
  // }
});

const acceptRequest = requestHandler(async (req, res, next) => {
  const { id } = requestIdValidation.parse(req.body);
  const userId = getFromObject(res, "userId");

  const acceptRequest = await RequestStore.actionRequest(id, userId, "ACCEPT");

  if (acceptRequest === "INVALID REQUEST") {
    res.status(400).json(new ApiResponse(400, "Invalid request"));
    return;
  }

  res.status(200).send(new ApiResponse(200, "Request Accepted"));
});

// const requestAccept = requestHandler(async (req, res, next) => {
//   const { id } = requestIdValidation.parse(req.body);

//   const request = await RequestStore.action({
//     action: "ACCEPT",
//     requestId: id,
//   });

//   switch (request) {
//     case "INVALID REQUEST":
//       res.status(400).send(new ApiResponse(400, "No such request exists"));
//       return;

//     case "NO REQUEST EXISTS":
//       res.status(400).send(new ApiResponse(400, "No such request exists"));
//       return;

//     case true:
//       res.status(200).send(new ApiResponse(200, "Request Accepted"));
//       return;
//   }
// });

const getRequest = requestHandler(async (req, res, next) => {
  const userId = getFromObject(res, "userId");

  const profile = await Profile.findOne({ player: userId })
    .populate({
      path: "requests",
      populate: {
        path: "requestBy requestTo",
        model: Profile,
        select: "username ",
      },
    })
    .select("requests username");

  // const profile = await ProfileStore.get(
  //   { playerId: userId },
  //   { select: ["requests"], populate: ["requests"] }
  // );

  res.send(new ApiResponse(200, "Requests are: ", { requests: profile }));
});

const rejectRequest = requestHandler(async (req, res, next) => {
  const { id } = requestIdValidation.parse(req.body);
  const userId = getFromObject(res, "userId");

  const acceptRequest = await RequestStore.actionRequest(id, userId, "REJECT");

  if (acceptRequest === "INVALID REQUEST") {
    res.status(400).json(new ApiResponse(400, "Invalid request"));
    return;
  }

  res.status(200).send(new ApiResponse(200, "Request Rejected"));
});

const removeFriend = requestHandler(async (req, res, next) => {
  const { id } = requestIdValidation.parse(req.body);
  const userId = getFromObject(res, "userId");

  res.send(await ProfileStore.removeFriend(userId, id));
});

const getFriends = requestHandler(async (req, res, next) => {
  const playerId = getFromObject(res, "userId");

  const friends = await Profile.findOne({
    player: convertToObjectId(playerId),
  })
    .populate({ path: "friends", select: ["username"] })
    .select("friends username");

  res.status(200).send(new ApiResponse(200, "Friends are :", { friends }));
});

const friendsController = {
  request,
  getRequest,
  acceptRequest,
  rejectRequest,
  removeFriend,
  getFriends,
};

export default friendsController;
