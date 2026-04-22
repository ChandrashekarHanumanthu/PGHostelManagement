import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Calendar,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  DoorOpen,
  Settings,
  UserPlus,
  Users,
} from 'lucide-react';
import '../../styles/admin-shell.css';

interface AdminDashboardData {
  totalRooms: number;
  occupiedRooms: number;
  totalTenants: number;
  monthlyRevenue: number;
  pendingComplaints: number;
}

interface DashboardMetric {
  title: string;
  value: string;
  hint: string;
  progress: number;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  trendUp: boolean;
  trendText: string;
}

interface QuickLink {
  title: string;
  description: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface OpsRow {
  label: string;
  value: number;
  helper: string;
}

const EMPTY_DASHBOARD: AdminDashboardData = {
  totalRooms: 0,
  occupiedRooms: 0,
  totalTenants: 0,
  monthlyRevenue: 0,
  pendingComplaints: 0,
};

const clamp = (value: number): number => Math.max(0, Math.min(100, value));

const AdminDashboard: React.FC = () => {
  const { hostelName } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      try {
        const today = new Date();
        const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        const response = await api.get<AdminDashboardData>(`/dashboard/admin?month=${month}`);
        if (!active) {
          return;
        }
        setData(response.data);
        setFetchError(null);
      } catch (error) {
        if (!active) {
          return;
        }
        console.error(error);
        setFetchError('Could not load live dashboard metrics. Showing default values.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();
    return () => {
      active = false;
    };
  }, []);

  const dashboard = data ?? EMPTY_DASHBOARD;
  const currency = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }),
    []
  );

  const occupancyRate = clamp(
    dashboard.totalRooms > 0 ? (dashboard.occupiedRooms / dashboard.totalRooms) * 100 : 0
  );
  const vacantRooms = Math.max(dashboard.totalRooms - dashboard.occupiedRooms, 0);
  const tenantCapacity = dashboard.totalRooms * 4;
  const tenantUtilization = clamp(
    tenantCapacity > 0 ? (dashboard.totalTenants / tenantCapacity) * 100 : 0
  );
  const revenueTarget = dashboard.monthlyRevenue > 0 ? Math.round(dashboard.monthlyRevenue * 1.15) : 0;
  const collectionRate = clamp(
    revenueTarget > 0 ? (dashboard.monthlyRevenue / revenueTarget) * 100 : 0
  );
  const complaintHealth = clamp(100 - dashboard.pendingComplaints * 10);

  const heroDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const heroTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const metrics: DashboardMetric[] = [
    {
      title: 'Total Rooms',
      value: String(dashboard.totalRooms),
      hint: `${vacantRooms} vacant`,
      progress: occupancyRate,
      icon: DoorOpen,
      iconClass: 'bg-blue-100 text-blue-700',
      trendUp: occupancyRate >= 70,
      trendText: occupancyRate >= 70 ? 'Healthy occupancy' : 'Needs occupancy growth',
    },
    {
      title: 'Occupancy',
      value: `${occupancyRate.toFixed(1)}%`,
      hint: `${dashboard.occupiedRooms}/${dashboard.totalRooms} occupied`,
      progress: occupancyRate,
      icon: Building2,
      iconClass: 'bg-teal-100 text-teal-700',
      trendUp: occupancyRate >= 80,
      trendText: occupancyRate >= 80 ? 'Target reached' : 'Below benchmark',
    },
    {
      title: 'Active Tenants',
      value: String(dashboard.totalTenants),
      hint: `Capacity ${tenantCapacity}`,
      progress: tenantUtilization,
      icon: Users,
      iconClass: 'bg-indigo-100 text-indigo-700',
      trendUp: tenantUtilization >= 65,
      trendText: tenantUtilization >= 65 ? 'Strong utilization' : 'Available headroom',
    },
    {
      title: 'Monthly Revenue',
      value: currency.format(dashboard.monthlyRevenue),
      hint: revenueTarget > 0 ? `Target ${currency.format(revenueTarget)}` : 'No target set',
      progress: collectionRate,
      icon: DollarSign,
      iconClass: 'bg-emerald-100 text-emerald-700',
      trendUp: collectionRate >= 80,
      trendText: collectionRate >= 80 ? 'On-track collections' : 'Push collections',
    },
    {
      title: 'Pending Complaints',
      value: String(dashboard.pendingComplaints),
      hint: dashboard.pendingComplaints === 0 ? 'No pending tickets' : 'Needs follow-up',
      progress: clamp((dashboard.pendingComplaints / 10) * 100),
      icon: AlertTriangle,
      iconClass: 'bg-rose-100 text-rose-700',
      trendUp: dashboard.pendingComplaints <= 2,
      trendText: dashboard.pendingComplaints <= 2 ? 'Within safe range' : 'Attention required',
    },
  ];

  const quickLinks: QuickLink[] = [
    {
      title: 'Onboard Tenant',
      description: 'Create account and allocate room',
      to: '/admin/tenant-registration',
      icon: UserPlus,
    },
    {
      title: 'Manage Rooms',
      description: 'Update room availability and details',
      to: '/admin/rooms',
      icon: DoorOpen,
    },
    {
      title: 'Payment Desk',
      description: 'Review rent records and approvals',
      to: '/admin/payments',
      icon: CreditCard,
    },
    {
      title: 'Configuration',
      description: 'Tune rent cycles and payment settings',
      to: '/admin/payment-settings',
      icon: Settings,
    },
  ];

  const operations: OpsRow[] = [
    {
      label: 'Occupancy Utilization',
      value: occupancyRate,
      helper: `${dashboard.occupiedRooms} occupied / ${dashboard.totalRooms} total`,
    },
    {
      label: 'Tenant Capacity Utilization',
      value: tenantUtilization,
      helper: `${dashboard.totalTenants} tenants / ${tenantCapacity} capacity`,
    },
    {
      label: 'Collection Readiness',
      value: collectionRate,
      helper: revenueTarget > 0 ? `${currency.format(dashboard.monthlyRevenue)} of target` : 'No target baseline',
    },
    {
      label: 'Complaint Health Score',
      value: complaintHealth,
      helper: dashboard.pendingComplaints === 0 ? 'No pending complaints' : `${dashboard.pendingComplaints} open complaints`,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="admin-panel p-6 md:p-8">
          <div className="saas-loader mb-4 w-44" />
          <div className="saas-loader mb-3 w-[72%]" />
          <div className="saas-loader mb-6 w-[48%]" />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="saas-loader h-20" />
            <div className="saas-loader h-20" />
            <div className="saas-loader h-20" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="admin-panel p-5">
              <div className="saas-loader mb-3 w-24" />
              <div className="saas-loader mb-2 w-20" />
              <div className="saas-loader w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {fetchError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/85 px-4 py-3 text-sm text-rose-700">
          {fetchError}
        </div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="admin-panel admin-hero-card p-6 md:p-8"
      >
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div>
            <p className="font-admin-kicker text-xs uppercase tracking-[0.14em] text-slate-500">Daily Snapshot</p>
            <h2 className="saas-hero-title mt-2 text-3xl md:text-4xl">
              {hostelName || 'PG Manager Pro'} Command Center
            </h2>
            <p className="saas-hero-subtitle mt-3 max-w-2xl text-sm md:text-base">
              Monitor occupancy, rent, tenant operations, and service quality from a single admin-grade SaaS
              interface.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                {heroDate}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2">
                <Clock className="h-4 w-4 text-slate-500" />
                {heroTime}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-teal-700">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                Operations Online
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="admin-panel p-4 bg-white/40 shadow-none border-white/60">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Revenue</p>
                <p className="mt-2 text-[26px] font-extrabold text-slate-900 tracking-tight">{currency.format(dashboard.monthlyRevenue)}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">Current month collections</p>
              </div>
              <div className="admin-panel p-4 bg-white/40 shadow-none border-white/60">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Occupancy</p>
                <p className="mt-2 text-[26px] font-extrabold text-slate-900 tracking-tight">{occupancyRate.toFixed(1)}%</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{vacantRooms} rooms available</p>
              </div>
              <div className="admin-panel p-4 bg-white/40 shadow-none border-white/60">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Pending Tickets</p>
                <p className="mt-2 text-[26px] font-extrabold text-slate-900 tracking-tight">{dashboard.pendingComplaints}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">Track and resolve fast</p>
              </div>
            </div>
          </div>

          <div className="admin-panel p-5">
            <p className="text-sm font-semibold text-slate-700">Occupancy Ring</p>
            <div className="mt-4 flex items-center justify-center">
              <div
                className="relative h-40 w-40 rounded-full"
                style={{
                  background: `conic-gradient(#0f6dff ${occupancyRate}%, #dbe5f0 ${occupancyRate}% 100%)`,
                }}
              >
                <div className="absolute inset-[14px] flex items-center justify-center rounded-full bg-white/95 text-center">
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">{occupancyRate.toFixed(1)}%</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Occupied</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                  <span>Collection Progress</span>
                  <span>{collectionRate.toFixed(1)}%</span>
                </div>
                <div className="saas-chart-track">
                  <div className="saas-chart-fill" style={{ width: `${collectionRate}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                  <span>Complaint Health</span>
                  <span>{complaintHealth.toFixed(1)}%</span>
                </div>
                <div className="saas-chart-track">
                  <div
                    className="saas-chart-fill"
                    style={{
                      width: `${complaintHealth}%`,
                      background: 'linear-gradient(90deg, #16a34a, #0ea5e9)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.article
              key={metric.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="saas-metric-card p-4"
            >
              <div className="relative z-10">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className={`saas-metric-icon ${metric.iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                      metric.trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {metric.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {metric.trendUp ? 'Stable' : 'Watch'}
                  </span>
                </div>

                <p className="saas-metric-label">{metric.title}</p>
                <p className="saas-metric-value mt-1">{metric.value}</p>
                <p className="saas-metric-hint mt-1">{metric.hint}</p>
                <p className="mt-1 text-xs text-slate-500">{metric.trendText}</p>
                <div className="admin-progress-track mt-3">
                  <div className="admin-progress-fill bg-gradient-to-r from-blue-500 to-teal-500" style={{ width: `${metric.progress}%` }} />
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="admin-panel p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-admin-heading text-xl font-semibold text-slate-900">Quick Actions</h3>
              <p className="text-sm text-slate-500">Common admin workflows for day-to-day operations</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {quickLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link to={item.to} className="saas-quick-link flex items-center gap-4">
                    <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white shadow-md">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-extrabold text-slate-900 tracking-tight">{item.title}</span>
                      <span className="block truncate text-[13px] font-medium text-slate-500">{item.description}</span>
                    </span>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="admin-panel p-5 md:p-6">
          <h3 className="font-admin-heading text-xl font-semibold text-slate-900">Operations Radar</h3>
          <p className="text-sm text-slate-500">Live operational signals for this month</p>
          <div className="mt-4 space-y-3">
            {operations.map((row) => (
              <div key={row.label} className="saas-activity-item">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{row.label}</span>
                  <span className="text-slate-600">{row.value.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div className="saas-mini-bar" style={{ width: `${row.value}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">{row.helper}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="admin-panel p-5 md:p-6">
          <h3 className="font-admin-heading text-xl font-semibold text-slate-900">Collection Funnel</h3>
          <p className="text-sm text-slate-500">Revenue readiness indicators for rent cycle planning</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Collected</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">{currency.format(dashboard.monthlyRevenue)}</p>
              <p className="mt-1 text-xs text-slate-500">Current month inflow</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Projected Target</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">
                {revenueTarget > 0 ? currency.format(revenueTarget) : currency.format(0)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Auto estimate from current cycle</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Funnel Completion</span>
              <span className="text-sm font-semibold text-slate-700">{collectionRate.toFixed(1)}%</span>
            </div>
            <div className="admin-progress-track">
              <div className="admin-progress-fill bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: `${collectionRate}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Increase completion by reviewing pending rent entries and tenant reminders.
            </p>
          </div>
        </div>

        <div className="admin-panel p-5 md:p-6">
          <h3 className="font-admin-heading text-xl font-semibold text-slate-900">Action Center</h3>
          <p className="text-sm text-slate-500">Prioritized next steps for today</p>
          <div className="mt-4 space-y-3">
            <Link to="/admin/complaints" className="saas-quick-link block">
              <p className="text-sm font-semibold text-slate-900">Resolve complaint queue</p>
              <p className="mt-1 text-xs text-slate-500">
                {dashboard.pendingComplaints > 0
                  ? `${dashboard.pendingComplaints} tickets need review`
                  : 'No unresolved complaints'}
              </p>
            </Link>
            <Link to="/admin/payments" className="saas-quick-link block">
              <p className="text-sm font-semibold text-slate-900">Audit payment history</p>
              <p className="mt-1 text-xs text-slate-500">Verify tenant entries and pending approvals</p>
            </Link>
            <Link to="/admin/notices" className="saas-quick-link block">
              <p className="text-sm font-semibold text-slate-900">Publish notice</p>
              <p className="mt-1 text-xs text-slate-500">Send reminders for dues or maintenance updates</p>
            </Link>
            <Link to="/admin/rooms" className="saas-quick-link block">
              <p className="text-sm font-semibold text-slate-900">Optimize room inventory</p>
              <p className="mt-1 text-xs text-slate-500">
                {vacantRooms > 0 ? `${vacantRooms} rooms available for allocation` : 'All rooms occupied'}
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
