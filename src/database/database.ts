import mongoose from "mongoose";

// "mongodb+srv://ks492013:ks492013@cluster0.jutd3d1.mongodb.net/game-dashboard?retryWrites=true&w=majority"
const database = mongoose.createConnection(
  "mongodb+srv://ks492013:ks492013@cluster0.jutd3d1.mongodb.net/game-dashboard?retryWrites=true&w=majority"
);

export default database;
