import { Router } from "express";
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/agendamento";
const router = Router();

router
  .post("/schedule", createSchedule)
  .put("/schedule/:id", updateSchedule)
  .delete("/schedule/:id", deleteSchedule);

export default router;
