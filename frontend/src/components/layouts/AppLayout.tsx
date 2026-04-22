import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Menu,
  Home,
  Bed,
  Users,
  CreditCard,
  AlertTriangle,
  FileText,
  Settings,
  LogOut,
  User,
  Building2,
  UserPlus,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  to: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { role, logout, hostelName } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isAdminShell = role === 'ADMIN' || role === 'OWNER';

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('app_shell_sidebar_collapsed');
      if (saved === '1') {
        setSidebarCollapsed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('app_shell_sidebar_collapsed', sidebarCollapsed ? '1' : '0');
    } catch {
      // ignore
    }
  }, [sidebarCollapsed]);

  const adminNavSections: NavSection[] = [
    {
      title: 'Overview',
      items: [{ to: '/admin/dashboard', label: 'Dashboard', description: 'Command center', icon: Home, end: true }],
    },
    {
      title: 'Accommodation',
      items: [
        { to: '/admin/rooms', label: 'Rooms', description: 'Inventory', icon: Bed },
        { to: '/admin/room-settings', label: 'Room Settings', description: 'Configuration', icon: Settings },
        { to: '/admin/tenants', label: 'Tenants', description: 'Residents', icon: Users },
        { to: '/admin/tenant-registration', label: 'Register Tenant', description: 'Onboarding', icon: UserPlus },
      ],
    },
    {
      title: 'Finance',
      items: [
        { to: '/admin/payments', label: 'Payments', description: 'Collections', icon: CreditCard },
        { to: '/admin/payment-settings', label: 'Payment Settings', description: 'Methods', icon: Settings },
      ],
    },
    {
      title: 'Support',
      items: [
        { to: '/admin/complaints', label: 'Complaints', description: 'Tickets', icon: AlertTriangle },
        { to: '/admin/notices', label: 'Notices', description: 'Broadcasts', icon: FileText },
      ],
    },
  ];

  const tenantNavSections: NavSection[] = [
    {
      title: 'Workspace',
      items: [
        { to: '/tenant/dashboard', label: 'Dashboard', description: 'Snapshot', icon: Home, end: true },
        { to: '/tenant/payments', label: 'Payments', description: 'Rent and history', icon: CreditCard },
        { to: '/tenant/complaints', label: 'Complaints', description: 'Requests', icon: AlertTriangle },
        { to: '/tenant/notices', label: 'Notices', description: 'Updates', icon: FileText },
      ],
    },
  ];

  const currentNavSections = isAdminShell ? adminNavSections : tenantNavSections;
  const dashboardPath = isAdminShell ? '/admin/dashboard' : '/tenant/dashboard';
  const profilePath = isAdminShell ? '/admin/profile' : '/tenant/profile';
  const roleLabel = role === 'ADMIN' ? 'Administrator' : role === 'OWNER' ? 'Owner' : 'Tenant';
  const allItems = useMemo(() => currentNavSections.flatMap((section) => section.items), [currentNavSections]);

  const routeMeta = useMemo(() => {
    const exact = allItems.find((item) => item.to === location.pathname);
    if (exact) {
      return { label: exact.label, description: exact.description };
    }
    const partial = allItems.find((item) => location.pathname.startsWith(item.to));
    return {
      label: partial?.label || 'Workspace',
      description: partial?.description || 'Operations',
    };
  }, [allItems, location.pathname]);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const renderNavigation = (closeOnClick: boolean) => (
    <nav className="flex-1 overflow-y-auto px-4 py-5 custom-scrollbar">
      <div className="space-y-6">
        {currentNavSections.map((section) => (
          <div key={section.title}>
            <p
              className={`px-3 mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 ${
                sidebarCollapsed ? 'sr-only' : ''
              }`}
            >
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeOnClick ? () => setMobileMenuOpen(false) : undefined}
                    className={({ isActive }) =>
                      [
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                        isActive
                          ? 'bg-brand-500/15 text-brand-400 shadow-[inset_3px_0_0_0_rgba(99,102,241,1)]'
                          : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200',
                      ].join(' ')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={[
                            'grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors',
                            isActive ? 'bg-brand-500/20 text-brand-400' : 'bg-transparent text-slate-500 group-hover:text-slate-300',
                          ].join(' ')}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className={`min-w-0 flex-1 ${sidebarCollapsed ? 'hidden' : ''}`}>
                          <span className="block truncate font-semibold">{item.label}</span>
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      <div className="flex h-full w-full">
        <aside
          className={[
            'hidden lg:flex shrink-0 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 transition-all duration-300 ease-in-out relative h-full',
            sidebarCollapsed ? 'w-[88px]' : 'w-[280px]',
          ].join(' ')}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-5 mb-2">
            <Link to={dashboardPath} className="flex min-w-0 items-center gap-3 rounded-xl hover:bg-slate-900/50 p-1.5 transition-colors">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <Building2 className="h-5 w-5" />
              </span>
              <span className={`min-w-0 ${sidebarCollapsed ? 'hidden' : ''}`}>
                <span className="block truncate text-[15px] font-bold text-white tracking-tight">{hostelName || 'PG Manager Pro'}</span>
                <span className="block truncate text-[11px] font-semibold text-slate-400 tracking-wide uppercase mt-0.5">{roleLabel}</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={toggleSidebar}
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          <div className={`px-4 pb-4 shrink-0 ${sidebarCollapsed ? 'hidden' : ''}`}>
            <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 px-3.5 py-3 backdrop-blur-md">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-200">{hostelName || 'Hostel Workspace'}</p>
            </div>
          </div>

          {renderNavigation(false)}

          <div className="border-t border-slate-800/80 p-4 shrink-0">
            <Link
              to={profilePath}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 transition-colors"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg">
                <User className="h-5 w-5" />
              </span>
              <span className={sidebarCollapsed ? 'hidden' : ''}>Profile & Settings</span>
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-400 hover:bg-slate-900/80 hover:text-rose-400 transition-colors"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg">
                <LogOut className="h-5 w-5" />
              </span>
              <span className={sidebarCollapsed ? 'hidden' : ''}>Sign Out</span>
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 flex flex-col h-full overflow-hidden bg-transparent">
          <header className="shrink-0 sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex w-full items-center justify-between gap-4 px-6 py-4">
              <div className="flex min-w-0 items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden hover:bg-slate-50 transition-colors"
                  aria-label="Open navigation"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-0.5">
                     {isAdminShell ? 'Operations Control' : 'Tenant Portal'}
                   </p>
                   <h1 className="truncate text-[22px] font-extrabold text-slate-900 tracking-tight leading-none">{routeMeta.label}</h1>
                </div>
              </div>

              <div className="hidden w-[max(400px,30vw)] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 shadow-inner transition-colors focus-within:bg-white focus-within:border-brand-300 focus-within:ring-[3px] focus-within:ring-brand-50 lg:flex">
                <Search className="h-[18px] w-[18px] text-slate-400" />
                <input
                  type="text"
                  placeholder="Search rooms, tenants, invoices…"
                  className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all"
                  aria-label="Notifications"
                >
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                  <Bell className="h-4 w-4" />
                </button>
                
                <div className="hidden h-6 w-[1px] bg-slate-200 sm:block"></div>
                
                <Link
                  to={profilePath}
                  className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white p-1.5 pr-4 shadow-sm hover:bg-slate-50 hover:shadow transition-all sm:flex"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-700">
                    <User className="h-[18px] w-[18px]" />
                  </div>
                  <span className="text-[13px] font-bold text-slate-700">My Profile</span>
                </Link>
                
                <button
                  onClick={logout}
                  className="hidden items-center justify-center h-10 w-10 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors sm:flex"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto w-full max-w-[1400px]">
              {children}
            </div>
          </main>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[88%] max-w-[320px] bg-white shadow-2xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 text-white shadow-sm">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-900">{hostelName || 'PG Manager Pro'}</span>
                    <span className="block truncate text-xs text-slate-500">{roleLabel}</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700"
                  aria-label="Close navigation"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              {renderNavigation(true)}

              <div className="border-t border-slate-200 p-3">
                <div className="space-y-2">
                  <Link
                    to={profilePath}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-700">
                      <User className="h-4 w-4" />
                    </span>
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-700">
                      <LogOut className="h-4 w-4" />
                    </span>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
