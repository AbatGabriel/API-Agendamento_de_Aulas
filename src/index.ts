require("dotenv");
require("express-async-errors");

import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("running...");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening to port ${port}`));
