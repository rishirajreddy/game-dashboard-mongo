import cache from "./caching.service";
import SettingStore from "../database/schema/settings/settings,store";

interface StatsToVerify {
  name: string;
  value: number;
}

const statsValidator = async (data: StatsToVerify[]) => {
  let statsCache = cache.get("stats") as string[];

  if (!statsCache) {
    console.log("Here")
    const stats = await SettingStore.getStats();
    if (!stats) {
      return false;
    }

    cache.set("stats", stats);
    statsCache = stats;
  }

  const statsNames = data.map((d) => d.name);
  const isExists = statsNames.every((name) => statsCache?.includes(name));

  return !!isExists;
};

const validator = {
  service: {
    statsValidator,
  },
};

export default validator;
