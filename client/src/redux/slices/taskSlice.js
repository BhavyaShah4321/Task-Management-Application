import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../../services/taskService';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params, { rejectWithValue }) => {
    try {
      return await taskService.getTasks(params); // { tasks, pagination }
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
  loading: false,
  actionLoading: false,
  error: null,
  // filter / sort / pagination state
  search: '',
  status: '',
  priority: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  pageSize: 10,
  totalTasks: 0,
  totalPages: 0,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
      state.page = 1;
    },
    setPriority: (state, action) => {
      state.priority = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.search = '';
      state.status = '';
      state.priority = '';
      state.sortBy = 'createdAt';
      state.sortOrder = 'desc';
      state.page = 1;
      // intentionally keep pageSize so the user's choice is preserved
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
        state.tasks = action.payload.tasks;
        state.totalTasks = action.payload.pagination.totalTasks;
        state.totalPages = action.payload.pagination.totalPages;
        state.page = action.payload.pagination.currentPage;
        state.pageSize = action.payload.pagination.pageSize;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createTask — no optimistic update; Dashboard re-fetches after success
    builder
      .addCase(createTask.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // updateTask — no optimistic update; Dashboard re-fetches after success
    builder
      .addCase(updateTask.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

    // deleteTask — no optimistic update; Dashboard re-fetches after success
    builder
      .addCase(deleteTask.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearTaskError,
  setSearch,
  setStatus,
  setPriority,
  setSortBy,
  setSortOrder,
  setPage,
  setPageSize,
  resetFilters,
} = taskSlice.actions;

export default taskSlice.reducer;
