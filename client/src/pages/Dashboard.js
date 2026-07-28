import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Tag, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { logout } from '../redux/slices/authSlice';

const { Title, Text } = Typography;

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div style={pageStyle}>
      <Card style={cardStyle}>
        <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>
            Welcome, {user?.name}
          </Title>

          <div>
            <Text type="secondary">Role: </Text>
            <Tag color="blue" style={{ textTransform: 'capitalize' }}>
              {user?.role}
            </Tag>
          </div>

          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            size="large"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      </Card>
    </div>
  );
};

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f5f5f5',
  padding: '16px',
};

const cardStyle = {
  width: '100%',
  maxWidth: 480,
  boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
  padding: '16px',
};

export default Dashboard;
