import { Router } from "express";
const router = Router();

import {
  getAllInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "../controllers/instructor";
import { authMiddleware, verifyRoles } from "../middleware/auth";
import { loginInstructor } from "../controllers/main";

router
  .route("/instructors")
  .get(authMiddleware, verifyRoles("Student"), getAllInstructors);

router.route("/instructor").post(createInstructor);

router.route("/instructor/login").post(loginInstructor);

router
  .route("/instructor/:id")
  .put(authMiddleware, verifyRoles("Instructor"), updateInstructor);

router
  .route("/instructor/:id")
  .delete(authMiddleware, verifyRoles("Instructor"), deleteInstructor);

export default router;
