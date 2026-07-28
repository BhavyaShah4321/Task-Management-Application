import mongoose from 'mongoose';
import User from '../models/User.js';
import Task from '../models/Task.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const VALID_SORT_FIELDS = ['createdAt', 'dueDate', 'priority'];
const VALID_SORT_ORDERS = ['asc', 'desc'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
    ] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: 'Pending' }),
      Task.countDocuments({ status: 'In Progress' }),
      Task.countDocuments({ status: 'Completed' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
    });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('name email role')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

const getAdminTasks = async (req, res) => {
  const {
    search,
    status,
    priority,
    userId,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page,
    limit,
  } = req.query;

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

  const pageNumber = Math.max(parseInt(page) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(limit) || 10, 1), 50);
  const skip = (pageNumber - 1) * pageSize;

  const query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }
  if (status) {
    query.status = status;
  }
  if (priority) {
    query.priority = priority;
  }
  if (userId) {
    if (!isValidId(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    query.user = userId;
  }

  const sortField = sortBy === 'priority' ? 'priorityOrder' : sortBy;
  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortDirection };

  try {
    const [tasks, totalTasks] = await Promise.all([
      Task.find(query)
        .populate('user', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(pageSize),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalTasks / pageSize);

    res.status(200).json({
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
    console.error('getAdminTasks error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
    });
  }
};

const assignTask = async (req, res) => {
  const { userId, title, description, priority, status, dueDate } = req.body;

  if (!userId || !title || !dueDate) {
    return res.status(400).json({
      success: false,
      message: 'userId, title, and dueDate are required',
    });
  }

  if (!isValidId(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID',
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'user') {
      return res.status(400).json({
        success: false,
        message: 'Tasks can only be assigned to normal users',
      });
    }

    const task = await Task.create({
      user: userId,
      title,
      description,
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: 'Task assigned successfully',
      data: { task },
    });
  } catch (error) {
    console.error('assignTask error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to assign task',
    });
  }
};

export { getAdminStats, getAdminUsers, getAdminTasks, assignTask };
