import { boolean, string } from "zod";
import database from "../../database";
import { Mongoose, Schema } from "mongoose";

const masterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    games: {
      type: [Schema.Types.ObjectId],
    },

    lastLogined: {
      type: Date,
    },

    forgotPasswordToken: {
      type: String,
    },

    verificationCode: {
      type: Number,
    },

    verificationExpiration: {
      type: Date,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Master = database.model("Master", masterSchema);

export default Master;
