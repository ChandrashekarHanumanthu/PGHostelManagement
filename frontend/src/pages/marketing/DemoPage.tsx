import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, User, Phone, Mail, MapPin, Calendar, Clock,
  CheckCircle, ArrowRight, Users, Star, MessageSquare, Sparkles,
  Zap, Shield, Play, BarChart3, CreditCard, Bell, Eye
} from 'lucide-react';

const DemoPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', pgName: '', location: '', tenantsCount: '', preferredDate: '', preferredTime: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(0); // 0=info, 1=pg-details, 2=schedule

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };
  const nextStep = () => setStep(s => Math.min(s + 1, 2));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const fadeUp = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

  /* ── Product Tour Preview Screens ── */
  const tourScreens = [
    { title: 'Dashboard Overview', desc: 'See occupancy, revenue, and alerts at a glance', icon: <BarChart3 className="w-4 h-4" />, color: 'from-blue-500 to-cyan-400' },
    { title: 'Tenant Onboarding', desc: 'Watch a new tenant register in under 2 minutes', icon: <Users className="w-4 h-4" />, color: 'from-purple-500 to-pink-400' },
    { title: 'Payment Collection', desc: 'See how rent gets auto-collected and tracked', icon: <CreditCard className="w-4 h-4" />, color: 'from-emerald-500 to-teal-400' },
    { title: 'Complaint Resolution', desc: 'Full lifecycle: tenant raises → staff resolves → owner audits', icon: <MessageSquare className="w-4 h-4" />, color: 'from-amber-500 to-orange-400' },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl border border-gray-100 shadow-lg p-8 max-w-sm w-full text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
            className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-emerald-600" />
          </motion.div>
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-2">You're all set!</h2>
          <p className="text-sm text-gray-500 mb-4">We'll confirm your demo within 2 hours.</p>
          <div className="bg-surface-50 rounded-lg p-4 mb-5 text-left space-y-2">
            {['Confirmation email is on its way', 'Our team will call to confirm timing', 'You\'ll get a personalized 30-min walkthrough'].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{s}</div>
            ))}
          </div>
          <button onClick={() => { setSubmitted(false); setStep(0); }} className="text-sm text-brand-600 font-semibold hover:text-brand-700">Book Another Demo</button>
        </motion.div>
      </div>
    );
  }

  const stepNames = ['Your Info', 'PG Details', 'Schedule'];

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ HERO ═══ */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-4">
              <Play className="w-3 h-3 mr-1" /> Product Demo
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              30 minutes that'll save you<br />
              <span className="text-gradient-brand">30 hours every month.</span>
            </h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto mb-6">
              Get a personalized walkthrough. See your exact use case — not a generic sales pitch. No commitment.
            </p>
            <div className="inline-flex items-center gap-4 bg-surface-50 rounded-xl px-5 py-2.5 border border-gray-100 text-xs text-gray-600">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-500" /> 30 min</span>
              <span className="w-px h-3 bg-gray-200" />
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-brand-500" /> 1-on-1</span>
              <span className="w-px h-3 bg-gray-200" />
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-brand-500" /> Free</span>
              <span className="w-px h-3 bg-gray-200" />
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-brand-500" /> No obligation</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ PRODUCT TOUR PREVIEW ═══ */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center mb-6">
            <h2 className="font-heading text-lg font-bold text-gray-900">Here's what we'll cover</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {tourScreens.map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.3, delay: i * 0.06 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm card-hover text-center">
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} text-white mb-2 shadow-sm`}>{s.icon}</div>
                <h3 className="text-xs font-bold text-gray-900 mb-0.5">{s.title}</h3>
                <p className="text-[10px] text-gray-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MULTI-STEP FORM + SOCIAL PROOF ═══ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-6">

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-5">
                {stepNames.map((name, i) => (
                  <React.Fragment key={i}>
                    <div className={`flex items-center gap-1.5 ${i <= step ? 'text-brand-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${i < step ? 'bg-brand-500 text-white' : i === step ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-400'}`}>{i < step ? '✓' : i + 1}</div>
                      <span className="text-[10px] font-semibold hidden sm:inline">{name}</span>
                    </div>
                    {i < 2 && <div className={`flex-1 h-px ${i < step ? 'bg-brand-400' : 'bg-gray-200'}`} />}
                  </React.Fragment>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-3.5">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">Tell us about you</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div><label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" /></div>
                        <div><label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@email.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" /></div>
                      </div>
                      <div><label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" /></div>
                      <button type="button" onClick={nextStep} className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center">
                        Next: PG Details <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-3.5">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">About your PG</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div><label className="block text-xs font-medium text-gray-700 mb-1">PG Name *</label>
                          <input type="text" name="pgName" value={formData.pgName} onChange={handleChange} required placeholder="Your PG name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" /></div>
                        <div><label className="block text-xs font-medium text-gray-700 mb-1">Location *</label>
                          <select name="location" value={formData.location} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
                            <option value="">Select area</option>
                            {['HITEC City', 'Gachibowli', 'Kondapur', 'Kukatpally', 'Banjara Hills', 'Secunderabad', 'Miyapur', 'Other'].map(a => <option key={a} value={a}>{a}</option>)}
                          </select></div>
                      </div>
                      <div><label className="block text-xs font-medium text-gray-700 mb-1">Number of Tenants *</label>
                        <select name="tenantsCount" value={formData.tenantsCount} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
                          <option value="">Select range</option>
                          {['1-10', '11-25', '26-50', '51-100', '100+'].map(r => <option key={r} value={r}>{r} tenants</option>)}
                        </select></div>
                      <div className="flex gap-3">
                        <button type="button" onClick={prevStep} className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">Back</button>
                        <button type="button" onClick={nextStep} className="flex-1 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center">
                          Next: Schedule <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-3.5">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">Pick your slot</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div><label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
                          <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" /></div>
                        <div><label className="block text-xs font-medium text-gray-700 mb-1">Time *</label>
                          <select name="preferredTime" value={formData.preferredTime} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
                            <option value="">Select time</option>
                            {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
                          </select></div>
                      </div>
                      <div><label className="block text-xs font-medium text-gray-700 mb-1">Anything specific you want to see?</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} rows={2} placeholder="Optional — we'll customize the demo" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all resize-none" /></div>
                      <div className="flex gap-3">
                        <button type="button" onClick={prevStep} className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">Back</button>
                        <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center">
                          Confirm Demo <CheckCircle className="ml-2 w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-[10px] text-gray-400 text-center mt-3">Free · No obligation · Takes 60 seconds</p>
              </form>
            </div>
          </div>

          {/* Social Proof */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {['RK', 'PS', 'MA'].map((init, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-amber-500 to-orange-500'][i]} border-2 border-white flex items-center justify-center`}>
                      <span className="text-[8px] font-bold text-white">{init}</span>
                    </div>
                  ))}
                </div>
                <span className="text-xs text-gray-500">150+ PGs have taken this demo</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Ramesh K.', pg: 'Sri Venkateswara PG', text: 'The demo showed exactly how to solve my tenant tracking headache. Signed up the same day.', location: 'HITEC City' },
                  { name: 'Sunita R.', pg: 'Ladies Paradise PG', text: 'I expected a sales pitch but got a genuine consultation. They understood my challenges.', location: 'Gachibowli' },
                  { name: 'Naveen P.', pg: 'Green Valley Hostel', text: 'Best 30 min I spent all year. They migrated my Excel data for free during the call.', location: 'Kondapur' },
                ].map((t, i) => (
                  <div key={i} className="bg-surface-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex gap-0.5 mb-1">{[...Array(5)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />)}</div>
                    <p className="text-[10px] text-gray-600 italic mb-1.5">"{t.text}"</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-700">{t.name}</span>
                      <span className="text-[9px] text-gray-400">{t.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-500 to-purple-500 rounded-xl p-5 text-white">
              <Zap className="w-5 h-5 mb-2" />
              <h3 className="text-sm font-heading font-bold mb-1">Can't wait for a demo?</h3>
              <p className="text-xs text-white/80 mb-3">Start a free trial right now and explore on your own.</p>
              <Link to="/hostel-signup" className="inline-flex items-center text-xs font-bold bg-white text-brand-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all">
                Start Free Trial <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;
