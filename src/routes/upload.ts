import express from "express";
const router = express.Router();

<<<<<<< HEAD
import {
  getScheduleUploads,
  uploadFile,
  removeUpload,
} from "../controllers/upload";
=======
import { getScheduleUploads, uploadFile } from "../controllers/upload";
>>>>>>> 2ded6d7f38201656224b6a6b46d6b2fca2df2e88
import { authMiddleware, verifyUser } from "../middleware/auth";

router
  .route("/schedule/:id/upload")
  .post(authMiddleware, verifyUser, uploadFile);
router
  .route("/schedule/:id/uploads")
  .get(authMiddleware, verifyUser, getScheduleUploads);

<<<<<<< HEAD
router
  .route("/schedule/:id/uploads/remove")
  .post(authMiddleware, verifyUser, removeUpload);

=======
>>>>>>> 2ded6d7f38201656224b6a6b46d6b2fca2df2e88
export default router;
