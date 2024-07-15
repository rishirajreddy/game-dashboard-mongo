import convertToObjectId from "../../../lib/convert";
import PlayerStore from "../player/player.store";
import Profile from "./profile.schema";

type ProfileFields =
  | "username"
  | "friends"
  | "stats"
  | "invertory"
  | "player"
  | "requests";

interface CreateProfileFields {
  username: string;
}

interface ProfileGetFrom {
  username?: string;
  id?: string;
  playerId?: string;
}

const create = async (playerId: string, data: CreateProfileFields) => {
  const player = await PlayerStore.get({ id: playerId }, { select: [] });

  if (!player) {
    return "PLAYER NOT FOUND";
  }

  if (player.profile) {
    return "PROFILE ALREADY EXISTS";
  }

  const profile = await new Profile({
    username: data.username,
    player: convertToObjectId(playerId),
  }).save();

  player.profile = profile._id;

  await player.save();

  return profile;
};

const get = async (
  { username, id, playerId }: ProfileGetFrom,
  {
    select,
    populate,
    lean,
  }: { select?: ProfileFields[]; populate?: ProfileFields[]; lean?: boolean }
) => {
  const findWith = {
    ...(username && { username: username }),
    ...(id && { _id: id }),
    ...(playerId && { player: convertToObjectId(playerId) }),
  };
  console.log(findWith);
  if (Object.keys(findWith).length === 0) {
    return false;
  }

  return await Profile.findOne(findWith)
    .select(select || [])
    .populate(populate || []);
};

const getLean = async (
  { username, id, playerId }: ProfileGetFrom,
  {
    select,
    populate,
    lean,
  }: { select?: ProfileFields[]; populate?: ProfileFields[]; lean?: boolean }
) => {
  const findWith = {
    ...(username && { username: username }),
    ...(id && { _id: id }),
    ...(playerId && { player: convertToObjectId(playerId) }),
  };
  console.log(findWith);
  if (Object.keys(findWith).length === 0) {
    return false;
  }

  const selectFields = select && [...select, "_id"];

  return await Profile.findOne(findWith)
    .lean()
    .select(select || [])
    .populate(populate || []);
};

const removeFriend = async (playerId: string, id: string) => {
  // const profile = await Profile.findOneAndUpdate(
  //   { player: convertToObjectId(playerId) },
  //   { $pull: { friends: convertToObjectId(id) } },
  //   { new: true }
  // );

  const profile = await Profile.findOne({
    player: convertToObjectId(playerId),
  }).select("friends");

  if (!profile) {
    return "INVALID FRIEND REMOVE";
  }

  const isExists = profile.friends.find((f) => f.toString() === id);

  if (!isExists) {
    return "INVALID FRIEND REMOVE";
  }

  const otherProfile = await Profile.findById(convertToObjectId(id)).select(
    "friends player"
  );

  if (!otherProfile) {
    return "INVALID FRIEND REMOVE";
  }

  console.log([profile, otherProfile])

  profile.friends = profile.friends.filter((f) => f.toString() !== id);
  otherProfile.friends = otherProfile.friends.filter(
    (f) => f.toString() !== profile._id.toString()
  );

  await Promise.all([profile.save(), otherProfile.save()]);

  return otherProfile.player
};

const ProfileStore = {
  create,
  get,
  getLean,
  removeFriend,
};

export default ProfileStore;
