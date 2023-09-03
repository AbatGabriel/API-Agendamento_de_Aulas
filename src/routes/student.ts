import { Router } from "express";
const router = Router();

import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student";
import { authMiddleware, verifyRoles, verifyUser } from "../middleware/auth";
import { loginStudent } from "../controllers/main";

// All students routes

router
  .route("/students")
  .get(authMiddleware, verifyRoles("Student"), getAllStudents);

router.route("/student").post(createStudent);

router.route("/student/login").post(loginStudent);

router.route("/student/:id").put(authMiddleware, verifyUser, updateStudent);

router.route("/student/:id").delete(authMiddleware, verifyUser, deleteStudent);

export default router;
