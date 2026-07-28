import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import Task from '../models/Task.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const VALID_SORT_FIELDS = ['createdAt', 'dueDate', 'priority'];
const VALID_SORT_ORDERS = ['asc', 'desc'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

// GET /api/tasks — supports search, filter, sort, pagination
const getTasks = async (req, res) => {
  const {
    search,
    status,
    priority,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page,
    limit,
  } = req.query;

  // Validate enum-style query params
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({ success: false, message: 'Invalid priority value' });
  }
  if (!VALID_SORT_FIELDS.includes(sortBy)) {
    return res.status(400).json({ success: false, message: 'Invalid sortBy value' });
  }
  if (!VALID_SORT_ORDERS.includes(sortOrder)) {
    return res.status(400).json({ success: false, message: 'Invalid sortOrder value' });
  }

  // Safe page / limit parsing
  const pageNumber = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
  const skip = (pageNumber - 1) * pageSize;

  // Build MongoDB filter — always scoped to the current user
  const query = { user: req.user._id };

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }
  if (status) {
    query.status = status;
  }
  if (priority) {
    query.priority = priority;
  }

  // Build sort — priority sorts on the numeric priorityOrder field
  const sortField = sortBy === 'priority' ? 'priorityOrder' : sortBy;
  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortDirection };

  try {
    const [tasks, totalTasks] = await Promise.all([
      Task.find(query).sort(sort).skip(skip).limit(pageSize),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalTasks / pageSize);

    return res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          currentPage: pageNumber,
          pageSize,
          totalTasks,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('getTasks error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      status,
      dueDate,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    console.error('createTask error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, priority, status, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    console.error('updateTask error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('deleteTask error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { getTasks, createTask, updateTask, deleteTask };
