import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Home, Calendar, CheckCircle, Clock, Trash2, MapPin, FileText } from 'lucide-react';
import { BACKEND_BASE_URL } from '../api/axiosClient';

// Get the backend base URL dynamically
const getBackendUrl = () => {
  return BACKEND_BASE_URL;
};

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

interface TenantCardProps {
  tenant: Tenant;
  onDelete: (tenantId: number, tenantName: string) => void;
}

const TenantCard: React.FC<TenantCardProps> = ({ tenant, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(tenant.id, tenant.user?.name || 'Unknown');
    }, 300);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const }
    },
    hover: { 
      y: -5,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { duration: 0.2, ease: "easeOut" as const }
    },
    deleting: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3, ease: "easeInOut" as const }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isDeleting ? "deleting" : "visible"}
      whileHover="hover"
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300 relative"
    >
      {/* Header with gradient background */}
      <div className="relative h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        {/* Profile Image */}
        <div className="absolute -bottom-10 left-6">
          {tenant.photoUrl ? (
            <img
              src={`${getBackendUrl()}${tenant.photoUrl}`}
              alt={`${tenant.user?.name} profile`}
              className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iNDgiIGZpbGw9IiNGM0Y0RjYiLz4KPGNpcmNsZSBjeD0iNDgiIGN5PSI0MCIgcj0iMTYiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-500" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute -bottom-1 -right-1">
            {tenant.signupCompleted ? (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Clock className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={handleDelete}
            className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 group"
            title="Delete Tenant"
          >
            <Trash2 className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 pb-4 px-4">
        {/* Name and Status */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {tenant.user?.name || 'N/A'}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              tenant.signupCompleted 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {tenant.signupCompleted ? 'Completed' : 'Pending'}
            </span>
            {tenant.allocatedRoom?.roomNumber && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {tenant.allocatedRoom?.roomNumber}
              </span>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
              <Mail className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-xs truncate">{tenant.user?.email || 'N/A'}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
              <Phone className="w-3 h-3 text-green-600" />
            </div>
            <span className="text-xs">{tenant.phone || 'N/A'}</span>
          </div>

          {tenant.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                <MapPin className="w-3 h-3 text-orange-600" />
              </div>
              <span className="text-xs truncate">{tenant.location}</span>
            </div>
          )}
        </div>

        {/* Room Info */}
        {tenant.allocatedRoom?.roomNumber && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Home className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">Room</span>
              </div>
              <span className="text-xs font-bold text-blue-600">
                {tenant.allocatedRoom?.roomNumber}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleDelete}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-1.5 px-3 rounded-lg font-medium text-xs hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default TenantCard;
