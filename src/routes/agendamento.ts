import { Router } from "express";
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/agendamento";
import { verifyRoles } from "../middleware/auth";

const router = Router();

router
  .post("/schedule", verifyRoles("Student"), createSchedule)
  .put("/schedule/:id", verifyRoles("Student"), updateSchedule)
  .delete("/schedule/:id", verifyRoles("Student"), deleteSchedule);

export default router;
