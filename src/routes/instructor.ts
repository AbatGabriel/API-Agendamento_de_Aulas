import { Router } from "express";
const router = Router();

import {
  getAllInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "../controllers/instructor";

//instructors routes

//cadastrar, listar, atualizar e excluir instrutores

router.route("/instructors").get(getAllInstructors);

router.route("/instructor").post(createInstructor);

router.route("/instructor/:id").put(updateInstructor);

router.route("/instructor/:id").delete(deleteInstructor);

module.exports = router;
