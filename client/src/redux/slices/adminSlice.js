import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAdminStats();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch admin statistics'
      );
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchAdminUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAdminUsers();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch users'
      );
    }
  }
);

export const fetchAdminTasks = createAsyncThunk(
  'admin/fetchAdminTasks',
  async (params, { rejectWithValue }) => {
    try {
      return await adminService.getAdminTasks(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks'
      );
    }
  }
);

export const assignTask = createAsyncThunk(
  'admin/assignTask',
  async (data, { rejectWithValue }) => {
    try {
      return await adminService.assignTask(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to assign task'
      );
    }
  }
);

const initialState = {
  stats: null,
  users: [],
  tasks: [],
  loading: false,
  usersLoading: false,
  tasksLoading: false,
  actionLoading: false,
  error: null,
  search: '',
  status: '',
  priority: '',
  userId: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  pageSize: 10,
  totalTasks: 0,
  totalPages: 0,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    setAdminSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
    setAdminStatus: (state, action) => {
      state.status = action.payload;
      state.page = 1;
    },
    setAdminPriority: (state, action) => {
      state.priority = action.payload;
      state.page = 1;
    },
    setAdminUser: (state, action) => {
      state.userId = action.payload;
      state.page = 1;
    },
    setAdminSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setAdminSortOrder: (state, action) => {
      state.sortOrder = action.payload;
      state.page = 1;
    },
    setAdminPage: (state, action) => {
      state.page = action.payload;
    },
    setAdminPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    resetAdminFilters: (state) => {
      state.search = '';
      state.status = '';
      state.priority = '';
      state.userId = '';
      state.sortBy = 'createdAt';
      state.sortOrder = 'desc';
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminTasks.pending, (state) => {
        state.tasksLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminTasks.fulfilled, (state, action) => {
        state.tasksLoading = false;
        state.tasks = action.payload.tasks;
        state.totalTasks = action.payload.pagination.totalTasks;
        state.totalPages = action.payload.pagination.totalPages;
        state.page = action.payload.pagination.currentPage;
        state.pageSize = action.payload.pagination.pageSize;
      })
      .addCase(fetchAdminTasks.rejected, (state, action) => {
        state.tasksLoading = false;
        state.error = action.payload;
      })
      .addCase(assignTask.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(assignTask.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAdminError,
  setAdminSearch,
  setAdminStatus,
  setAdminPriority,
  setAdminUser,
  setAdminSortBy,
  setAdminSortOrder,
  setAdminPage,
  setAdminPageSize,
  resetAdminFilters,
} = adminSlice.actions;

export default adminSlice.reducer;
