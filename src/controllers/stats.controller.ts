import { z } from "zod";
import requesHandler from "../lib/request-handler";
import validator from "../services/validator.service";
import ApiResponse from "../lib/api-response";
import { getFromObject } from "../lib/utils";
import ProfileStore from "../database/schema/profile/profile.store";
import StatsStore from "../database/schema/stats/stats.store";
import Profile from "../database/schema/profile/profile.schema";
import convertToObjectId from "../lib/convert";

const addValidation = z.object({
  stats: z
    .object({
      name: z.string(),
      value: z.number(),
    })
    .array(),
});

const add = ({ isMaster }: { isMaster: boolean }) => {
  return requesHandler(async (req, res, next) => {
    const stats = addValidation.parse(req.body);
    let userId = getFromObject(res, "userId");
    if (isMaster) {
      const { playerId } = req.query;
      console.log(playerId);
      if (!playerId) {
        res
          .status(422)
          .json(
            new ApiResponse(
              422,
              "To perform any action you have to add playerId= parameter"
            )
          );
        return;
      }

      userId = playerId as string;
    }

    const isAcceptableStatsKey = await validator.service.statsValidator(
      stats.stats
    );

    console.log(isAcceptableStatsKey);

    if (!isAcceptableStatsKey) {
      res
        .status(400)
        .send(
          new ApiResponse(
            400,
            "Maybe you included a invalid stat, please check that if you already registered that or not."
          )
        );

      return;
    }

    const isStatAdded = await StatsStore.create(userId, stats.stats);

    if (isStatAdded === "NO PLAYER FOUND") {
      res
        .status(500)
        .json(
          new ApiResponse(
            500,
            `Internal server Error. No player found with playerId: ${userId}`
          )
        );
      return;
    }

    res
      .status(201)
      .send(new ApiResponse(201, `Added stats to player id ${userId}`));
  });
};

const getStats = requesHandler(async (req, res, next) => {
  const playerId = getFromObject(res, "userId");

  const stats = await Profile.findOne({
    player: convertToObjectId(playerId),
  }).select("stats username");

  if (!stats) {
    res.status(204).json(new ApiResponse(204, "No stats found"));
    return;
  }

  res.status(200).send(new ApiResponse(200, "Player stats are:", { stats }));
});

const statsController = {
  add,
  getStats,
};

export default statsController;
