import { z } from "zod";
import requesHandler from "../lib/request-handler";
import { getFromObject } from "../lib/utils";
import ProfileStore from "../database/schema/profile/profile.store";
import ApiResponse from "../lib/api-response";

const createValidation = z.object({
  username: z.string(),
});

const create = ({ isMaster }: { isMaster: boolean }) => {
  return requesHandler(async (req, res, next) => {
    const { username } = createValidation.parse(req.body);
    const { playerId } = req.query;
    let id;
    if (isMaster && !playerId) {
      id = playerId;
      res
        .status(400)
        .json(
          new ApiResponse(400, 'Must need to have playerId="" query in url')
        );
      return;
    } else {
      id = getFromObject(res, "userId");
    }

    const profile = await ProfileStore.create(id, { username });

    if (profile === "PLAYER NOT FOUND") {
      res
        .status(400)
        .json(new ApiResponse(400, "No player found to create profile."));
      return;
    }

    if (profile === "PROFILE ALREADY EXISTS") {
      res
        .status(400)
        .json(new ApiResponse(400, "Already a player profile exists."));
      return;
    }

    res
      .status(201)
      .json(new ApiResponse(200, "Profile created successfully", { profile }));
  });
};

const me = requesHandler(async (req, res, next) => {
  const id = getFromObject(res, "userId");

  const profile = await ProfileStore.getLean(
    { playerId: id },
    { populate: ["stats"] }
  );

  res.send(profile);
});

const profileController = {
  create,
  me,
};

export default profileController;
