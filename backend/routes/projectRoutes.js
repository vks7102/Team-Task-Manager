import express from 'express';
import {
  createProject,
  getUserProjects,
  getProjectById,
  addMember,
  removeMember,
  deleteProject,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getUserProjects);
router.get('/:id', protect, getProjectById);
router.post('/:id/member', protect, addMember);
router.delete('/:id/member/:userId', protect, removeMember);
router.delete('/:id', protect, deleteProject);

export default router;
