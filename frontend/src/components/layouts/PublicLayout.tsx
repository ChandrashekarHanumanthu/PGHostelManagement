import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Menu, X } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { to: '/home', label: 'Product' },
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/demo', label: 'Demo' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const hideFooterRoutes = ['/login', '/hostel-signup', '/admin/login', '/tenant-login', '/forgot-password', '/signup'];
  const showFooter = !hideFooterRoutes.some((route) => location.pathname.startsWith(route));

  return (
    <div className="marketing-shell min-h-screen flex flex-col">
      <header className={`mk-nav fixed top-0 left-0 right-0 z-50 transition-shadow ${scrolled ? 'shadow-[0_8px_24px_-18px_rgba(15,23,42,0.5)]' : ''}`}>
        <div className="mk-wrap">
          <div className="h-[76px] flex items-center justify-between gap-4">
            <Link to="/home" className="inline-flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f6fff] to-[#0ea5a4] inline-flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </span>
              <span className="text-xl font-black tracking-tight text-slate-900">
                PG Manager <span className="text-[#0f6fff]">Pro</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1.5">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link key={item.to} to={item.to} className={`mk-nav-link ${active ? 'active' : ''}`}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="mk-button-secondary">Log in</Link>
              <Link to="/hostel-signup" className="mk-button-primary">Start free trial</Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden border-t border-slate-200 bg-[#f7fafe]"
            >
              <div className="mk-wrap py-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`mk-nav-link ${active ? 'active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="pt-2 flex flex-col gap-2">
                  <Link to="/login" className="mk-button-secondary w-full">Log in</Link>
                  <Link to="/hostel-signup" className="mk-button-primary w-full">Start free trial</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="mk-main flex-1">{children}</main>

      {showFooter && (
        <footer className="mk-footer mt-auto">
          <div className="mk-wrap py-14">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
              <div className="col-span-2">
                <Link to="/home" className="inline-flex items-center gap-2.5 mb-4">
                  <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0f6fff] to-[#0ea5a4] inline-flex items-center justify-center text-white">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <span className="text-lg font-black tracking-tight text-white">PG Manager Pro</span>
                </Link>
                <p className="text-sm leading-relaxed text-slate-300 max-w-sm">
                  RevenueOS for modern PG and hostel businesses. Run occupancy, collections, tenant operations and support from one command center.
                </p>
              </div>

              <div>
                <h4 className="text-white text-sm font-bold mb-3">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/features">Features</Link></li>
                  <li><Link to="/pricing">Pricing</Link></li>
                  <li><Link to="/demo">Book demo</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white text-sm font-bold mb-3">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/hostel-signup">Get started</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white text-sm font-bold mb-3">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="mailto:hello@pgmanagerpro.com">hello@pgmanagerpro.com</a></li>
                  <li><a href="tel:+918010942551">+91 80109 42551</a></li>
                  <li><Link to="/contact">Help center</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <p>&copy; {new Date().getFullYear()} PG Manager Pro. All rights reserved.</p>
              <p>Designed for high-occupancy hostels and PG businesses.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
