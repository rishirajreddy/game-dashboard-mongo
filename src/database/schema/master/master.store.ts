import convertToObjectId from "../../../lib/convert";
import Master from "./master.schema";

type MasterUserFieldsEnum =
  | "email"
  | "name"
  | "password"
  | "games"
  | "lastLogined"
  | "forgotPasswordToken"
  | "verificationCode"
  | "verificationExpiration";

interface MasterUserCreateFeilds {
  email: string;
  password: string;
  verificationCode: number;
  name: string;
  verificationExpiration: Date;
}

interface MasterUserEditFeilds {
  email?: string;
  password?: string;
  verificationCode?: number;
  name?: string;
  verificationExpiration?: Date;
  verified?: boolean;
}

interface MasterUserGetFrom {
  email?: string;
  id?: string;
}

interface MasterUserSelectAndPopulate {
  select?: MasterUserFieldsEnum[];
  populate?: MasterUserFieldsEnum[];
}

const get = async (
  { email, id }: MasterUserGetFrom,
  { select, populate }: MasterUserSelectAndPopulate
) => {
  const findWith = {
    ...(email && { email: email }),
    ...(id && { _id: convertToObjectId(id) }),
  };

  console.log(findWith)

  const master = await Master.findOne(findWith)
    .select(select || [])
    .populate(populate || []);

  return master;
};

const create = async (data: MasterUserCreateFeilds) => {
  const master = new Master(data);

  return await master.save();
};

const edit = async (
  { email, id }: MasterUserGetFrom,
  data: MasterUserEditFeilds
) => {
  const editFields = {
    ...(data.email && { email: data.email }),
    ...(data.password && { password: data.password }),
    ...(data.verificationCode && { verificationCode: data.verificationCode }),
    ...(data.verificationExpiration && {
      verificationExpiration: data.verificationExpiration,
    }),
    ...(data.verified && { verified: data.verified }),
  };

  const findWith = {
    ...(email && { email: email }),
    ...(id && { id: id }),
  };

  const editedMaster = await Master.findOneAndUpdate(findWith, editFields);

  console.log(editedMaster);
};

const MasterStore = {
  get,
  create,
  edit,
};

export default MasterStore;
