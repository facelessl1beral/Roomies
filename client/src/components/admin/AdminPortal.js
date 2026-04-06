import React, { useState } from 'react';
import HostelLogin from './HostelLogin';
import AdminDashboard from './AdminDashboard';

const AdminPortal = () => {
  const [token, setToken] = useState(localStorage.getItem('hostelToken') || null);
  const [hostelName, setHostelName] = useState(localStorage.getItem('hostelName') || '');

  const handleLogin = (t, name) => {
    setToken(t);
    setHostelName(name);
    localStorage.setItem('hostelName', name);
  };

  const handleLogout = () => {
    localStorage.removeItem('hostelToken');
    localStorage.removeItem('hostelName');
    setToken(null);
    setHostelName('');
  };

  return token
    ? (
      <div>
        <div style={{ padding: '12px 0', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 600, fontSize: '1rem' }}>{hostelName || 'Hostel'} Admin</span>
          <button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'none', border: '1px solid #ccc', borderRadius: '8px', padding: '6px 16px', cursor: 'pointer', fontSize: '0.85rem' }}>Logout</button>
        </div>
        <AdminDashboard token={token} />
      </div>
    )
    : <HostelLogin onLogin={handleLogin} />;
};

export default AdminPortal;
