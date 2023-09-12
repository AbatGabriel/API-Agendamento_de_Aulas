import "dotenv/config";
require("express-async-errors");

import express, { Request, Response } from "express";
import { connectToDB } from "./db/connect";

import swaggerUI from "swagger-ui-express";
import YAML from "yamljs";

// Loads swagger docs
const swaggerDocs = YAML.load("./swagger.yaml");

const app = express();

app.use(express.json());

//routers
import instructorRouter from "./routes/instructor";
import studentRouter from "./routes/student";
import scheduleRouter from "./routes/agendamento";
// Swagger docs route
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//routes
app.use("/", instructorRouter);
app.use("/", studentRouter);
app.use("/", scheduleRouter);

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

export default app;

start();
