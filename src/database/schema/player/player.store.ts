import Player from "./player.schema";

type PlayerFields =
  | "name"
  | "uid"
  | "email"
  | "password"
  | "lastLogined"
  | "profile"
  | "_id"
  | "__v";

interface PlayerCreateFields {
  email: string;
  password: string;
  name: string;
  uid: number;
}

interface PlayerGetFromFields {
  email?: string;
  id?: string;
}

const create = async (data: PlayerCreateFields) => {
  const player = new Player(data);

  return await player.save();
};

const get = async (
  { email, id }: PlayerGetFromFields,
  { select, populate }: { select?: PlayerFields[]; populate?: PlayerFields[] }
) => {
  const findUsing = {
    ...(email && { email: email }),
    ...(id && { _id: id }),
  };

  if (!Object.keys(findUsing)) {
    return false;
  }

  const player = await Player.findOne(findUsing)
    .select(select || [])
    .populate(populate || []);

  if (!player) {
    return false;
  }

  return player;
};

const PlayerStore = {
  create,
  get,
};

export default PlayerStore;
