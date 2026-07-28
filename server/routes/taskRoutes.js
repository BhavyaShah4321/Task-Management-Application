import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = Router();

// ── Validation ────────────────────────────────────────────────────────────────

const createTaskValidation = [
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

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty'),

  body('description')
    .optional()
    .trim(),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),

  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status value'),

  // Only validate dueDate when it is explicitly being changed
  body('dueDate')
    .optional()
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

// ── Routes ────────────────────────────────────────────────────────────────────

router.get('/', protect, getTasks);
router.post('/', protect, createTaskValidation, createTask);
router.put('/:id', protect, updateTaskValidation, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;
