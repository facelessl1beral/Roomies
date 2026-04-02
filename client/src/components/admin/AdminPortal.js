import React, { useState } from 'react';
import HostelLogin from './HostelLogin';
import AdminDashboard from './AdminDashboard';

const AdminPortal = () => {
  const [token, setToken] = useState(localStorage.getItem('hostelToken') || null);

  const handleLogin = (t) => setToken(t);
  const handleLogout = () => {
    localStorage.removeItem('hostelToken');
    setToken(null);
  };

  return token
    ? <AdminDashboard token={token} onLogout={handleLogout} />
    : <HostelLogin onLogin={handleLogin} />;
};

export default AdminPortal;
