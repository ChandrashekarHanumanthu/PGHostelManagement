import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosClient';
import { RoomType } from '../../types/RoomType';
import { 
  Settings,
  Plus,
  PencilLine,
  Trash2,
  Home,
  Users,
  DollarSign,
  Bed,
  Wifi,
  Wind,
  Tv,
  Car,
  Dumbbell,
  Coffee,
  Shield,
  CheckCircle,
  AlertCircle,
  X,
  Save,
  RefreshCw,
  Building2,
  DoorOpen,
  Calendar,
  Grid3x3,
  ArrowUpDown,
} from 'lucide-react';

interface RoomTypeConfig {
  id: number;
  hostelName: string;
  roomType: RoomType;
  capacity: number;
  rentAmount: number;
  maintenanceFeeAmount?: number;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  description?: string;
  amenities?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoomStats {
  configuredTypes: number;
  SINGLE?: {
    configured: number;
    generated: number;
    available: number;
    occupied: number;
    rent: number;
  };
  DOUBLE?: {
    configured: number;
    generated: number;
    available: number;
    occupied: number;
    rent: number;
  };
  SHARING?: {
    configured: number;
    generated: number;
    available: number;
    occupied: number;
    rent: number;
  };
}

const RoomSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<RoomTypeConfig[]>([]);
  const [stats, setStats] = useState<RoomStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<RoomTypeConfig | null>(null);

  const [formData, setFormData] = useState({
    hostelName: '',
    roomType: 'SINGLE' as RoomType,
    rentAmount: 0,
    maintenanceFeeAmount: 1000,
    totalRooms: 1,
    description: '',
    amenities: '',
    isActive: true
  });

  useEffect(() => {
    fetchConfigs();
    // Fetch stats lazily; backend endpoint may not exist in some envs
    fetchStats();
  }, []);

  const fetchConfigs = async () => {
    try {
      setError(null);
      const response = await api.get('/admin/room-settings');
      const data = response?.data;
      setConfigs(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setConfigs([]);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/room-settings/stats');
      setStats(response.data);
    } catch (err) {
      setStats(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Send amenities as string (comma-separated) as expected by backend
      // Include capacity based on room type
      const submissionData = {
        ...formData,
        capacity: getCapacityForRoomType(formData.roomType),
        amenities: formData.amenities
      };

      if (editingConfig) {
        await api.put(`/admin/room-settings/${editingConfig.id}`, submissionData);
        setSuccess('Room configuration updated successfully');
      } else {
        await api.post('/admin/room-settings', submissionData);
        setSuccess('Room configuration created successfully');
      }

      setShowForm(false);
      setEditingConfig(null);
      setFormData({
        hostelName: '',
        roomType: 'SINGLE',
        rentAmount: 0,
        maintenanceFeeAmount: 1000,
        totalRooms: 1,
        description: '',
        amenities: '',
        isActive: true
      });

      fetchStats();
      fetchConfigs();
    } catch (err: any) {
      let backendMessage = err.response?.data?.message || err.response?.data?.error;
      if (!backendMessage && err.response?.data && typeof err.response.data === 'object') {
        const validationErrors = Object.entries(err.response.data)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
        if (validationErrors) backendMessage = validationErrors;
      }
      if (!backendMessage && err.message) backendMessage = err.message;
      setError(backendMessage || 'Failed to save room configuration. Please verify backend connectivity and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: RoomTypeConfig) => {
    setEditingConfig(config);
    setFormData({
      hostelName: config.hostelName,
      roomType: config.roomType,
      rentAmount: config.rentAmount,
      maintenanceFeeAmount: config.maintenanceFeeAmount ?? 1000,
      totalRooms: config.totalRooms,
      description: config.description || '',
      amenities: config.amenities || '',
      isActive: config.isActive
    });
    setShowForm(true);
  };

  const handleDeleteConfig = async (configId: number) => {
    if (!window.confirm('Are you sure you want to delete this room configuration? This will also delete all generated rooms for this configuration. Note: Deletion will be blocked if tenants are allocated to rooms of this type.')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.delete(`/admin/room-settings/${configId}`);
      setSuccess('Room configuration deleted successfully');
      fetchConfigs();
      fetchStats();
    } catch (err: any) {
      const backendMsg = err.response?.data?.error || err.response?.data?.message;
      setError(backendMsg || 'Failed to delete room configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRooms = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await api.post('/admin/room-settings/generate-rooms');
      const message = response.data?.message || 'Rooms generated successfully';
      const totalRooms = response.data?.totalRoomsGenerated || 0;
      setSuccess(`${message} (${totalRooms} rooms)`);
      fetchStats();
    } catch (err: any) {
      const backendMessage = err.response?.data?.error || err.response?.data?.message;
      setError(backendMessage || 'Failed to generate rooms');
    } finally {
      setLoading(false);
    }
  };

  const roomTypeLabels: Record<RoomType, string> = {
    SINGLE: 'Single Sharing',
    DOUBLE: 'Double Sharing', 
    THREE: 'Three Sharing',
    FOUR: 'Four Sharing',
    FIVE: 'Five Sharing'
  };

  const roomTypeIcons: Record<RoomType, React.ReactNode> = {
    SINGLE: <Users className="w-5 h-5" />,
    DOUBLE: <Users className="w-5 h-5" />,
    THREE: <Users className="w-5 h-5" />,
    FOUR: <Users className="w-5 h-5" />,
    FIVE: <Users className="w-5 h-5" />
  };

  const getCapacityForRoomType = (roomType: RoomType): number => {
    switch (roomType) {
      case 'SINGLE': return 1;
      case 'DOUBLE': return 2;
      case 'THREE': return 3;
      case 'FOUR': return 4;
      case 'FIVE': return 5;
      default: return 1;
    }
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'wifi': <Wifi className="w-4 h-4" />,
    'ac': <Wind className="w-4 h-4" />,
    'tv': <Tv className="w-4 h-4" />,
    'parking': <Car className="w-4 h-4" />,
    'gym': <Dumbbell className="w-4 h-4" />,
    'kitchen': <Coffee className="w-4 h-4" />,
    'security': <Shield className="w-4 h-4" />
  };

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    for (const [key, icon] of Object.entries(amenityIcons)) {
      if (lowerAmenity.includes(key)) return icon;
    }
    return <CheckCircle className="w-4 h-4" />;
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingConfig(null);
    setFormData({
      hostelName: '',
      roomType: 'SINGLE',
      rentAmount: 0,
      maintenanceFeeAmount: 1000,
      totalRooms: 1,
      description: '',
      amenities: '',
      isActive: true,
    });
  };

  const statsByType = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats)
      .filter(([key]) => key !== 'configuredTypes')
      .map(([type, data]) => ({ type, data: data as any }));
  }, [stats]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm">
            <Settings className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Room settings</h2>
            <p className="text-sm text-slate-500">Configure room types and generate inventory</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </button>
          <button
            type="button"
            onClick={async () => {
              await fetchConfigs();
              await fetchStats();
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleGenerateRooms}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            <ArrowUpDown className="h-4 w-4" />
            Generate rooms
          </button>
        </div>
      </div>

      {(error || success) && (
        <div className="space-y-3">
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <div className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{success}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Room statistics</p>
            <p className="text-xs text-slate-500">High-level health of configured types</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {stats?.configuredTypes ?? 0} types
          </span>
        </div>

        {statsByType.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-700">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-900">No statistics yet</p>
            <p className="mt-1 text-sm text-slate-500">Create a configuration to start tracking inventory.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {statsByType.map(({ type, data }) => (
              <div key={type} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Type</p>
                    <p className="mt-1 truncate text-sm font-bold text-slate-900">
                      {roomTypeLabels[type as keyof typeof roomTypeLabels]}
                    </p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-700">
                    {roomTypeIcons[type as keyof typeof roomTypeIcons]}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Generated</p>
                    <p className="mt-1 font-semibold text-slate-900">{data.generated}</p>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Available</p>
                    <p className="mt-1 font-semibold text-emerald-700">{data.available}</p>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Occupied</p>
                    <p className="mt-1 font-semibold text-rose-700">{data.occupied}</p>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Rent</p>
                    <p className="mt-1 font-semibold text-slate-900">₹{data.rent}/mo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

        {/* Configurations */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Room type configurations</p>
            <p className="text-xs text-slate-500">Define rent, rooms, and amenities per type</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Close form' : 'Add configuration'}
          </button>
        </div>

        <div className="p-4">
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {editingConfig ? 'Edit configuration' : 'New configuration'}
                  </p>
                  <p className="text-xs text-slate-500">Capacity is derived from room type</p>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Hostel name</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={formData.hostelName}
                      onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                      className="w-full bg-transparent text-sm text-slate-800 outline-none"
                      placeholder="e.g., PG Manager Pro"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Room type</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Bed className="h-4 w-4 text-slate-500" />
                    <select
                      value={formData.roomType}
                      onChange={(e) => setFormData({ ...formData, roomType: e.target.value as RoomType })}
                      className="w-full bg-transparent text-sm text-slate-800 outline-none"
                      required
                    >
                      <option value="SINGLE">Single Sharing</option>
                      <option value="DOUBLE">Double Sharing</option>
                      <option value="THREE">Three Sharing</option>
                      <option value="FOUR">Four Sharing</option>
                      <option value="FIVE">Five Sharing</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Capacity</label>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Users className="h-4 w-4 text-slate-500" />
                    {getCapacityForRoomType(formData.roomType)} persons (auto)
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Rent (₹/month)</label>
                  <div className="mt-1 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      value={formData.rentAmount}
                      onChange={(e) => setFormData({ ...formData, rentAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-transparent text-sm text-slate-800 outline-none"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Maintenance fee (₹) – one-time
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      value={formData.maintenanceFeeAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, maintenanceFeeAmount: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-transparent text-sm text-slate-800 outline-none"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Total rooms</label>
                  <div className="mt-1 flex items-center gap-2">
                    <DoorOpen className="h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      value={formData.totalRooms}
                      onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value || '1', 10) })}
                      className="w-full bg-transparent text-sm text-slate-800 outline-none"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
                    rows={3}
                    maxLength={500}
                    placeholder="Describe the room type…"
                  />
                </div>

                <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Amenities (comma separated)</label>
                  <textarea
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    className="mt-2 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
                    rows={3}
                    maxLength={1000}
                    placeholder="WiFi, AC, Attached Bathroom…"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving…' : editingConfig ? 'Update configuration' : 'Create configuration'}
                </button>
                {editingConfig && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          )}

          {configs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-700">
                <Grid3x3 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-900">No configurations yet</p>
              <p className="mt-1 text-sm text-slate-500">Add your first room type to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {configs.map((config) => (
                <div key={config.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700">
                          {roomTypeIcons[config.roomType]}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">{config.hostelName}</p>
                          <p className="truncate text-xs text-slate-500">{roomTypeLabels[config.roomType]}</p>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Capacity</p>
                          <p className="mt-1 font-semibold text-slate-900">{getCapacityForRoomType(config.roomType)}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Rent</p>
                          <p className="mt-1 font-semibold text-slate-900">₹{config.rentAmount}/mo</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Maintenance</p>
                          <p className="mt-1 font-semibold text-slate-900">₹{config.maintenanceFeeAmount ?? 0}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Total rooms</p>
                          <p className="mt-1 font-semibold text-slate-900">{config.totalRooms}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Available</p>
                          <p className="mt-1 font-semibold text-emerald-700">{config.availableRooms}</p>
                        </div>
                      </div>

                      {config.description && (
                        <p className="mt-3 text-sm text-slate-600">{config.description}</p>
                      )}

                      {config.amenities && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {config.amenities.split(',').map((amenity: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                            >
                              {getAmenityIcon(amenity.trim())}
                              {amenity.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(config)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <PencilLine className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteConfig(config.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
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

export default RoomSettingsPage;
