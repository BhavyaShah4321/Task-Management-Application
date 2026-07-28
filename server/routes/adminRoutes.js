import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import { getAdminStats, getAdminUsers, getAdminTasks, assignTask } from '../controllers/adminController.js';

const router = Router();

const assignTaskValidation = [
    body('userId')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid user ID'),

    body('title')
        .trim()
        .notEmpty().withMessage('Title is required'),

    body('description')
        .optional()
        .trim(),

    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),

    body('status')
        .optional()
        .isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status value'),

    body('dueDate')
        .notEmpty().withMessage('Due date is required')
        .isISO8601().withMessage('Due date must be a valid date')
        .custom((value) => {
            const due = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (due < today) {
                throw new Error('Due date cannot be in the past');
            }
            return true;
        }),
];

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/users', protect, adminOnly, getAdminUsers);
router.get('/tasks', protect, adminOnly, getAdminTasks);
router.post('/tasks', protect, adminOnly, assignTaskValidation, assignTask);

export default router;
