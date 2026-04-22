import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';

interface PaymentSettings {
  id?: number;
  paymentMode?: string;
  upiId?: string;
  qrCodePath?: string;
}

const PaymentSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PaymentSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [qrFile, setQrFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get<PaymentSettings>('/payment-settings');
        setSettings(res.data);
      } catch (e) {
        console.error(e);
        setMessage({ type: 'error', text: 'Failed to load settings' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (qrFile) {
        const formData = new FormData();
        formData.append('paymentMode', 'BOTH');
        formData.append('upiId', settings.upiId || '');
        formData.append('qrFile', qrFile);
        await api.post('/payment-settings/upload-qr', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.put('/payment-settings', { ...settings, paymentMode: 'BOTH' });
      }
      setMessage({ type: 'success', text: 'Payment settings saved!' });
      setQrFile(null);
      const res = await api.get<PaymentSettings>('/payment-settings');
      setSettings(res.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setMessage({ type: 'error', text: e.response?.data?.message || 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Payment Settings</h1>
      <p className="text-gray-600 mb-6">
        Configure how tenants pay rent. Tenants will see your UPI ID or QR code when they choose
        PhonePe, Google Pay, or Amazon Pay.
      </p>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID or Phone number
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow"
              placeholder="e.g. 9876543210@paytm or 9876543210"
              value={settings.upiId || ''}
              onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload QR code scanner image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-600 hover:file:bg-brand-100 transition-all cursor-pointer"
              onChange={(e) => setQrFile(e.target.files?.[0] || null)}
            />
            {settings.qrCodePath && !qrFile && (
              <div className="mt-4 p-4 border border-blue-100 bg-blue-50/50 rounded-xl max-w-xs">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Current QR Code</p>
                <img src={settings.qrCodePath} alt="Current QR Code" className="w-full aspect-square object-contain rounded-lg border border-gray-200 bg-white" />
              </div>
            )}
          </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default PaymentSettingsPage;
