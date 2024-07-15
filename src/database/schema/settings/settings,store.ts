import Settings from "./settings.schema";

const addStats = async (data: { stats: string[] }) => {
  const newData = new Settings({
    stats: data.stats,
  });

  return await newData.save();
};

const getStats = async () => {
  const stats = (await Settings.find()).at(0)?.stats;

  if (!stats) {
    return false;
  }

  return stats;
};

const SettingStore = {
  addStats,
  getStats,
};

export default SettingStore;
