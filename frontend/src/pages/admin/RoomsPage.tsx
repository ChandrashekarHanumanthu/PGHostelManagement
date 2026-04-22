import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosClient';
import { RoomType } from '../../types/RoomType';
import { 
  Home, 
  Bed,
  Users,
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  DoorOpen, 
  AlertCircle,
  Wrench,
  UserCheck,
  Grid3x3,
  ArrowUpDown,
  PencilLine,
  RefreshCw,
  X,
} from 'lucide-react';

interface Room {
  id: number;
  roomNumber: string;
  roomType: RoomType;
  rentAmount: number;
  availabilityStatus: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  currentOccupancy: number;
  hostelName?: string;
  description?: string;
  amenities?: string;
  tenants?: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
  }>;
}

interface EditingRoom {
  id: number;
  roomNumber: string;
}

interface RoomTenantSummary {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  signupCompleted: boolean;
}

const RoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingRoom, setEditingRoom] = useState<EditingRoom | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | RoomType>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE'>('ALL');
  const [membersRoom, setMembersRoom] = useState<Room | null>(null);
  const [roomTenants, setRoomTenants] = useState<RoomTenantSummary[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(false);
  const [tenantsError, setTenantsError] = useState<string | null>(null);

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

  const statusColors = {
    AVAILABLE: {
      badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      dot: 'bg-emerald-500',
      icon: <CheckCircle className="h-4 w-4" />,
    },
    OCCUPIED: {
      badge: 'bg-rose-50 text-rose-700 ring-rose-200',
      dot: 'bg-rose-500',
      icon: <XCircle className="h-4 w-4" />,
    },
    MAINTENANCE: {
      badge: 'bg-amber-50 text-amber-700 ring-amber-200',
      dot: 'bg-amber-500',
      icon: <Wrench className="h-4 w-4" />,
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch actual database rooms, not virtual ones
      const res = await api.get<Room[]>('/admin/rooms');
      // Ensure we always have an array, even if API returns unexpected data
      const roomsData = Array.isArray(res.data) ? res.data : [];
      setRooms(roomsData);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to fetch rooms');
      setRooms([]); // Ensure rooms is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoomNumber = async (roomId: number, newRoomNumber: string) => {
    if (!newRoomNumber || newRoomNumber.trim() === '') {
      setError('Room number cannot be empty');
      return;
    }
    
    try {
      await api.put(`/admin/rooms/${roomId}`, { roomNumber: newRoomNumber.trim() });
      setSuccess('Room number updated successfully');
      setEditingRoom(null);
      fetchRooms();
    } catch (err: any) {
      const backendMessage = err.response?.data?.error || err.response?.data?.message;
      setError(backendMessage || 'Failed to update room number');
    }
  };

  const handleViewTenants = async (room: Room) => {
    setMembersRoom(room);
    setRoomTenants([]);
    setTenantsError(null);
    setTenantsLoading(true);

    try {
      const res = await api.get<RoomTenantSummary[]>(`/admin/rooms/${room.id}/tenants`);
      setRoomTenants(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setTenantsError(backendMessage || 'Failed to load room members');
    } finally {
      setTenantsLoading(false);
    }
  };

  const closeMembersModal = () => {
    setMembersRoom(null);
    setRoomTenants([]);
    setTenantsError(null);
    setTenantsLoading(false);
  };

  const filteredRooms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (rooms || []).filter((room) => {
      const matchesSearch = term === '' || room.roomNumber.toLowerCase().includes(term);
      const matchesType = filterType === 'ALL' || room.roomType === filterType;
      const matchesStatus = filterStatus === 'ALL' || room.availabilityStatus === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [filterStatus, filterType, rooms, searchTerm]);

  const availableRoomsCount = useMemo(
    () => (rooms || []).filter((r) => r.availabilityStatus === 'AVAILABLE').length,
    [rooms]
  );
  const occupiedRoomsCount = useMemo(
    () => (rooms || []).filter((r) => r.availabilityStatus === 'OCCUPIED').length,
    [rooms]
  );
  const maintenanceRoomsCount = useMemo(
    () => (rooms || []).filter((r) => r.availabilityStatus === 'MAINTENANCE').length,
    [rooms]
  );
  const occupancyRate = useMemo(() => {
    if (!rooms.length) return 0;
    return Math.round((occupiedRoomsCount / rooms.length) * 100);
  }, [occupiedRoomsCount, rooms.length]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('ALL');
    setFilterStatus('ALL');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm">
            <DoorOpen className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Rooms</h2>
            <p className="text-sm text-slate-500">Manage inventory, availability, and assignments</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </button>
      </div>

      <div>
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total rooms</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{rooms.length}</p>
                <p className="mt-1 text-xs text-slate-500">All room types</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
                <Grid3x3 className="h-5 w-5" />
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Available</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{availableRoomsCount}</p>
                <p className="mt-1 text-xs text-slate-500">Ready for allocation</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle className="h-5 w-5" />
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Occupied</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{occupiedRoomsCount}</p>
                <p className="mt-1 text-xs text-slate-500">{occupancyRate}% utilization</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-700">
                <XCircle className="h-5 w-5" />
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Maintenance</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{maintenanceRoomsCount}</p>
                <p className="mt-1 text-xs text-slate-500">Needs attention</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
                <Wrench className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {(error || success) && (
          <div className="mt-6 space-y-3">
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

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Filter className="h-4 w-4 text-slate-500" />
              Filters
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchRooms}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ArrowUpDown className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Search</label>
              <div className="mt-1 flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Room number…"
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Room type</label>
              <div className="mt-1 flex items-center gap-2">
                <Bed className="h-4 w-4 text-slate-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none"
                >
                  <option value="ALL">All types</option>
                  <option value="SINGLE">Single Sharing</option>
                  <option value="DOUBLE">Double Sharing</option>
                  <option value="THREE">Three Sharing</option>
                  <option value="FOUR">Four Sharing</option>
                  <option value="FIVE">Five Sharing</option>
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Status</label>
              <div className="mt-1 flex items-center gap-2">
                <DoorOpen className="h-4 w-4 text-slate-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full bg-transparent text-sm text-slate-800 outline-none"
                >
                  <option value="ALL">All</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Rooms</p>
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filteredRooms.length}</span> of{' '}
                <span className="font-semibold text-slate-700">{rooms.length}</span>
              </p>
            </div>
          </div>

          {loading ? (
            <div className="px-4 py-10 text-center text-sm text-slate-600">Loading rooms…</div>
          ) : filteredRooms.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                <DoorOpen className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-900">No rooms found</p>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Room</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Capacity</th>
                      <th className="px-4 py-3">Rent</th>
                      <th className="px-4 py-3">Occupancy</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredRooms.map((room) => {
                      const cap = getCapacityForRoomType(room.roomType);
                      const statusMeta = statusColors[room.availabilityStatus];
                      return (
                        <tr key={room.id} className="hover:bg-slate-50/60">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700">
                                {roomTypeIcons[room.roomType]}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  {editingRoom?.id === room.id ? (
                                    <input
                                      type="text"
                                      defaultValue={room.roomNumber}
                                      onBlur={(e) => handleUpdateRoomNumber(room.id, e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleUpdateRoomNumber(room.id, (e.target as HTMLInputElement).value);
                                        }
                                        if (e.key === 'Escape') {
                                          setEditingRoom(null);
                                        }
                                      }}
                                      className="w-44 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-brand-500"
                                      autoFocus
                                    />
                                  ) : (
                                    <p className="truncate font-semibold text-slate-900">{room.roomNumber}</p>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setEditingRoom({ id: room.id, roomNumber: room.roomNumber })}
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                  >
                                    <PencilLine className="h-3.5 w-3.5" />
                                    Edit
                                  </button>
                                </div>
                                <p className="truncate text-xs text-slate-500">{room.hostelName || '—'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{roomTypeLabels[room.roomType]}</td>
                          <td className="px-4 py-3 text-slate-700">{cap}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">₹{room.rentAmount}/mo</td>
                          <td className="px-4 py-3 text-slate-700">
                            {room.currentOccupancy}/{cap}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={[
                                'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
                                statusMeta.badge,
                              ].join(' ')}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
                              {room.availabilityStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              {room.availabilityStatus === 'OCCUPIED' && (
                                <button
                                  type="button"
                                  onClick={() => handleViewTenants(room)}
                                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  <UserCheck className="h-4 w-4" />
                                  Members
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setEditingRoom({ id: room.id, roomNumber: room.roomNumber })}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                              >
                                <PencilLine className="h-4 w-4" />
                                Rename
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 p-4 md:hidden">
                {filteredRooms.map((room) => {
                  const cap = getCapacityForRoomType(room.roomType);
                  const statusMeta = statusColors[room.availabilityStatus];
                  return (
                    <div key={room.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700">
                            {roomTypeIcons[room.roomType]}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">{room.roomNumber}</p>
                            <p className="truncate text-xs text-slate-500">{roomTypeLabels[room.roomType]}</p>
                          </div>
                        </div>
                        <span
                          className={[
                            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
                            statusMeta.badge,
                          ].join(' ')}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
                          {room.availabilityStatus}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Rent</p>
                          <p className="mt-1 font-semibold text-slate-900">₹{room.rentAmount}/mo</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Occupancy</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {room.currentOccupancy}/{cap}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingRoom({ id: room.id, roomNumber: room.roomNumber })}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                        >
                          <PencilLine className="h-4 w-4" />
                          Rename
                        </button>
                        {room.availabilityStatus === 'OCCUPIED' && (
                          <button
                            type="button"
                            onClick={() => handleViewTenants(room)}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <UserCheck className="h-4 w-4" />
                            Members
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {membersRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Room Members</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{membersRoom.roomNumber}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {roomTypeLabels[membersRoom.roomType]} • {membersRoom.currentOccupancy}/{getCapacityForRoomType(membersRoom.roomType)} occupied
                </p>
              </div>
              <button
                type="button"
                onClick={closeMembersModal}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-4">
              {tenantsLoading ? (
                <div className="py-10 text-center text-sm text-slate-600">Loading members...</div>
              ) : tenantsError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {tenantsError}
                </div>
              ) : roomTenants.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">No members in this room</p>
                  <p className="mt-1 text-sm text-slate-500">This room does not currently have any assigned tenants.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {roomTenants.map((tenant) => (
                    <div key={tenant.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{tenant.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{tenant.email}</p>
                          <p className="mt-1 text-sm text-slate-500">{tenant.phone || 'Phone not provided'}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              tenant.active ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                            }`}
                          >
                            {tenant.active ? 'Active' : 'Inactive'}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              tenant.signupCompleted ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                            }`}
                          >
                            {tenant.signupCompleted ? 'Setup complete' : 'Invite pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
