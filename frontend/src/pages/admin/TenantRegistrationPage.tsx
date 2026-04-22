import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Camera, 
  Upload, 
  Calendar,
  Home,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  UserPlus
} from 'lucide-react';
import api from '../../api/axiosClient';

const TenantRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    location: '',
    aadhaarNumber: '',
    photoFile: null as File | null,
    allottedRoomNumber: '',
    joinDate: new Date().toISOString().split('T')[0], // Default to today's date
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stopCamera = useCallback(() => {
    setStream((current) => {
      if (current) {
        current.getTracks().forEach((track) => track.stop());
      }
      return null;
    });
    setShowCamera(false);
  }, []);

  useEffect(() => {
    return stopCamera;
  }, [stopCamera]);

  useEffect(() => {
    if (showCamera && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [showCamera, stream]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photoFile: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      // Wait a bit for the video element to be ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(err => {
            console.error('Video play error:', err);
            setError('Failed to start video preview');
          });
        }
      }, 100);
      
    } catch (err) {
      setError('Failed to access camera. Please check camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'tenant-photo.jpg', { type: 'image/jpeg' });
            setFormData(prev => ({
              ...prev,
              photoFile: file
            }));
            
            const reader = new FileReader();
            reader.onload = (e) => {
              setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
          } else {
            setError('Failed to capture photo. Please try again.');
          }
        }, 'image/jpeg', 0.8);
      }
      stopCamera();
    } else {
      setError('Camera not ready. Please wait a moment and try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('alternatePhone', formData.alternatePhone);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('aadhaarNumber', formData.aadhaarNumber);
      formDataToSend.append('allottedRoomNumber', formData.allottedRoomNumber);
      formDataToSend.append('joinDate', formData.joinDate);

      if (formData.photoFile) {
        formDataToSend.append('photo', formData.photoFile);
      }

      const response = await api.post('/admin/tenants/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const backendMessage = response.data?.message;
      setSuccess(backendMessage || 'Tenant registered successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        alternatePhone: '',
        location: '',
        aadhaarNumber: '',
        photoFile: null,
        allottedRoomNumber: '',
        joinDate: new Date().toISOString().split('T')[0],
      });
      setPreviewImage(null);
    } catch (err: any) {
      // Backend sends errors in "message" field; fall back to generic message
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      setError(backendMessage || 'Failed to register tenant');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-brand-500';
  const labelClasses = 'block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500';

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-sm">
            <UserPlus className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Register tenant</h2>
            <p className="text-sm text-slate-500">Add a tenant and send the signup email</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </button>
      </div>

      {(error || success) && (
        <div className="space-y-3">
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <User className="h-4 w-4 text-slate-600" />
                    Personal Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={labelClasses}>Full name *</label>
                      <input
                        className={inputClasses}
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter tenant's full name"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Email *</label>
                      <input
                        className={inputClasses}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tenant@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Phone *</label>
                      <input
                        className={inputClasses}
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        pattern="[6-9][0-9]{9}"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Alternate phone</label>
                      <input
                        className={inputClasses}
                        name="alternatePhone"
                        type="tel"
                        value={formData.alternatePhone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        pattern="[6-9][0-9]{9}"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <FileText className="h-4 w-4 text-slate-600" />
                    Additional Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={labelClasses}>Location *</label>
                      <input
                        className={inputClasses}
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, State"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Aadhaar number *</label>
                      <input
                        className={inputClasses}
                        name="aadhaarNumber"
                        type="text"
                        value={formData.aadhaarNumber}
                        onChange={handleChange}
                        placeholder="123456789012"
                        pattern="[0-9]{12}"
                        maxLength={12}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Allotted room number *</label>
                      <input
                        className={inputClasses}
                        name="allottedRoomNumber"
                        type="text"
                        value={formData.allottedRoomNumber}
                        onChange={handleChange}
                        placeholder="e.g., HPG-S101"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Join date *</label>
                      <input
                        className={inputClasses}
                        name="joinDate"
                        type="date"
                        value={formData.joinDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Camera className="h-4 w-4 text-slate-600" />
                Tenant photo *
              </h3>
              
              {!showCamera ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <Camera className="h-5 w-5" />
                      Take Photo
                    </button>
                    
                    <label
                      className="flex-1 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Upload className="h-5 w-5" />
                      Upload File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        required={!formData.photoFile}
                      />
                    </label>
                  </div>
                  
                  {previewImage && (
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-xl border border-slate-200"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">Photo selected</p>
                        <p className="text-xs text-slate-500">Remove to choose a different photo.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData(prev => ({ ...prev, photoFile: null }));
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-2xl overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full max-w-2xl mx-auto rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <Camera className="h-5 w-5" />
                      Capture Photo
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <X className="h-5 w-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-brand-600 px-6 py-4 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Registering tenant…
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Register Tenant & Send Signup Email
                  </>
                )}
              </button>
            </div>
          </div>
      </form>
    </div>
  );
};

export default TenantRegistrationPage;
