import { Router } from "express";
const router = Router();

import {
  getAllInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "../controllers/instructor";

router.route("/instructors").get(getAllInstructors);

router.route("/instructor").post(createInstructor);

router.route("/instructor/:id").put(updateInstructor);

router.route("/instructor/:id").delete(deleteInstructor);

export default router;
