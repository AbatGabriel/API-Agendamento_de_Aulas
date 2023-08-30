import { Router } from "express";
const router = Router();

import {
  getAllInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "../controllers/instructor";
import { authMiddleware, verifyRoles, verifyUser } from "../middleware/auth";
import { loginInstructor } from "../controllers/main";

// All instructor routes

router
  .route("/instructors")
  .get(authMiddleware, verifyRoles("Student"), getAllInstructors);

router.route("/instructor").post(createInstructor);

router.route("/instructor/login").post(loginInstructor);

router
  .route("/instructor/:id")
  .put(authMiddleware, verifyUser, updateInstructor);

router
  .route("/instructor/:id")
  .delete(authMiddleware, verifyUser, deleteInstructor);

export default router;
