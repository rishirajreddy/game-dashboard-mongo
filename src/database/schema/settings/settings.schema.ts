import { Schema } from "mongoose";
import database from "../../database";

const settingsSchema = new Schema({
  stats: {
    type: [String],
  },
});

const Settings = database.model("Settings", settingsSchema);

export default Settings;
