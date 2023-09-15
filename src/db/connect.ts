import mongoose from 'mongoose';

// Connects to database with url given by env variable
export const connectToDB = function (url: string) {
  return mongoose.connect(url);
};

// create a function to close the connection
export const closeDBConnection = function () {
  return mongoose.connection.close();
};
