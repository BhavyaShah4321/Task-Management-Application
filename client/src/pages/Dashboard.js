import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Typography,
  Button,
  Tag,
  Modal,
  Space,
  Empty,
  Spin,
  message,
  Input,
  Select,
  Flex,
} from 'antd';
import {
  PlusOutlined,
  LogoutOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { logout } from '../redux/slices/authSlice';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  clearTaskError,
  setSearch,
  setStatus,
  setPriority,
  setSortBy,
  setSortOrder,
  setPage,
  setPageSize,
  resetFilters,
} from '../redux/slices/taskSlice';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const {
    tasks,
    loading,
    actionLoading,
    error,
    search,
    status,
    priority,
    sortBy,
    sortOrder,
    page,
    pageSize,
    totalTasks,
  } = useSelector((state) => state.tasks);

  const [modalOpen, setModalOpen]   = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Local value for the search input so the user can type freely
  // without triggering a fetch on every keystroke.
  const [searchInput, setSearchInput] = useState(search);

  // Build params object from current Redux filter state
  const buildParams = useCallback(
    () => ({
      page,
      limit: pageSize,
      ...(search   && { search }),
      ...(status   && { status }),
      ...(priority && { priority }),
      sortBy,
      sortOrder,
    }),
    [page, pageSize, search, status, priority, sortBy, sortOrder]
  );

  // Re-fetch whenever any filter/sort/pagination value changes
  useEffect(() => {
    dispatch(fetchTasks(buildParams()));
  }, [dispatch, buildParams]);

  // Show API errors as a toast
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearTaskError());
    }
  }, [error, dispatch]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  // After a mutation, decide which page to re-fetch.
  // If deleting reduces totalPages we move back one page.
  const refetchAfterMutation = (deletedOne = false) => {
    let targetPage = page;
    if (deletedOne && tasks.length === 1 && page > 1) {
      targetPage = page - 1;
      dispatch(setPage(targetPage));
    }
    dispatch(fetchTasks({ ...buildParams(), page: targetPage }));
  };

  // ── Auth ──────────────────────────────────────────────────────────────────

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  // ── Search ────────────────────────────────────────────────────────────────

  const handleSearch = (value) => {
    dispatch(setSearch(value.trim()));
  };

  // ── Filter / sort ─────────────────────────────────────────────────────────

  const handleStatusChange = (value) => dispatch(setStatus(value));
  const handlePriorityChange = (value) => dispatch(setPriority(value));
  const handleSortByChange = (value) => dispatch(setSortBy(value));
  const handleSortOrderChange = (value) => dispatch(setSortOrder(value));

  const handleReset = () => {
    setSearchInput('');
    dispatch(resetFilters());
  };

  // ── Pagination ────────────────────────────────────────────────────────────

  const handlePageChange = (newPage, newPageSize) => {
    if (newPageSize !== pageSize) {
      // Page size changed — setPageSize already resets page to 1
      dispatch(setPageSize(newPageSize));
    } else {
      dispatch(setPage(newPage));
    }
  };

  // ── Modal ─────────────────────────────────────────────────────────────────

  const openCreateModal = () => { setEditingTask(null); setModalOpen(true); };
  const openEditModal   = (task) => { setEditingTask(task); setModalOpen(true); };
  const closeModal      = () => { setModalOpen(false); setEditingTask(null); };

  // ── CRUD handlers ─────────────────────────────────────────────────────────

  const handleFormSubmit = async (data) => {
    if (editingTask) {
      const result = await dispatch(updateTask({ id: editingTask._id, data }));
      if (updateTask.fulfilled.match(result)) {
        message.success('Task updated successfully');
        closeModal();
        refetchAfterMutation(false);
      }
    } else {
      const result = await dispatch(createTask(data));
      if (createTask.fulfilled.match(result)) {
        message.success('Task created successfully');
        closeModal();
        // Go to page 1 so the new task is visible when sorted by createdAt desc
        dispatch(setPage(1));
        dispatch(fetchTasks({ ...buildParams(), page: 1 }));
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) {
      message.success('Task deleted successfully');
      refetchAfterMutation(true);
    }
  };

  const handleMarkCompleted = async (task) => {
    const result = await dispatch(
      updateTask({ id: task._id, data: { status: 'Completed' } })
    );
    if (updateTask.fulfilled.match(result)) {
      message.success('Task marked as completed');
      refetchAfterMutation(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <Header
        style={{
          background: '#ffffff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Title level={4} style={{ margin: 0 }}>Task Manager</Title>
        <Space>
          <Text>
            {user?.name}&nbsp;
            <Tag color="blue" style={{ textTransform: 'capitalize' }}>
              {user?.role}
            </Tag>
          </Text>
          <Button icon={<LogoutOutlined />} onClick={handleLogout} danger>
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px' }}>
        {/* Toolbar — title + create button */}
        <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0 }}>
            My Tasks ({totalTasks})
          </Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Create Task
          </Button>
        </Flex>

        {/* Filter bar */}
        <Flex wrap gap="small" style={{ marginBottom: 16 }}>
          {/* Search */}
          <Input.Search
            placeholder="Search tasks by title"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={handleSearch}
            enterButton={<SearchOutlined />}
            allowClear
            onClear={() => { setSearchInput(''); dispatch(setSearch('')); }}
            style={{ width: 260 }}
          />

          {/* Status */}
          <Select
            value={status || undefined}
            placeholder="All Status"
            onChange={handleStatusChange}
            allowClear
            onClear={() => handleStatusChange('')}
            style={{ width: 140 }}
          >
            <Option value="Pending">Pending</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
          </Select>

          {/* Priority */}
          <Select
            value={priority || undefined}
            placeholder="All Priority"
            onChange={handlePriorityChange}
            allowClear
            onClear={() => handlePriorityChange('')}
            style={{ width: 140 }}
          >
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>

          {/* Sort by */}
          <Select
            value={sortBy}
            onChange={handleSortByChange}
            style={{ width: 150 }}
          >
            <Option value="createdAt">Created Date</Option>
            <Option value="dueDate">Due Date</Option>
            <Option value="priority">Priority</Option>
          </Select>

          {/* Sort order */}
          <Select
            value={sortOrder}
            onChange={handleSortOrderChange}
            style={{ width: 130 }}
          >
            <Option value="desc">Descending</Option>
            <Option value="asc">Ascending</Option>
          </Select>

          {/* Reset */}
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
        </Flex>

        {/* Task list / empty / loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Spin size="large" />
          </div>
        ) : tasks.length === 0 ? (
          <Empty description="No tasks found" style={{ padding: '48px 0' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Create your first task
            </Button>
          </Empty>
        ) : (
          <TaskList
            tasks={tasks}
            actionLoading={actionLoading}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onMarkCompleted={handleMarkCompleted}
            page={page}
            pageSize={pageSize}
            totalTasks={totalTasks}
            onPageChange={handlePageChange}
          />
        )}
      </Content>

      {/* Create / Edit modal */}
      <Modal
        title={editingTask ? 'Edit Task' : 'Create Task'}
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        width={560}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          loading={actionLoading}
        />
      </Modal>
    </Layout>
  );
};

export default Dashboard;
