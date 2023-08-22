import mongoose from "mongoose";

// Connects to database with url given by env variable
export const connectToDB = function (url: string) {
  return mongoose.connect(url);
};
