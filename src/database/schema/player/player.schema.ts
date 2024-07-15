import mongoose, { Schema } from "mongoose";
import database from "../../database";

const playerSchema = new Schema(
  {
    name: {
      type: String,
    },

    uid: {
      type: Number,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },

    lastLogined: {
      type: Date,
    },

    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
  },
  { timestamps: true }
);

const Player = database.model("Player", playerSchema);

export default Player;
