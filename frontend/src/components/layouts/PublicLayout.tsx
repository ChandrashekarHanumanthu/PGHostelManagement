import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const publicNavItems = [
    { to: '/home', label: 'Product' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const hideFooterRoutes = ['/login', '/hostel-signup', '/admin/login', '/tenant-login', '/forgot-password', '/signup'];
  const showFooter = !hideFooterRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen flex flex-col">
      {/* Glassmorphism Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b ${
          scrolled
            ? 'shadow-sm border-gray-200'
            : 'border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/home" className="flex items-center space-x-2.5 group">
              <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-2 rounded-xl shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className={`font-heading font-bold text-xl transition-colors ${
                scrolled ? 'text-gray-900' : 'text-gray-900'
              }`}>
                PG Manager
                <span className="text-gradient-brand"> Pro</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {publicNavItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-brand-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
                        transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/hostel-signup"
                className="bg-gradient-to-r from-brand-600 to-brand-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-brand-700 hover:to-brand-600 transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100/60 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {publicNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === item.to
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-3 mt-3 border-t border-gray-200/60 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/hostel-signup"
                    className="block px-4 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl text-sm font-semibold text-center shadow-lg shadow-brand-500/25"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* ═══ GLOBAL FOOTER ═══ */}
      {showFooter && (
        <footer className="bg-surface-950 text-gray-400 pt-14 pb-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
              {/* Brand */}
              <div className="col-span-2 md:col-span-4 lg:col-span-1">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="bg-gradient-to-br from-brand-500 to-purple-500 p-1.5 rounded-lg">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-heading text-base font-bold text-white">PG Manager Pro</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  India's modern SaaS platform for PG & hostel management. Trusted by 150+ properties.
                </p>
                <div className="flex items-center gap-2">
                  <a href="mailto:hello@pgmanagerpro.com" className="text-[10px] text-gray-500 hover:text-white transition-colors">hello@pgmanagerpro.com</a>
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">Product</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link to="/demo" className="hover:text-white transition-colors">Request Demo</Link></li>
                  <li><Link to="/hostel-signup" className="hover:text-white transition-colors">Start Free Trial</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">Company</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link to="/about" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">Support</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link to="/contact" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">API Documentation</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">System Status</Link></li>
                  <li><a href="tel:+918010942551" className="hover:text-white transition-colors">+91 80109 42551</a></li>
                </ul>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 mb-6" />

            {/* Bottom */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} PG Manager Pro. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/privacy" className="hover:text-white transition-colors">Terms</Link>
                <span>Made with ❤️ in Hyderabad</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
