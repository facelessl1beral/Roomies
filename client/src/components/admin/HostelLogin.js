import React, { useState } from 'react';
import axios from 'axios';

const HostelLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/hostels/login', formData);
      localStorage.setItem('hostelToken', res.data.token);
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Hostel Admin Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Hostel Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              className="form-control"
              placeholder="e.g. Pearl Hostel"
              required
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={onChange}
              className="form-control"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: 0.6, fontSize: '0.85rem' }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
          </div>
          <button type="submit" className="btn btn-primary mt-4 w-100">Login</button>
        </form>
        <p className="mt-3 text-center" style={{ fontSize: '0.85rem', opacity: 0.6 }}>
          No account? Contact the Homies admin to register your hostel.
        </p>
      </div>
    </div>
  );
};

export default HostelLogin;
