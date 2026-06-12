import express from 'express';
import { getDashboardStats, getActivity } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats/:projectId', protect, getDashboardStats);
router.get('/activity/:projectId', protect, getActivity);

export default router;
