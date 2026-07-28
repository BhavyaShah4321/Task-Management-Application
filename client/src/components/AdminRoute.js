import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spin, Result, Button } from 'antd';

const AdminRoute = ({ children }) => {
  const { token, user, initializing } = useSelector((state) => state.auth);

  if (initializing) {
    return (
      <div style={spinStyle}>
        <Spin size="large" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <Result
        status="403"
        title="403"
        subTitle="You do not have permission to access this page."
        extra={
          <Button type="primary" onClick={() => window.location.href = '/dashboard'}>
            Back to Dashboard
          </Button>
        }
      />
    );
  }

  return children;
};

const spinStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default AdminRoute;
