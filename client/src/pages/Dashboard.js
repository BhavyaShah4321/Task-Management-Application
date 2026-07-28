import React, { useEffect, useState } from 'react';
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
} from 'antd';
import { PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from '../redux/slices/authSlice';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  clearTaskError,
} from '../redux/slices/taskSlice';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { tasks, loading, actionLoading, error } = useSelector((state) => state.tasks);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null = create mode

  // Load tasks when dashboard mounts
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Show API errors as a toast
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearTaskError());
    }
  }, [error, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleFormSubmit = async (data) => {
    if (editingTask) {
      const result = await dispatch(updateTask({ id: editingTask._id, data }));
      if (updateTask.fulfilled.match(result)) {
        message.success('Task updated successfully');
        closeModal();
      }
    } else {
      const result = await dispatch(createTask(data));
      if (createTask.fulfilled.match(result)) {
        message.success('Task created successfully');
        closeModal();
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteTask(id));
    if (deleteTask.fulfilled.match(result)) {
      message.success('Task deleted successfully');
    }
  };

  const handleMarkCompleted = async (task) => {
    const result = await dispatch(
      updateTask({ id: task._id, data: { status: 'Completed' } })
    );
    if (updateTask.fulfilled.match(result)) {
      message.success('Task marked as completed');
    }
  };

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
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Task Manager
          </Title>
        </Space>

        <Space>
          <Text>
            {user?.name}&nbsp;
            <Tag color="blue" style={{ textTransform: 'capitalize' }}>
              {user?.role}
            </Tag>
          </Text>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            danger
          >
            Logout
          </Button>
        </Space>
      </Header>

      {/* Main content */}
      <Content style={{ padding: '24px' }}>
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            My Tasks ({tasks.length})
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openCreateModal}
          >
            Create Task
          </Button>
        </div>

        {/* Task list area */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Spin size="large" />
          </div>
        ) : tasks.length === 0 ? (
          <Empty
            description="No tasks yet"
            style={{ padding: '48px 0' }}
          >
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
