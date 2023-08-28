import { Router } from "express";
const router = Router();

import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student";
import { authMiddleware, verifyRoles } from "../middleware/auth";
import { loginStudent } from "../controllers/main";

router
  .route("/students")
  .get(authMiddleware, verifyRoles("Student"), getAllStudents);

router.route("/student").post(createStudent);

router.route("/student/login").post(loginStudent);

router
  .route("/student/:id")
  .put(authMiddleware, verifyRoles("Student"), updateStudent);

router
  .route("/student/:id")
  .delete(authMiddleware, verifyRoles("Student"), deleteStudent);

export default router;
