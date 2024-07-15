import convertToObjectId from "../../../lib/convert";
import database from "../../database";
import { Schema } from "mongoose";

const profileSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  requests: {
    type: [Schema.Types.ObjectId],
    ref: "Request",
  },

  friends: {
    type: [Schema.Types.ObjectId],
    ref: "Profile",
  },

  stats: {
    type: Schema.Types.ObjectId,
    ref: "Stats",
  },

  inventory: {
    type: Schema.Types.ObjectId,
    ref: "Inventory",
  },

  player: {
    type: Schema.Types.ObjectId,
    ref: "Player",
  },
});

const Profile = database.model("Profile", profileSchema);

export default Profile;
