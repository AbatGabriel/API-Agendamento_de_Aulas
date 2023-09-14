import express from "express";
const router = express.Router();

import { getScheduleUploads, uploadFile } from "../controllers/upload";
import { authMiddleware, verifyUser } from "../middleware/auth";

router
  .route("/schedule/:id/upload")
  .post(authMiddleware, verifyUser, uploadFile);
router
  .route("/schedule/:id/uploads")
  .get(authMiddleware, verifyUser, getScheduleUploads);

export default router;
