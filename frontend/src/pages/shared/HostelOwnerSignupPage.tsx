import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Mail, Phone, User, Check, X, Eye, EyeOff,
  ArrowRight, ArrowLeft, Shield, Zap, Clock, Star, MapPin,
  CheckCircle, Users, TrendingUp, Lock
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const getApiUrl = () => process.env.REACT_APP_API_BASE_URL || 'https://pghostelmanagement.onrender.com/api';

interface SignupData {
  ownerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  hostelName: string;
  hostelAddress: string;
  hostelPhone: string;
  hostelEmail: string;
}

interface FormErrors {
  ownerName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  hostelName?: string;
  hostelAddress?: string;
  hostelPhone?: string;
  hostelEmail?: string;
  general?: string;
}

type FormField = keyof FormErrors;

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, error, icon, trailing }: any) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full ${icon ? 'pl-9' : 'pl-3'} ${trailing ? 'pr-10' : 'pr-3'} py-2.5 border rounded-xl text-sm transition-all focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white'}`} />
      {trailing && <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>}
    </div>
    {error && <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1"><X className="w-3 h-3" />{error}</p>}
  </div>
);

const HostelOwnerSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [formData, setFormData] = useState<SignupData>({
    ownerName: '', email: '', password: '', confirmPassword: '',
    hostelName: '', hostelAddress: '', hostelPhone: '', hostelEmail: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const calcPasswordStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length >= 6) s++;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const validateStep = (s: number): boolean => {
    const newErrors: FormErrors = {};
    if (s === 0) {
      if (!formData.ownerName.trim()) newErrors.ownerName = 'Required';
      else if (formData.ownerName.length < 2) newErrors.ownerName = 'At least 2 characters';
      if (!formData.email.trim()) newErrors.email = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.password) newErrors.password = 'Required';
      else if (formData.password.length < 6) newErrors.password = 'At least 6 characters';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Required';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords don\'t match';
    }
    if (s === 1) {
      if (!formData.hostelName.trim()) newErrors.hostelName = 'Required';
      else if (formData.hostelName.length < 2) newErrors.hostelName = 'At least 2 characters';
      if (!formData.hostelAddress.trim()) newErrors.hostelAddress = 'Required';
      else if (formData.hostelAddress.length < 10) newErrors.hostelAddress = 'At least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailAvailable(null); return; }
    setEmailCheckLoading(true);
    try {
      const response = await axios.get(`${getApiUrl()}/hostel-signup/check-email/${email}`);
      setEmailAvailable(response.data);
    } catch { setEmailAvailable(null); }
    finally { setEmailCheckLoading(false); }
  };

  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) checkEmailAvailability(email);
    else setEmailAvailable(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1)) return;
    if (emailAvailable === false) { setErrors({ general: 'Email already registered' }); return; }
    setIsLoading(true); setErrors({});
    try {
      const response = await axios.post(`${getApiUrl()}/hostel-signup`, {
        ownerName: formData.ownerName, email: formData.email, password: formData.password,
        hostelName: formData.hostelName, hostelAddress: formData.hostelAddress,
        hostelPhone: formData.hostelPhone || undefined, hostelEmail: formData.hostelEmail || undefined
      });
      login({
        token: response.data.token, role: response.data.role, userId: response.data.userId,
        name: response.data.name, hostelId: response.data.hostelId,
        hostelName: response.data.hostelName, isSetupComplete: response.data.isSetupComplete
      });
      navigate('/admin/dashboard');
    } catch (error: any) {
      setErrors({ general: error.response?.data?.message || 'Registration failed. Please try again.' });
    } finally { setIsLoading(false); }
  };

  const handleInputChange = (field: FormField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'password') setPasswordStrength(calcPasswordStrength(value));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (errors.general) setErrors(prev => ({ ...prev, general: undefined }));
  };

  const nextStep = () => { if (validateStep(step)) setStep(1); };
  const prevStep = () => setStep(0);

  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-emerald-400'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const stepNames = ['Your Account', 'PG Details'];



  return (
    <div className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">

        {/* ═══ LEFT — Marketing Panel ═══ */}
        <div className="hidden lg:flex flex-col justify-between bg-hero-gradient relative overflow-hidden p-10 pt-28">
          <div className="absolute inset-0 dot-pattern opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-semibold text-lg text-white" style={{fontFamily: 'santhoshi, sans-serif'}}>PG Manager <span className="text-brand-200">Pro</span></span>
            </div>

            <h2 className="font-heading text-3xl font-semibold text-white mb-3 leading-tight" style={{fontFamily: 'santhoshi, sans-serif'}}>
              Set up your PG in<br />5 minutes flat.
            </h2>
            <p className="text-sm text-slate-300 max-w-sm mb-8">
              150+ PG owners already made the switch. Free for 14 days, no credit card required.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {[
                { icon: <Zap className="w-4 h-4" />, text: '5-minute setup — no tech skills needed' },
                { icon: <Users className="w-4 h-4" />, text: 'Manage unlimited tenants from day one' },
                { icon: <TrendingUp className="w-4 h-4" />, text: 'Automated rent collection & tracking' },
                { icon: <Shield className="w-4 h-4" />, text: 'Bank-level security for your data' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2.5 border border-white/5">
                  <div className="text-brand-300">{f.icon}</div>
                  <span className="text-sm text-white/90">{f.text}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
              <div className="flex gap-0.5 mb-2">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}</div>
              <p className="text-sm text-white/80 italic mb-2">"Signed up, added my PG, uploaded tenants — all done in one evening. Wish I'd found this years ago."</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center text-[9px] font-semibold text-white">RK</div>
                <div>
                  <div className="text-xs font-semibold text-white">Ramesh Kumar</div>
                  <div className="text-[10px] text-slate-400">Sri Venkateswara PG, HITEC City</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="relative z-10 grid grid-cols-3 gap-3 mt-6">
            {[
              { num: '150+', label: 'PGs Active' },
              { num: '5,000+', label: 'Tenants' },
              { num: '99%', label: 'Uptime' },
            ].map((s, i) => (
              <div key={i} className="text-center bg-white/5 rounded-lg px-2 py-2.5 border border-white/5">
                <div className="text-lg font-heading font-semibold text-white" style={{fontFamily: 'santhoshi, sans-serif'}}>{s.num}</div>
                <div className="text-[10px] text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ RIGHT — Form Panel ═══ */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 pt-24 lg:pt-10">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-2 rounded-xl">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-semibold text-lg text-gray-900" style={{fontFamily: 'santhoshi, sans-serif'}}>PG Manager <span className="text-gradient-brand">Pro</span></span>
            </div>
            <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-1" style={{fontFamily: 'santhoshi, sans-serif'}}>Create your PG</h1>
            <p className="text-xs text-gray-500">Free for 14 days · No credit card</p>
          </div>

          <div className="max-w-md mx-auto w-full">
            {/* Desktop heading */}
            <div className="hidden lg:block mb-6">
              <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-1" style={{fontFamily: 'santhoshi, sans-serif'}}>Create your account</h1>
              <p className="text-sm text-gray-500">Start managing your PG in minutes</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              {stepNames.map((name, i) => (
                <React.Fragment key={i}>
                  <button onClick={() => i < step && setStep(i)} className={`flex items-center gap-1.5 ${i <= step ? 'text-brand-600' : 'text-gray-400'}`}>
                    <div className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${i < step ? 'bg-brand-500 text-white' : i === step ? 'bg-brand-100 text-brand-700 ring-2 ring-brand-200' : 'bg-gray-100 text-gray-400'}`}>
                      {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className="text-xs font-medium">{name}</span>
                  </button>
                  {i < 1 && <div className={`flex-1 h-px ${i < step ? 'bg-brand-400' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* ── Step 1: Account ── */}
                {step === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-3.5">
                    <InputField label="Full Name *" name="ownerName" value={formData.ownerName} onChange={handleInputChange('ownerName')}
                      placeholder="Your name" error={errors.ownerName} icon={<User className="w-4 h-4" />} />

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail className="w-4 h-4" /></div>
                        <input type="email" value={formData.email} onChange={(e) => handleEmailChange(e.target.value)} placeholder="you@email.com"
                          className={`w-full pl-9 pr-10 py-2.5 border rounded-xl text-sm transition-all focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 ${errors.email || emailAvailable === false ? 'border-red-300 bg-red-50/50' : emailAvailable === true ? 'border-emerald-300 bg-emerald-50/30' : 'border-gray-200'}`} />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {emailCheckLoading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-brand-500 border-t-transparent" /> :
                            emailAvailable === true ? <CheckCircle className="w-4 h-4 text-emerald-500" /> :
                            emailAvailable === false ? <X className="w-4 h-4 text-red-500" /> : null}
                        </div>
                      </div>
                      {errors.email && <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1"><X className="w-3 h-3" />{errors.email}</p>}
                      {emailAvailable === false && <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1"><X className="w-3 h-3" />Email already registered</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Password *</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock className="w-4 h-4" /></div>
                        <input type={showPassword ? 'text' : 'password'} value={formData.password}
                          onChange={handleInputChange('password')} placeholder="Min. 6 characters"
                          className={`w-full pl-9 pr-10 py-2.5 border rounded-xl text-sm transition-all focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 ${errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="mt-1.5">
                          <div className="flex gap-1 mb-0.5">{[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'}`} />
                          ))}</div>
                          <span className={`text-[10px] font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                            {strengthLabels[passwordStrength - 1] || 'Too short'}
                          </span>
                        </div>
                      )}
                      {errors.password && <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1"><X className="w-3 h-3" />{errors.password}</p>}
                    </div>

                    <InputField label="Confirm Password *" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                      value={formData.confirmPassword} onChange={handleInputChange('confirmPassword')} placeholder="Re-enter password"
                      error={errors.confirmPassword} icon={<Lock className="w-4 h-4" />}
                      trailing={<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} />

                    <button type="button" onClick={nextStep}
                      className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:from-brand-700 hover:to-brand-600 transition-all flex items-center justify-center mt-2">
                      Continue <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* ── Step 2: PG Details ── */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-3.5">
                    <InputField label="PG / Hostel Name *" name="hostelName" value={formData.hostelName} onChange={handleInputChange('hostelName')}
                      placeholder="e.g., Sai Krishna PG" error={errors.hostelName} icon={<Building2 className="w-4 h-4" />} />

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">PG Address *</label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400"><MapPin className="w-4 h-4" /></div>
                        <textarea value={formData.hostelAddress} onChange={handleInputChange('hostelAddress')} rows={2}
                          placeholder="Full address including pin code"
                          className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm transition-all focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 resize-none ${errors.hostelAddress ? 'border-red-300 bg-red-50/50' : 'border-gray-200'}`} />
                      </div>
                      {errors.hostelAddress && <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1"><X className="w-3 h-3" />{errors.hostelAddress}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <InputField label="PG Phone" type="tel" name="hostelPhone" value={formData.hostelPhone} onChange={handleInputChange('hostelPhone')}
                        placeholder="+91 98765 43210" icon={<Phone className="w-4 h-4" />} />
                      <InputField label="PG Email" type="email" name="hostelEmail" value={formData.hostelEmail} onChange={handleInputChange('hostelEmail')}
                        placeholder="pg@email.com" icon={<Mail className="w-4 h-4" />} />
                    </div>

                    {errors.general && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                        <X className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-xs text-red-600">{errors.general}</p>
                      </div>
                    )}

                    <div className="flex gap-3 mt-2">
                      <button type="button" onClick={prevStep}
                        className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back
                      </button>
                      <button type="submit" disabled={isLoading || emailAvailable === false}
                        className="flex-1 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:from-brand-700 hover:to-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading ? (
                          <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />Creating...</>
                        ) : (
                          <>Create PG <ArrowRight className="ml-2 w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  Already have a PG? <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold">Sign in</Link>
                </p>
              </div>

              {/* Trust */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL Encrypted</span>
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> GDPR Ready</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 14-day trial</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelOwnerSignupPage;
