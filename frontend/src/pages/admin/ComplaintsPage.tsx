import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

interface Complaint {
  id: number;
  tenantId?: number;
  tenantName?: string;
  roomNumber?: string;
  title: string;
  description: string;
  status: string;
  adminResponse?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

const ComplaintsPage: React.FC = () => {
  const { role, userId } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resolvingComplaint, setResolvingComplaint] = useState<number | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    try {
      if (role === 'ADMIN' || role === 'OWNER') {
        const res = await api.get<Complaint[]>('/complaints');
        setComplaints(res.data);
      } else if (role === 'TENANT' && userId) {
        const res = await api.get<Complaint[]>(`/complaints/my/${userId}`);
        setComplaints(res.data);
      }
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setLoading(false);
    }
  }, [role, userId]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const submitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setSubmitting(true);
    try {
      await api.post(`/complaints/tenant/${userId}`, { title, description });
      setTitle('');
      setDescription('');
      loadComplaints();
    } catch (error) {
      console.error('Failed to submit complaint:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openResolveModal = (complaintId: number) => {
    setResolvingComplaint(complaintId);
    setAdminResponse('');
    setShowResolveModal(true);
  };

  const closeResolveModal = () => {
    setShowResolveModal(false);
    setResolvingComplaint(null);
    setAdminResponse('');
  };

  const resolveComplaint = async () => {
    if (!resolvingComplaint || !adminResponse.trim()) return;
    
    try {
      await api.put(`/complaints/${resolvingComplaint}/resolve`, { 
        adminResponse: adminResponse.trim() 
      });
      closeResolveModal();
      loadComplaints();
    } catch (error) {
      console.error('Failed to resolve complaint:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return '📋';
      case 'IN_PROGRESS': return '🔄';
      case 'RESOLVED': return '✅';
      case 'CLOSED': return '🔒';
      default: return '❓';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN': return 'Open';
      case 'IN_PROGRESS': return 'In Progress';
      case 'RESOLVED': return 'Resolved';
      case 'CLOSED': return 'Closed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Complaints & Support</h1>
              <p className="text-orange-100">We're here to help resolve your concerns</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-100">{complaints.length}</div>
              <div className="text-sm text-orange-200">Total Complaints</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Complaint Form for Tenants */}
        {role === 'TENANT' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="bg-orange-100 rounded-full p-3 mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">File a New Complaint</h2>
                <p className="text-gray-600">Let us know about any issues you're facing</p>
              </div>
            </div>

            <form onSubmit={submitComplaint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Brief description of the issue..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="Please provide more details about your complaint..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Complaints List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {(role === 'ADMIN' || role === 'OWNER') ? 'All Complaints' : 'My Complaints'}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                {complaints.filter(c => c.status === 'OPEN').length} open
              </div>
              <div className="text-sm text-gray-500">•</div>
              <div className="text-sm text-gray-500">
                {complaints.filter(c => c.status === 'RESOLVED').length} resolved
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <div className="text-gray-600">Loading complaints...</div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <div className="text-xl font-medium text-gray-900 mb-2">No complaints yet</div>
              <div className="text-gray-600">
                {role === 'TENANT' 
                  ? "File your first complaint using the form above"
                  : "No complaints have been submitted yet"
                }
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-orange-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{complaint.title}</h3>
                      <p className="text-gray-600 mb-3">{complaint.description}</p>
                      
                      {/* Show admin response for resolved complaints */}
                      {complaint.adminResponse && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <div className="flex items-start space-x-2">
                            <span className="text-green-600 mt-1">✅</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-800 mb-1">Admin Response:</p>
                              <p className="text-sm text-green-700">{complaint.adminResponse}</p>
                              {complaint.resolvedBy && (
                                <p className="text-xs text-green-600 mt-2">
                                  Resolved by {complaint.resolvedBy} 
                                  {complaint.resolvedAt && ` on ${new Date(complaint.resolvedAt).toLocaleDateString()}`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {(role === 'ADMIN' || role === 'OWNER') && (
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {complaint.tenantName && (
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>{complaint.tenantName}</span>
                            </div>
                          )}
                          {complaint.roomNumber && (
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <span>{complaint.roomNumber}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(complaint.status)}`}>
                        <span>{getStatusIcon(complaint.status)}</span>
                        <span>{getStatusText(complaint.status)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Complaint ID: #{complaint.id}
                    </div>
                    {(role === 'ADMIN' || role === 'OWNER') && complaint.status === 'OPEN' && (
                      <button 
                        onClick={() => openResolveModal(complaint.id)}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors"
                      >
                        Take Action →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{complaints.filter(c => c.status === 'OPEN').length}</div>
                <div className="text-sm text-gray-600">Open Complaints</div>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <span className="text-2xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{complaints.filter(c => c.status === 'IN_PROGRESS').length}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <span className="text-2xl">🔄</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{complaints.filter(c => c.status === 'RESOLVED').length}</div>
                <div className="text-sm text-gray-600">Resolved</div>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Resolve Complaint</h3>
            <p className="text-gray-600 mb-4">Provide your response to resolve this complaint:</p>
            
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Enter your response..."
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              rows={4}
              required
            />
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeResolveModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={resolveComplaint}
                disabled={!adminResponse.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl transition-colors"
              >
                Resolve Complaint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;

