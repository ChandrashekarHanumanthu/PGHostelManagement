import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';

interface Payment {
  id: number;
  tenantId: number;
  tenantName?: string;
  month: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  joinDate?: string;
  paymentDate?: string;
}

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Generate month options
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Generate year options (current year and 3 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);

  useEffect(() => {
    // Set current month and year as default
    const today = new Date();
    const defaultMonth = String(today.getMonth() + 1).padStart(2, '0');
    const defaultYear = today.getFullYear().toString();
    setSelectedMonth(defaultMonth);
    setSelectedYear(defaultYear);
  }, []);

  // Combine month and year to form month parameter
  const month = selectedYear && selectedMonth ? `${selectedYear}-${selectedMonth}` : '';

  useEffect(() => {
    const fetchPayments = async () => {
      if (!month) return;
      setLoading(true);
      setMessage(null);
      try {
        // Fetch all payments for month (regardless of status)
        const res = await api.get<Payment[]>(`/payments?month=${month}`);
        setPayments(res.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setMessage({ type: 'error', text: 'Failed to fetch payments' });
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [month]);

  const handleApprovePayment = async (paymentId: number) => {
    setProcessingId(paymentId);
    try {
      await api.put(`/payments/${paymentId}/approve`);
      setMessage({ type: 'success', text: 'Payment approved successfully!' });
      // Refresh all payments after approval
      const res = await api.get<Payment[]>(`/payments?month=${month}`);
      setPayments(res.data);
    } catch (error) {
      console.error('Error approving payment:', error);
      setMessage({ type: 'error', text: 'Failed to approve payment' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkPaid = async (paymentId: number) => {
    setProcessingId(paymentId);
    try {
      await api.put(`/payments/${paymentId}/mark-paid`);
      setMessage({ type: 'success', text: 'Payment marked as paid!' });
      // Refresh all payments after marking as paid
      const res = await api.get<Payment[]>(`/payments?month=${month}`);
      setPayments(res.data);
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      setMessage({ type: 'error', text: 'Failed to mark payment as paid' });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800 border-green-200';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return '✅';
      case 'SUBMITTED': return '📤';
      case 'PENDING': return '⏰';
      default: return '❓';
    }
  };

  const formatMonth = (monthStr: string) => {
    try {
      const [y, m] = monthStr.split('-').map(Number);
      const d = new Date(y, m - 1, 1);
      return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    } catch {
      return monthStr;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'PHONEPE': return '📱';
      case 'GOOGLE_PAY': return '💳';
      case 'AMAZON_PAY': return '🛒';
      case 'PAYTM': return '💰';
      case 'Cash': return '💵';
      default: return '❓';
    }
  };

  const stats = {
    total: payments.length,
    paid: payments.filter(p => p.status === 'PAID').length,
    submitted: payments.filter(p => p.status === 'SUBMITTED').length,
    pending: payments.filter(p => p.status === 'PENDING').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Management</h1>
              <p className="text-indigo-100">Monitor and manage all tenant payments efficiently</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-100">{stats.total}</div>
              <div className="text-sm text-indigo-200">Total Payments</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <span className="text-2xl">
              {message.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-gray-100 rounded-full p-3">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
                <div className="text-sm text-gray-600">Paid</div>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
                <div className="text-sm text-gray-600">Submitted</div>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <span className="text-2xl">📤</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-600">{formatCurrency(stats.totalAmount)}</div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Payments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Payments for {formatMonth(month)}
            </h2>
            <div className="text-sm text-gray-500">
              {payments.length} payment{payments.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <div className="text-gray-600">Loading payments...</div>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💳</div>
              <div className="text-xl font-medium text-gray-900 mb-2">No payments found</div>
              <div className="text-gray-600">No payments recorded for this month</div>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-indigo-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-indigo-100 rounded-full p-2">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {payment.tenantName || `Tenant ${payment.tenantId}`}
                          </div>
                          <div className="text-sm text-gray-500">Tenant ID: {payment.tenantId}</div>
                        </div>
                      </div>
                      

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Payment Date</div>
                          <div className="font-medium text-gray-900">
                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-IN') : '-'}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Month</div>
                          <div className="font-medium text-gray-900">{formatMonth(payment.month)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Amount</div>
                          <div className="font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Method</div>
                          <div className="font-medium text-gray-900 flex items-center space-x-1">
                            <span>{getPaymentMethodIcon(payment.paymentMethod)}</span>
                            <span>{payment.paymentMethod || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(payment.status)}`}>
                        <span>{getStatusIcon(payment.status)}</span>
                        <span>{payment.status}</span>
                      </div>
                      

                      <div className="flex space-x-2">
                        {payment.status === 'SUBMITTED' && (
                          <button
                            onClick={() => handleApprovePayment(payment.id)}
                            disabled={processingId === payment.id}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                          >
                            {processingId === payment.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Approving...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Approve</span>
                              </>
                            )}
                          </button>
                        )}
                        
                        {payment.status === 'PENDING' && payment.paymentMethod === 'Cash' && (
                          <button
                            onClick={() => handleMarkPaid(payment.id)}
                            disabled={processingId === payment.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                          >
                            {processingId === payment.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Mark Paid</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
