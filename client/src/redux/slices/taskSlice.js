import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      return await taskService.getTasks();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks'
      );
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (data, { rejectWithValue }) => {
    try {
      return await taskService.createTask(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create task'
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await taskService.updateTask(id, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update task'
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      return await taskService.deleteTask(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete task'
      );
    }
  }
);

const initialState = {
  tasks: [],
  loading: false,      // used for initial list fetch
  actionLoading: false, // used for create / update / delete
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchTasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createTask
    builder
      .addCase(createTask.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.tasks.unshift(action.payload); // newest first
      })
      .addCase(createTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // updateTask
    builder
      .addCase(updateTask.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // deleteTask — payload is the deleted task's id
    builder
      .addCase(deleteTask.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTaskError } = taskSlice.actions;

export default taskSlice.reducer;
