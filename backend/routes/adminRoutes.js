import express from 'express';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProjects,
  deleteProjectAdmin,
  getAllTasks,
  updateTaskAdmin,
  deleteTaskAdmin,
  getAdminStats,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('Admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);
router.get('/projects', getAllProjects);
router.delete('/projects/:projectId', deleteProjectAdmin);
router.get('/tasks', getAllTasks);
router.patch('/tasks/:taskId', updateTaskAdmin);
router.delete('/tasks/:taskId', deleteTaskAdmin);

export default router;