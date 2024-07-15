import database from "../../database";
import { Schema } from "mongoose";

const requestSchema = new Schema({
  status: {
    type: String,
    required: true,
  },

  requestBy: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },

  requestTo: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
});

const Request = database.model("Request", requestSchema);

export default Request;
