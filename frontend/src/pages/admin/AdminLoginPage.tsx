import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, token, role } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      if (role === 'ADMIN' || role === 'OWNER') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'TENANT') {
        navigate('/tenant/dashboard', { replace: true });
      }
    }
  }, [token, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.role === 'ADMIN' || res.data.role === 'OWNER') {
        login(res.data);
        navigate('/admin/dashboard');
      } else {
        setError('This login is for administrators and hostel owners only');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Admin Login
          </button>
        </form>
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an admin account?{' '}
            <Link to="/hostel-signup" className="text-blue-500 hover:text-blue-700">
              Sign up here
            </Link>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            <Link to="/login" className="text-blue-500 hover:text-blue-700">
              Tenant Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
