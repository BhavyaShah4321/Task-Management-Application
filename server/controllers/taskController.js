import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import Task from '../models/Task.js';

// Return 404 for invalid Mongo IDs instead of letting Mongoose throw a CastError
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/tasks — return only the logged-in user's tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    console.error('getTasks error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/tasks — create a task owned by the logged-in user
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
      user: req.user._id,   // always set from token — never from req.body
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

// PUT /api/tasks/:id — update a task that belongs to the logged-in user
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
    // Query by both _id and user so one user can never touch another user's task
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

// DELETE /api/tasks/:id — delete a task that belongs to the logged-in user
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
