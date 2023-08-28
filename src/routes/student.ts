import { Router } from "express";
const router = Router();

import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../Controllers/student";

router.route("/students").get(getAllStudents);

router.route("/student").post(createStudent);

router.route("/student/:id").put(updateStudent);

router.route("/student/:id").delete(deleteStudent);

export default router;
