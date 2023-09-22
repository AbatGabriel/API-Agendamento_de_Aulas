import express from 'express';
const router = express.Router();

import {
  getScheduleUploads,
  uploadFile,
  removeUpload,
} from '../controllers/upload';
import { authMiddleware, verifyUser } from '../middleware/auth';

router
  .route('/schedule/:id/upload')
  .post(authMiddleware, verifyUser, uploadFile);
router
  .route('/schedule/:id/uploads')
  .get(authMiddleware, verifyUser, getScheduleUploads);

router
  .route('/schedule/:id/uploads/remove')
  .post(authMiddleware, verifyUser, removeUpload);

export default router;
