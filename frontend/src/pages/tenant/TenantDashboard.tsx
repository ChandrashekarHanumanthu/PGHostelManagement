import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

interface Payment {
  id: number;
  month: string;
  amount: number;
  status: string;
}

interface Room {
  roomNumber: string;
  roomType: string;
  rentAmount: number;
}

interface Notice {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface TenantDashboardData {
  room: Room;
  payments: Payment[];
  openComplaints: number;
  notices: Notice[];
}

const TenantDashboard: React.FC = () => {
  const { userId, name } = useAuth();
  const [data, setData] = useState<TenantDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const res = await api.get<TenantDashboardData>(`/dashboard/tenant/${userId}`);
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return '✅';
      case 'PENDING': return '⏰';
      case 'SUBMITTED': return '📤';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {name}!</h1>
              <p className="text-blue-100">Here's what's happening in your hostel life</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Room Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-sm text-gray-500 font-medium">Your Room</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">{data?.room?.roomNumber || 'N/A'}</div>
              <div className="text-sm text-gray-600">{data?.room?.roomType || 'Standard'}</div>
              <div className="text-lg font-semibold text-blue-600">₹{data?.room?.rentAmount || 0}/month</div>
            </div>
          </div>

          {/* Complaints Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-full p-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-500 font-medium">Complaints</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">{data?.openComplaints || 0}</div>
              <div className="text-sm text-gray-600">Open complaints</div>
              {data?.openComplaints === 0 && (
                <div className="text-sm text-green-600 font-medium">All resolved! 🎉</div>
              )}
            </div>
          </div>

          {/* Recent Notices Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h10l5-5V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <span className="text-sm text-gray-500 font-medium">Notices</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">{data?.notices?.length || 0}</div>
              <div className="text-sm text-gray-600">New notices</div>
              {data?.notices && data.notices.length > 0 && (
                <div className="text-xs text-purple-600 font-medium">Stay updated!</div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment History */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {data?.payments?.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getStatusColor(payment.status)}`}>
                      {getPaymentStatusIcon(payment.status)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{payment.month}</div>
                      <div className="text-sm text-gray-500">Rent payment</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{payment.amount}</div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </div>
                  </div>
                </div>
              ))}
              {(!data?.payments || data.payments.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">💰</div>
                  <div>No payment records yet</div>
                </div>
              )}
            </div>
          </div>

          {/* Latest Notices */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Latest Notices</h2>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {data?.notices?.slice(0, 3).map((notice) => (
                <div key={notice.id} className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 rounded-full p-2 mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{notice.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">{notice.content}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!data?.notices || data.notices.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📢</div>
                  <div>No new notices</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-4 text-center transition-all duration-200 backdrop-blur-sm">
              <div className="text-2xl mb-2">💳</div>
              <div className="text-sm font-medium">Pay Rent</div>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-4 text-center transition-all duration-200 backdrop-blur-sm">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium">File Complaint</div>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-4 text-center transition-all duration-200 backdrop-blur-sm">
              <div className="text-2xl mb-2">👤</div>
              <div className="text-sm font-medium">My Profile</div>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-4 text-center transition-all duration-200 backdrop-blur-sm">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">Payment History</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;

