import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const getApiUrl = () => process.env.REACT_APP_API_BASE_URL || 'https://pghostelmanagement.onrender.com/api';

interface TenantData {
  name: string;
  email: string;
  phone: string;
}

interface SignupRequest {
  password: string;
  confirmPassword: string;
}

const TenantPasswordSetupPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get token from either URL param or query param
  const signupToken = token || searchParams.get('token') || '';
  
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [signupData, setSignupData] = useState<SignupRequest>({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (signupToken) {
      verifyToken();
    } else {
      setError('No signup token provided');
      setLoading(false);
    }
  }, [signupToken]);

  const verifyToken = async () => {
    try {
      setVerifying(true);
      const response = await axios.get(`${getApiUrl()}/tenant-signup/verify/${signupToken}`);
      
      if (response.data.valid) {
        setTokenValid(true);
        setTenantData(response.data.tenant);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError('Failed to verify signup token');
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setError(null);
      const response = await axios.post(`${getApiUrl()}/tenant-signup/complete/${signupToken}`, {
        password: signupData.password
      });
      
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/tenant-login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to complete signup');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying password setup link...</p>
        </div>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your password setup link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4" style={{fontFamily: 'santhoshi, sans-serif'}}>Invalid Password Setup Link</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-4">
              Please contact the admin if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900" style={{fontFamily: 'santhoshi, sans-serif'}}>Set Your Password</h1>
          <p className="text-gray-600 mt-2">
            Welcome <span className="font-semibold">{tenantData?.name}</span>!
          </p>
          <p className="text-sm text-gray-500">
            Email: {tenantData?.email} | Phone: {tenantData?.phone}
          </p>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Set Your Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              value={signupData.password}
              onChange={(e) => setSignupData({...signupData, password: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm your password"
              value={signupData.confirmPassword}
              onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Complete Registration
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            After setting your password, you can login to your tenant dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TenantPasswordSetupPage;
