import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';

const ProtectedRoute = ({ children }) => {
  const { token, user, initializing } = useSelector((state) => state.auth);

  // While the app is verifying an existing token, show a spinner.
  // This prevents a flash-redirect to /login for users who are actually logged in.
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

  return children;
};

const spinStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default ProtectedRoute;
