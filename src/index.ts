import "dotenv/config";
require("express-async-errors");

import express, { Request, Response } from "express";
import { connectToDB } from "./db/connect";

const app = express();
app.use(express.json());

//routers
import studentRouter from "./routes/student";

//routes
app.use("/", studentRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("running...");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening to port ${port}`));
