import React from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/shared/LoginPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import ForgotPasswordPage from './pages/shared/ForgotPasswordPage';
import HostelOwnerSignupPage from './pages/shared/HostelOwnerSignupPage';
import HomePage from './pages/marketing/HomePage';
import FeaturesPage from './pages/marketing/FeaturesPage';
import PricingPage from './pages/marketing/PricingPage';
import DemoPage from './pages/marketing/DemoPage';
import ContactPage from './pages/marketing/ContactPage';
import AboutPage from './pages/marketing/AboutPage';
import PublicLayout from './components/layouts/PublicLayout';
import AppLayout from './components/layouts/AppLayout';
import TenantRegistrationPage from './pages/admin/TenantRegistrationPage';
import TenantPasswordSetupPage from './pages/tenant/TenantPasswordSetupPage';
import RoomSettingsPage from './pages/admin/RoomSettingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import TenantDashboard from './pages/tenant/TenantDashboard';
import TenantLoginPage from './pages/tenant/TenantLoginPage';
import RoomsPage from './pages/admin/RoomsPage';
import TenantsPage from './pages/admin/TenantsPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import TenantPaymentsPage from './pages/tenant/TenantPaymentsPage';
import PaymentSettingsPage from './pages/admin/PaymentSettingsPage';
import ComplaintsPage from './pages/admin/ComplaintsPage';
import NoticesPage from './pages/admin/NoticesPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import TenantProfilePage from './pages/tenant/TenantProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {

  return (
    <Routes>
      {/* Public Routes with Marketing Layout */}
      <Route path="/" element={<PublicLayout><Outlet /></PublicLayout>}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="demo" element={<DemoPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="hostel-signup" element={<HostelOwnerSignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="tenant-login" element={<TenantLoginPage />} />
      </Route>
      
      {/* Admin Routes with App Layout */}
      <Route path="/admin" element={<AppLayout><Outlet /></AppLayout>}>
        <Route index element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="rooms" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><RoomsPage /></ProtectedRoute>} />
        <Route path="room-settings" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><RoomSettingsPage /></ProtectedRoute>} />
        <Route path="tenants" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><TenantsPage /></ProtectedRoute>} />
        <Route path="tenant-registration" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><TenantRegistrationPage /></ProtectedRoute>} />
        <Route path="payments" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><PaymentsPage /></ProtectedRoute>} />
        <Route path="payment-settings" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><PaymentSettingsPage /></ProtectedRoute>} />
        <Route path="complaints" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><ComplaintsPage /></ProtectedRoute>} />
        <Route path="notices" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><NoticesPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}><AdminProfilePage /></ProtectedRoute>} />
      </Route>
      
      {/* Tenant Routes with App Layout */}
      <Route path="/tenant" element={<AppLayout><Outlet /></AppLayout>}>
        <Route index element={<ProtectedRoute allowedRoles={['TENANT']}><TenantDashboard /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute allowedRoles={['TENANT']}><TenantDashboard /></ProtectedRoute>} />
        <Route path="complaints" element={<ProtectedRoute allowedRoles={['TENANT']}><ComplaintsPage /></ProtectedRoute>} />
        <Route path="notices" element={<ProtectedRoute allowedRoles={['TENANT']}><NoticesPage /></ProtectedRoute>} />
        <Route path="payments" element={<ProtectedRoute allowedRoles={['TENANT']}><TenantPaymentsPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute allowedRoles={['TENANT']}><TenantProfilePage /></ProtectedRoute>} />
      </Route>
      
      {/* Tenant Password Setup Route */}
      <Route path="/signup/:token" element={<TenantPasswordSetupPage />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
