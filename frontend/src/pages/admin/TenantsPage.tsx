import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axiosClient';
import { Search, Users, UserCheck, UserX, RefreshCw, Trash2, ArrowUpDown, Filter } from 'lucide-react';

interface Tenant {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  phone: string;
  alternatePhone?: string;
  location?: string;
  aadhaarNumber?: string;
  photoUrl?: string;
  allocatedRoom?: {
    id: number;
    roomNumber: string;
  };
  allocationDate?: string;
  signupCompleted: boolean;
}

const TenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDeleteTenant = async (tenantId: number, tenantName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${tenantName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/tenants/${tenantId}`);
      setTenants((prev) => prev.filter((t) => t.id !== tenantId));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Failed to delete tenant';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get<Tenant[]>('/admin/tenants');
      
      // Ensure the response is an array
      if (Array.isArray(res.data)) {
        setTenants(res.data);
        setError(null);
      } else {
        console.error('API did not return an array:', res.data);
        setTenants([]);
        setError('Invalid data format received from server');
      }
    } catch (err: any) {
      console.error('Error refreshing tenants:', err);
      const backendMessage = err.response?.data?.error || err.response?.data?.message;
      setError(backendMessage || 'Failed to fetch tenants');
      setTenants([]); // Ensure tenants is always an array
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get<Tenant[]>('/admin/tenants');
        
        // Ensure the response is an array
        if (Array.isArray(res.data)) {
          setTenants(res.data);
          setError(null);
        } else {
          console.error('API did not return an array:', res.data);
          setTenants([]);
          setError('Invalid data format received from server');
        }
      } catch (err: any) {
        console.error('Error fetching tenants:', err);
        const backendMessage = err.response?.data?.error || err.response?.data?.message;
        setError(backendMessage || 'Failed to fetch tenants');
        setTenants([]); // Ensure tenants is always an array
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  const filteredTenants = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (Array.isArray(tenants) ? tenants : []).filter((tenant) => {
      const matchesSearch =
        term === '' ||
        tenant.user?.name?.toLowerCase().includes(term) ||
        tenant.user?.email?.toLowerCase().includes(term) ||
        tenant.phone?.includes(term) ||
        tenant.allocatedRoom?.roomNumber?.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'all' ? true : statusFilter === 'completed' ? tenant.signupCompleted : !tenant.signupCompleted;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, tenants]);

  const stats = {
    total: Array.isArray(tenants) ? tenants.length : 0,
    completed: Array.isArray(tenants) ? tenants.filter(t => t.signupCompleted).length : 0,
    pending: Array.isArray(tenants) ? tenants.filter(t => !t.signupCompleted).length : 0
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const statusBadge = (completed: boolean) =>
    completed
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : 'bg-amber-50 text-amber-700 ring-amber-200';

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Tenants</h2>
            <p className="text-sm text-slate-500">View profiles, onboarding status, and allocations</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total tenants</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.total}</p>
              <p className="mt-1 text-xs text-slate-500">All tenant accounts</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-700">
              <Users className="h-5 w-5" />
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Signup completed</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.completed}</p>
              <p className="mt-1 text-xs text-slate-500">Ready to use</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <UserCheck className="h-5 w-5" />
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Pending signup</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.pending}</p>
              <p className="mt-1 text-xs text-slate-500">Needs onboarding</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
              <UserX className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p className="font-semibold">Error</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Filter className="h-4 w-4 text-slate-500" />
            Filters
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowUpDown className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Search</label>
            <div className="mt-1 flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Name, email, phone, room…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="mt-2 w-full bg-transparent text-sm text-slate-800 outline-none"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Tenants</p>
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-700">{filteredTenants.length}</span> of{' '}
              <span className="font-semibold text-slate-700">{stats.total}</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="px-4 py-10 text-center text-sm text-slate-600">Loading tenants…</div>
        ) : filteredTenants.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-600">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {Array.isArray(tenants) && tenants.length === 0 ? 'No tenants found' : 'No matching tenants'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {Array.isArray(tenants) && tenants.length === 0 ? 'Register some tenants to see them here.' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Tenant</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Signup</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{tenant.user?.name || '—'}</p>
                          <p className="truncate text-xs text-slate-500">{tenant.user?.email || '—'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{tenant.phone || '—'}</td>
                      <td className="px-4 py-3 text-slate-700">{tenant.allocatedRoom?.roomNumber || '—'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
                            statusBadge(tenant.signupCompleted),
                          ].join(' ')}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${tenant.signupCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {tenant.signupCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteTenant(tenant.id, tenant.user?.name || 'this tenant')}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-3 p-4 md:hidden">
              {filteredTenants.map((tenant) => (
                <div key={tenant.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{tenant.user?.name || '—'}</p>
                      <p className="truncate text-xs text-slate-500">{tenant.user?.email || '—'}</p>
                    </div>
                    <span
                      className={[
                        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset',
                        statusBadge(tenant.signupCompleted),
                      ].join(' ')}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${tenant.signupCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {tenant.signupCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Phone</p>
                      <p className="mt-1 font-semibold text-slate-900">{tenant.phone || '—'}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Room</p>
                      <p className="mt-1 font-semibold text-slate-900">{tenant.allocatedRoom?.roomNumber || '—'}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => handleDeleteTenant(tenant.id, tenant.user?.name || 'this tenant')}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete tenant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TenantsPage;

