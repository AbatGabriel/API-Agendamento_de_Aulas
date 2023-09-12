import express from "express";
const router = express.Router();

import { getScheduleUploads, uploadFile } from "../controllers/upload";

router.route("/schedule/:id/upload").post(uploadFile);
router.route("/schedule/:id/uploads").get(getScheduleUploads);

export default router;
