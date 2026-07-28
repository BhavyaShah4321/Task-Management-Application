import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Typography, Button, Tag, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { logout } from '../redux/slices/authSlice';

const { Header } = Layout;
const { Title, Text } = Typography;

const AppHeader = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const isAdminDashboard = location.pathname === '/admin';
  const isAdminCreateTask = location.pathname === '/admin/tasks/create';
  const isAdmin = user?.role === 'admin';

  return (
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
      <Space wrap>
        <Text>
          {user?.name}&nbsp;
          <Tag color="blue" style={{ textTransform: 'capitalize' }}>
            {user?.role}
          </Tag>
        </Text>
        {isAdmin && (
          <>
            <Button
              type={isAdminDashboard ? 'primary' : 'default'}
              onClick={() => navigate('/admin')}
            >
              Admin Dashboard
            </Button>
            <Button
              type={isAdminCreateTask ? 'primary' : 'default'}
              onClick={() => navigate('/admin/tasks/create')}
            >
              Create Task
            </Button>
          </>
        )}
        <Button icon={<LogoutOutlined />} onClick={handleLogout} danger>
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default AppHeader;
