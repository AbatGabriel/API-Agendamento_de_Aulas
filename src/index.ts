import "dotenv/config";
require("express-async-errors");

import express, { Request, Response } from "express";
import { connectToDB } from "./db/connect";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("running...");
});

const port = process.env.PORT || 3000;

// Starts application connecting it to Database
const start = async function () {
  try {
    if (process.env.MONGO_URI) {
      await connectToDB(process.env.MONGO_URI);
    } else {
      throw new Error("Invalid URI");
    }

    app.listen(port, () => console.log(`Server is listening to port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
