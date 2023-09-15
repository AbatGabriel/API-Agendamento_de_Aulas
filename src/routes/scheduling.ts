import { Router } from 'express';
import {
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/scheduling';
import { authMiddleware, verifyRoles, verifyUser } from '../middleware/auth';
const router = Router();

router
  .post('/schedule', authMiddleware, verifyRoles("Student"), createSchedule)
  .put('/schedule/:id', authMiddleware, verifyUser, verifyRoles("Student"), updateSchedule)
  .delete('/schedule/:id', authMiddleware, verifyUser,  verifyRoles("Student"), deleteSchedule);

export default router;
