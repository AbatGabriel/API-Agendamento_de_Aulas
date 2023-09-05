import express from "express";
const router = express.Router();

import { uploadFile } from "../controllers/upload";

router.route("/uploader").post(uploadFile);

export default router;
