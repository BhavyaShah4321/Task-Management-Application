import mongoose from 'mongoose';

// Numeric weight used for correct priority sorting at the DB level.
// Alphabetical sort of 'High'/'Low'/'Medium' is wrong — this fixes it.
const PRIORITY_ORDER = { Low: 1, Medium: 2, High: 3 };

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    // Numeric mirror of priority for correct DB-level sorting
    priorityOrder: {
      type: Number,
      default: 2, // Medium
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
  },
  { timestamps: true }
);

// Keep priorityOrder in sync whenever priority changes
taskSchema.pre('save', function () {
  if (this.isModified('priority')) {
    this.priorityOrder = PRIORITY_ORDER[this.priority] ?? 2;
  }
});

export default mongoose.model('Task', taskSchema);
