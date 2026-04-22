import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import { Building2 } from 'lucide-react';

const LoginPage: React.FC = () => {
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
      login(res.data);
      if (res.data.role === 'ADMIN' || res.data.role === 'OWNER') {
        navigate('/admin/dashboard');
      } else {
        navigate('/tenant/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white border border-gray-200 rounded-xl px-8 pt-6 pb-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-2 text-center text-gray-900" style={{fontFamily: 'santhoshi, sans-serif'}}>Welcome back</h2>
        <p className="text-gray-600 text-center mb-6">Sign in to your PG Manager account</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" style={{fontFamily: 'santhoshi, sans-serif'}}>Email</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" style={{fontFamily: 'santhoshi, sans-serif'}}>Password</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Sign in
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
              Forgot your password?
            </Link>
          </p>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-3">
              New to PG Manager?
            </p>
            <Link
              to="/hostel-signup"
              className="block w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Try for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

