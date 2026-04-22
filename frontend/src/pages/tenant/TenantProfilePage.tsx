import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Mail, Phone, MapPin, Calendar, Shield, 
  AlertCircle, Loader, Image as ImageIcon,
  Home, Users, DollarSign, CheckCircle
} from 'lucide-react';
import api, { BACKEND_BASE_URL } from '../../api/axiosClient';

// Get the backend base URL dynamically
const getBackendUrl = () => {
  return BACKEND_BASE_URL;
};

interface TenantProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  photoUrl?: string;
  location?: string;
  aadhaarNumber?: string;
  alternatePhone?: string;
  allocationDate?: string; // Changed from createdAt
  roomNumber?: string;
  hostelName?: string;
  rentAmount?: number;
  paymentStatus?: string;
  emergencyContact?: string;
  guardianName?: string;
  guardianPhone?: string;
}

const TenantProfilePage: React.FC = () => {
  const { name: authName, role: authRole, userId, token } = useAuth();
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      setImageError(false); // Reset image error state
      const response = await api.get('/user/profile');
      const data = response.data;
      
      // Mask sensitive data
      if (data.aadhaarNumber) {
        data.aadhaarNumber = maskAadhaar(data.aadhaarNumber);
      }
      
      setProfile(data);
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const maskAadhaar = (aadhaar: string): string => {
    if (!aadhaar) return '';
    const cleaned = aadhaar.replace(/\D/g, '');
    if (cleaned.length !== 12) return 'Invalid format';
    return `XXXX-XXXX-${cleaned.slice(-4)}`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Not available';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-green-600 to-green-700 animate-pulse"></div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row items-center -mt-16">
              <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse border-4 border-white shadow-md"></div>
              <div className="mt-4 md:mt-0 md:ml-6 space-y-3 flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Loading Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <Loader className="h-4 w-4 mr-2 animate-spin" />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Photo */}
          <div className="h-32 md:h-40 bg-gradient-to-r from-green-600 to-green-700 relative">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white">My Profile</h1>
                  <p className="text-green-100 text-sm md:text-base">View your personal information and room details</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Profile Header with Avatar */}
            {profile && (
              <div className="flex flex-col md:flex-row items-center md:items-start mb-6 relative z-10 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 -mt-8">
                <div className="relative flex-shrink-0">
                  {profile.photoUrl && !imageError ? (
                    <img
                      src={profile.photoUrl.startsWith('http') ? profile.photoUrl : `${getBackendUrl()}${profile.photoUrl}`}
                      alt="Profile"
                      className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white object-cover shadow-lg"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                      <User className="h-12 w-12 md:h-16 md:w-16 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{profile.name}</h2>
                  <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Shield className="h-3.5 w-3.5 mr-1" />
                      {profile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {profile.allocationDate && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Member since {new Date(profile.allocationDate).getFullYear()}
                      </span>
                    )}
                    {profile.paymentStatus && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(profile.paymentStatus)}`}>
                        <DollarSign className="h-3.5 w-3.5 mr-1" />
                        {profile.paymentStatus}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-center md:justify-start text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0 text-green-600" />
                      <span className="text-sm break-all">{profile.email}</span>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      {profile.phone && (
                        <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                          <Phone className="h-4 w-4 mr-1.5 flex-shrink-0 text-green-600" />
                          <span className="text-sm">{profile.phone}</span>
                        </div>
                      )}
                      {profile.roomNumber && (
                        <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                          <Home className="h-4 w-4 mr-1.5 flex-shrink-0 text-green-600" />
                          <span className="text-sm">Room {profile.roomNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="ml-3 text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Room & Accommodation Details */}
            {profile && (profile.roomNumber || profile.hostelName) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Home className="h-5 w-5 mr-2 text-green-600" />
                  Accommodation Details
                </h3>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.roomNumber && (
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Home className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Room Number</p>
                          <p className="font-semibold text-gray-900">{profile.roomNumber}</p>
                        </div>
                      </div>
                    )}
                    {profile.hostelName && (
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Hostel</p>
                          <p className="font-semibold text-gray-900">{profile.hostelName}</p>
                        </div>
                      </div>
                    )}
                    {profile.rentAmount && (
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <DollarSign className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly Rent</p>
                          <p className="font-semibold text-gray-900">₹{profile.rentAmount}</p>
                        </div>
                      </div>
                    )}
                    {profile.paymentStatus && (
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getPaymentStatusColor(profile.paymentStatus).split(' ')[0]}`}>
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Payment Status</p>
                          <p className={`font-semibold ${getPaymentStatusColor(profile.paymentStatus).split(' ')[1]}`}>
                            {profile.paymentStatus}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Sections */}
            {profile && (
              <div className="space-y-6">
                {/* Contact Information */}
                <section aria-labelledby="contact-info">
                  <div className="flex items-center justify-between mb-4">
                    <h2 id="contact-info" className="text-lg font-semibold text-gray-900 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-green-600" />
                      Contact Information
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                      <div className="flex items-start space-x-2 text-gray-900">
                        <Mail className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{profile.email}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Primary Phone</label>
                      <div className="flex items-start space-x-2 text-gray-900">
                        <Phone className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{profile.phone || 'Not provided'}</span>
                      </div>
                    </div>
                    {profile.alternatePhone && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Alternate Phone</label>
                        <div className="flex items-start space-x-2 text-gray-900">
                          <Phone className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{profile.alternatePhone}</span>
                        </div>
                      </div>
                    )}
                    {profile.emergencyContact && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Emergency Contact</label>
                        <div className="flex items-start space-x-2 text-gray-900">
                          <Phone className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{profile.emergencyContact}</span>
                        </div>
                      </div>
                    )}
                    {profile.location && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                        <div className="flex items-start space-x-2 text-gray-900">
                          <MapPin className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{profile.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Guardian Information */}
                {(profile.guardianName || profile.guardianPhone) && (
                  <section aria-labelledby="guardian-info">
                    <div className="flex items-center justify-between mb-4">
                      <h2 id="guardian-info" className="text-lg font-semibold text-gray-900 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-green-600" />
                        Guardian Information
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.guardianName && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Guardian Name</label>
                          <div className="flex items-start space-x-2 text-gray-900">
                            <User className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{profile.guardianName}</span>
                          </div>
                        </div>
                      )}
                      {profile.guardianPhone && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Guardian Phone</label>
                          <div className="flex items-start space-x-2 text-gray-900">
                            <Phone className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{profile.guardianPhone}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Account Information */}
                <section aria-labelledby="account-info">
                  <div className="flex items-center justify-between mb-4">
                    <h2 id="account-info" className="text-lg font-semibold text-gray-900 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      Account Information
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Account Role</label>
                      <div className="flex items-start space-x-2 text-gray-900">
                        <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="capitalize">
                          {profile.role.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Member Since</label>
                      <div className="flex items-start space-x-2 text-gray-900">
                        <Calendar className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{formatDate(profile.allocationDate)}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Identification (Only show if exists) */}
                {profile.aadhaarNumber && (
                  <section aria-labelledby="id-info">
                    <div className="flex items-center justify-between mb-4">
                      <h2 id="id-info" className="text-lg font-semibold text-gray-900 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-green-600" />
                        Identification
                      </h2>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Aadhaar Number</label>
                      <div className="flex items-start space-x-2 text-gray-900">
                        <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="font-mono tracking-wider">{profile.aadhaarNumber}</span>
                      </div>
                      <p className="mt-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded-md flex items-start">
                        <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span>For security reasons, only the last 4 digits are visible</span>
                      </p>
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* Action Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
              <button
                onClick={fetchProfile}
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Profile
              </button>
            </div>
          </div>
        </div>
        
        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500 max-w-4xl mx-auto">
          <p className="flex items-center justify-center">
            <Shield className="h-3 w-3 mr-1" />
            Your personal information is securely stored and never shared with third parties
          </p>
        </div>
      </div>
    </div>
  );
};

export default TenantProfilePage;
