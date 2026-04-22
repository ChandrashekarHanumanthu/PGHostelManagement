import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

interface Payment {
  id: number;
  month: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  type?: string; // RENT, MAINTENANCE_FEE
}

interface Room {
  roomNumber: string;
  roomType: string;
  rentAmount: number;
}

interface PaymentSettings {
  id?: number;
  paymentMode?: string;
  upiId?: string;
  qrCodePath?: string;
}

const TenantPaymentsPage: React.FC = () => {
  const { userId } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const [dashboardRes, settingsRes] = await Promise.all([
          api.get<{ room: Room; payments: Payment[] }>(`/dashboard/tenant/${userId}`),
          api.get<PaymentSettings>('/payment-settings'),
        ]);
        setRoom(dashboardRes.data.room);
        setPayments(dashboardRes.data.payments);
        setPaymentSettings(settingsRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setMessage({ type: 'error', text: 'Failed to load data' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const pendingPayment = payments.find(p => p.status === 'PENDING');

  const formatMonth = (monthStr: string) => {
    try {
      const [y, m] = monthStr.split('-').map(Number);
      const d = new Date(y, m - 1, 1);
      return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    } catch {
      return monthStr;
    }
  };

  const handleUpiPayment = () => {
    if (!paymentSettings?.upiId || !pendingPayment) return;
    
    const upiId = paymentSettings.upiId;
    const amount = pendingPayment.amount;
    const description = `Rent for ${formatMonth(pendingPayment.month)}`;
    
    // Universal UPI intent URL - opens an OS-level selection sheet on phones
    const upiUrl = `upi://pay?pa=${upiId}&pn=Hostel%20Owner&am=${amount}&cu=INR&tn=${description}`;
    
    // Try to open the UPI URL
    try {
      window.location.href = upiUrl;
    } catch (error) {
      console.error('UPI Deep-link failed to load', error);
    }
    
    // Mark payment as submitted after opening payment app
    setTimeout(() => {
      submitPayment('UPI_ONLINE');
    }, 3000);
  };

  const handleSubmitPayment = async (method: string) => {
    if (!userId || !pendingPayment) return;
    
    // For universal UPI payment, trigger the intent
    if (method === 'UPI_ONLINE') {
      handleUpiPayment();
      return;
    }
    
    // For Cash, use existing flow
    await submitPayment(method);
  };

  const submitPayment = async (method: string) => {
    if (!pendingPayment) return;
    
    const ids = [pendingPayment.id];
    if (!userId || ids.length === 0) return;
    setSubmitting(true);
    setMessage(null);
    try {
      for (const id of ids) {
        const url = `/tenants/${userId}/payments/${id}/submit?paymentMethod=${method}`;
        await api.post(url);
      }
      setMessage({ type: 'success', text: 'Payment submitted successfully! Awaiting owner approval.' });
      const dashboardRes = await api.get<{ payments: Payment[] }>(`/dashboard/tenant/${userId}`);
      setPayments(dashboardRes.data.payments);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setMessage({ type: 'error', text: e.response?.data?.message || 'Failed to submit payment' });
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading payment details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Rent Payments</h1>
              <p className="text-green-100">Manage your rent payments conveniently</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-100">
                {payments.filter(p => p.status === 'PAID').length}
              </div>
              <div className="text-sm text-green-200">Payments Completed</div>
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

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {payments.filter(p => p.status === 'PAID').length}
                </div>
                <div className="text-sm text-gray-600">Paid</div>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {payments.filter(p => p.status === 'SUBMITTED').length}
                </div>
                <div className="text-sm text-gray-600">Pending Approval</div>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <span className="text-2xl">📤</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {payments.filter(p => p.status === 'PENDING').length}
                </div>
                <div className="text-sm text-gray-600">Unpaid</div>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <span className="text-2xl">⏰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Payment Section */}
        {pendingPayment && room && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Pay Rent – {formatMonth(pendingPayment.month)}</h2>
                <p className="text-gray-600">Room {room.roomNumber} • {room.roomType}</p>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Room Rent:</span>
                  <span className="font-medium text-gray-900">₹{room.rentAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Maintenance Fee:</span>
                  <span className="font-medium text-gray-900">₹{pendingPayment.amount - room.rentAmount}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">₹{pendingPayment.amount}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleSubmitPayment('UPI_ONLINE')}
                  disabled={submitting || !paymentSettings?.upiId}
                  className="bg-brand-500 hover:bg-brand-600 border border-brand-400 rounded-xl p-6 text-white text-left transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_-4px_rgba(99,102,241,0.4)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <span className="block text-xl font-bold tracking-tight mb-0.5">Pay via Mobile Apps</span>
                      <span className="block text-sm text-brand-100 font-medium whitespace-pre-wrap">Automatically opens PhonePe, GPay, Paytm, etc.</span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSubmitPayment('Cash')}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all duration-200 transform text-left hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <span className="font-bold text-2xl">💵</span>
                    </div>
                    <div>
                      <span className="block text-xl font-bold text-slate-900 tracking-tight mb-0.5">Pay in Cash</span>
                      <span className="block text-sm text-gray-500 font-medium whitespace-pre-wrap">Notify admin that you will hand over cash</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* UPI Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">📱</span>
                  <span className="text-sm font-medium text-blue-800">Payment Information</span>
                </div>
                <p className="text-sm text-blue-700 mb-2">
                  Click 'Pay via Mobile Apps' on any phone or tablet device to automatically open a payment sheet. You will be able to choose between PhonePe, GPay, Paytm, or any other UPI app natively installed on your device.
                </p>
                {paymentSettings?.upiId && (
                  <div className="bg-white rounded-lg p-3 border border-blue-300">
                    <p className="text-sm text-blue-600">
                      <strong>Target UPI ID:</strong> {paymentSettings.upiId}
                    </p>
                  </div>
                )}
                {!paymentSettings?.upiId && !paymentSettings?.qrCodePath && (
                  <p className="text-sm text-red-600">
                    ⚠️ UPI ID or Scanner not configured by admin. Please contact admin.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
            <div className="text-sm text-gray-500">
              Total: {payments.length} payments
            </div>
          </div>

          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-green-300">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{formatMonth(payment.month)}</div>
                          <div className="text-sm text-gray-500">Rent payment</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900 mb-2">₹{payment.amount}</div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(payment.status)}`}>
                        <span>{getStatusIcon(payment.status)}</span>
                        <span>{payment.status}</span>
                      </div>
                      {payment.paymentMethod && (
                        <div className="text-xs text-gray-500 mt-2">
                          Method: {payment.paymentMethod}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💳</div>
              <div className="text-xl font-medium text-gray-900 mb-2">No payment history</div>
              <div className="text-gray-600">Your payment history will appear here</div>
            </div>
          )}
        </div>

        {/* All Paid Message */}
        {!pendingPayment && payments.length > 0 && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <div className="text-lg font-semibold text-green-800 mb-2">All Payments Completed!</div>
            <div className="text-green-600">You have no pending rent. All dues are paid.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantPaymentsPage;
