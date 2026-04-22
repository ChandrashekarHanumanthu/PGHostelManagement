import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

interface LoginRequest {
  email: string;
  password: string;
}

const TenantLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [loginData, setLoginData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const response = await api.post('/auth/login', {
        email: loginData.email,
        password: loginData.password
      });
      
      // Use the same auth flow as the main Login page
      login(response.data);

      // Redirect to tenant dashboard (this route exists in App.tsx)
      navigate('/tenant/dashboard');
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      setError(backendMessage || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tenant Login</h1>
          <p className="text-gray-600 mt-2">
            Access your tenant dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Contact admin if you have trouble accessing your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TenantLoginPage;
