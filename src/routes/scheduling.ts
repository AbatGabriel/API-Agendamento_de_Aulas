import { Router } from 'express';
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/scheduling';
import { authMiddleware, verifyRoles, verifyUser } from '../middleware/auth';
const router = Router();

router.route('/schedules').get(authMiddleware,verifyUser,getAllSchedules);
router
  .post('/schedule', authMiddleware, verifyRoles('Student'), createSchedule)
  .put(
    '/schedule/:id',
    authMiddleware,
    verifyUser,
    verifyRoles('Student'),
    updateSchedule
  )
  .delete(
    '/schedule/:id',
    authMiddleware,
    verifyUser,
    verifyRoles('Student'),
    deleteSchedule
  );

export default router;
