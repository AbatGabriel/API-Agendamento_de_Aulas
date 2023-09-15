import { Router } from "express";
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAllSchedules,
} from "../controllers/agendamento";
import { verifyRoles, authMiddleware } from "../middleware/auth";

const router = Router();

router.route("/schedules").get(getAllSchedules);
router
  .post("/schedule", authMiddleware, verifyRoles("Student"), createSchedule)
  .put("/schedule/:id", authMiddleware, verifyRoles("Student"), updateSchedule)
  .delete(
    "/schedule/:id",
    authMiddleware,
    verifyRoles("Student"),
    deleteSchedule
  );

export default router;
