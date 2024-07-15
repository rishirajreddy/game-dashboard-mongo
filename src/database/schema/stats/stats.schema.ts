import { Schema } from "mongoose";
import database from "../../database";

const statArrayElem = new Schema({
  name: String,
  value: Number,
});

const statsSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },

  stat: [statArrayElem],
});

const Stats = database.model("Stats", statsSchema);

export default Stats;
