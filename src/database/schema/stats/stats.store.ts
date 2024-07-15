import convertToObjectId from "../../../lib/convert";
import PlayerStore from "../player/player.store";
import Profile from "../profile/profile.schema";
import ProfileStore from "../profile/profile.store";
import Stats from "./stats.schema";

interface CreateStatFields {
  name: string;
  value: number;
}

const create = async (id: string, stats: CreateStatFields[]) => {
  const profile = await ProfileStore.get(
    { playerId: id },
    { select: ["stats"], lean: false }
  );
  console.log(profile);
  if (!profile) {
    return "NO PLAYER FOUND";
  }

  if (profile.stats) {
    const stat = await Stats.findById(profile.stats);

    if (stat?.stat) {
      stats.forEach((s) => {
        stat.stat.push(s);
      });
      await stat.save();
      return true;
    }
  }

  const stat = new Stats({
    user: profile._id,
    stat: stats,
  });

  profile.stats = stat._id;
  await stat.save();
  await profile.save();

  return true;
};

const StatsStore = {
  create,
};

export default StatsStore;
