import { Types } from "mongoose";

function convertToObjectId(id: string) {
  console.log(id);
  return Types.ObjectId.createFromHexString(id);
}

export default convertToObjectId;
