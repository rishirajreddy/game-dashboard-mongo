import database from "../../database";
import { Schema } from "mongoose";

const statSchema = new Schema({
  name: String,
});

const leaderboardSchema = new Schema({
  name: String,
  stats: [],
});
