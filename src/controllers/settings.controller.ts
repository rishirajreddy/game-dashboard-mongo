import { z } from "zod";
import requesHandler from "../lib/request-handler";
import SettingStore from "../database/schema/settings/settings,store";
import ApiResponse from "../lib/api-response";
import Cache from "../services/caching.service";
import cache from "../services/caching.service";
import { removeDuplicatesAndMerge } from "../lib/utils";
import Settings from "../database/schema/settings/settings.schema";

const statsCreateValidation = z.object({
  stats: z.string().array(),
});

const statsCreate = requesHandler(async (req, res, next) => {
  const { stats } = statsCreateValidation.parse(req.body);

  const addedStats = await SettingStore.addStats({ stats });

  res.status(201).json(new ApiResponse(201, "Stats added", { addedStats }));
});

const statsAdd = requesHandler(async (req, res, next) => {
  const { stats } = statsCreateValidation.parse(req.body);

  let cachedStats = cache.get("stats");

  if (!cachedStats) {
    cachedStats = await SettingStore.getStats();
    if (!cachedStats) {
      res
        .status(400)
        .send(
          new ApiResponse(400, "No stats exists yet you have to create one.")
        );
      return;
    }

    cache.set("stats", cachedStats);
  }

  const removeDuplicates = removeDuplicatesAndMerge(
    stats,
    cachedStats as String[]
  );

  const databaseState = (await Settings.find()).at(0);
  console.log(databaseState);
  if (databaseState) {
    databaseState.stats = removeDuplicates as string[];
  }

  await databaseState?.save();

  // await SettingStore.addStats({ stats: removeDuplicates as string[] });

  res.send(removeDuplicates);
});

const statsCacheBuild = requesHandler(async (req, res, next) => {
  const stats = await SettingStore.getStats();

  if (!stats) {
    res.status(400).json(new ApiResponse(400, "No stats exists for caching.."));
    return;
  }

  const cached = cache.set("stats", stats);

  if (!cached) {
    res
      .status(500)
      .send(
        new ApiResponse(
          500,
          "Failed to cache the stats contact developer team for more information"
        )
      );
    return;
  }

  res.status(200).send(new ApiResponse(200, "Stats Cached"));
});

const settingsController = {
  statsCreate,
  statsCacheBuild,
  statsAdd,
};

export default settingsController;
