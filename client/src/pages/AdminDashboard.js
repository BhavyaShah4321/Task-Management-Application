import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Typography,
  Button,
  Card,
  Statistic,
  Row,
  Col,
  Alert,
  Space,
  Table,
  Input,
  Select,
  Empty,
  Tooltip,
  theme,
  Skeleton,
} from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  fetchAdminStats,
  fetchAdminUsers,
  fetchAdminTasks,
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
} from '../redux/slices/adminSlice';
import AppHeader from '../components/AppHeader';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const { user } = useSelector((state) => state.auth);
  const {
    stats,
    users,
    tasks,
    loading,
    tasksLoading,
    error,
    search,
    status,
    priority,
    userId,
    sortBy,
    sortOrder,
    page,
    pageSize,
    totalTasks,
  } = useSelector((state) => state.admin);

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const buildParams = useCallback(
    () => ({
      page,
      limit: pageSize,
      ...(search && { search }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(userId && { userId }),
      sortBy,
      sortOrder,
    }),
    [page, pageSize, search, status, priority, userId, sortBy, sortOrder]
  );

  useEffect(() => {
    dispatch(fetchAdminTasks(buildParams()));
  }, [dispatch, buildParams]);

  useEffect(() => {
    if (error) {
      dispatch(clearAdminError());
    }
  }, [error, dispatch]);

  const handleSearch = (value) => {
    dispatch(setAdminSearch(value.trim()));
  };

  const handleStatusChange = (value) => dispatch(setAdminStatus(value));
  const handlePriorityChange = (value) => dispatch(setAdminPriority(value));
  const handleUserChange = (value) => dispatch(setAdminUser(value));
  const handleSortByChange = (value) => dispatch(setAdminSortBy(value));
  const handleSortOrderChange = (value) => dispatch(setAdminSortOrder(value));

  const handleReset = () => {
    setSearchInput('');
    dispatch(resetAdminFilters());
  };

  const handlePageChange = (newPage, newPageSize) => {
    if (newPageSize !== pageSize) {
      dispatch(setAdminPageSize(newPageSize));
    } else {
      dispatch(setAdminPage(newPage));
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text} overlayStyle={{ maxWidth: '300px' }}>
          <Text ellipsis style={{ maxWidth: '200px' }}>
            {text || '-'}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <Space direction="vertical" size={0}>
          <Text>{user?.name || 'Unknown'}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {user?.email || ''}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString('en-CA'),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => new Date(date).toLocaleDateString('en-CA'),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <AppHeader user={user} />

      <Content style={{ padding: '24px' }}>
        <Title level={5} style={{ marginBottom: 24 }}>
          Welcome, {user?.name} (Admin)
        </Title>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
            closable
            onClose={() => dispatch(clearAdminError())}
          />
        )}

        {loading ? (
          <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
          </Row>
        ) : stats ? (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
              <Col xs={24} sm={12} lg={8}>
                <Card>
                  <Statistic
                    title="Total Users"
                    value={stats.totalUsers}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card>
                  <Statistic
                    title="Total Tasks"
                    value={stats.totalTasks}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card>
                  <Statistic
                    title="Pending Tasks"
                    value={stats.pendingTasks}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card>
                  <Statistic
                    title="In Progress Tasks"
                    value={stats.inProgressTasks}
                    prefix={<SyncOutlined />}
                    valueStyle={{ color: '#13c2c2' }}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <Card>
                  <Statistic
                    title="Completed Tasks"
                    value={stats.completedTasks}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card
              title="User Tasks"
              extra={
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/tasks/create')}>
                  Create Task
                </Button>
              }
              style={{ marginBottom: 16 }}
            >
              <Space wrap style={{ marginBottom: 16 }}>
                <Input.Search
                  placeholder="Search tasks by title"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onSearch={handleSearch}
                  enterButton={<SearchOutlined />}
                  allowClear
                  onClear={() => { setSearchInput(''); dispatch(setAdminSearch('')); }}
                  style={{ width: 260 }}
                />

                <Select
                  value={userId || undefined}
                  placeholder="All Users"
                  onChange={handleUserChange}
                  allowClear
                  onClear={() => handleUserChange('')}
                  style={{ width: 180 }}
                >
                  {users.map((u) => (
                    <Option key={u._id} value={u._id}>
                      {u.name}
                    </Option>
                  ))}
                </Select>

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

                <Select
                  value={sortBy}
                  onChange={handleSortByChange}
                  style={{ width: 150 }}
                >
                  <Option value="createdAt">Created Date</Option>
                  <Option value="dueDate">Due Date</Option>
                  <Option value="priority">Priority</Option>
                </Select>

                <Select
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  style={{ width: 130 }}
                >
                  <Option value="desc">Descending</Option>
                  <Option value="asc">Ascending</Option>
                </Select>

                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  Reset
                </Button>
              </Space>

              {tasksLoading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
              ) : tasks.length === 0 ? (
                <Empty description="No tasks found" style={{ padding: '48px 0' }} />
              ) : (
                <Table
                  columns={columns}
                  dataSource={tasks}
                  rowKey="_id"
                  pagination={{
                    current: page,
                    pageSize,
                    total: totalTasks,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    onChange: handlePageChange,
                  }}
                />
              )}
            </Card>
          </>
        ) : null}
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
