import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, Send, ArrowRight,
  CheckCircle, MessageSquare, Calendar, Headphones,
  Zap, Building2, HelpCircle
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeChannel, setActiveChannel] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const fadeUp = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

  const channels = [
    {
      icon: <MessageSquare className="w-5 h-5" />, title: 'Live Chat', desc: 'Get answers in real-time during business hours. Average response: 2 minutes.',
      action: 'Start Chat', gradient: 'from-blue-500 to-cyan-400',
      details: ['Available Mon-Sat, 9AM-6PM', 'Avg response: 2 minutes', 'Best for quick questions'],
    },
    {
      icon: <Mail className="w-5 h-5" />, title: 'Email Support', desc: 'Detailed questions? Write to us and we\'ll respond within 4 hours.',
      action: 'hello@pgmanagerpro.com', gradient: 'from-purple-500 to-pink-400',
      details: ['Available 24/7', 'Response within 4 hours', 'Best for detailed inquiries'],
    },
    {
      icon: <Phone className="w-5 h-5" />, title: 'Phone', desc: 'Speak directly with our team. No IVR, no waiting — real humans.',
      action: '+91 80109 42551', gradient: 'from-emerald-500 to-teal-400',
      details: ['Mon-Sat, 9AM-6PM', 'No hold music', 'Best for urgent issues'],
    },
    {
      icon: <Calendar className="w-5 h-5" />, title: 'Book a Meeting', desc: 'Schedule a dedicated 30-min slot with a product specialist.',
      action: 'Book Slot', gradient: 'from-amber-500 to-orange-400',
      details: ['Choose your time', '30-min session', 'Best for demos & onboarding'],
    },
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
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-2">Message received!</h2>
          <p className="text-sm text-gray-500 mb-2">We'll respond within 4 hours.</p>
          <p className="text-xs text-gray-400 mb-5">Check your email for a confirmation.</p>
          <button onClick={() => setSubmitted(false)} className="text-sm text-brand-600 font-semibold hover:text-brand-700">Send Another</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ HERO ═══ */}
      <section className="pt-28 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-4">
              <Headphones className="w-3 h-3 mr-1" /> Support
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              Talk to real humans.<br />
              <span className="text-gradient-brand">Not bots.</span>
            </h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Our India-based team responds in minutes, not days. Choose your preferred channel below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CHANNEL SELECTOR ═══ */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {channels.map((ch, i) => (
              <button key={i} onClick={() => setActiveChannel(i)}
                className={`p-4 rounded-xl text-left transition-all border ${activeChannel === i ? 'bg-white border-brand-200 shadow-md' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${ch.gradient} flex items-center justify-center text-white mb-2.5 shadow-sm ${activeChannel === i ? 'scale-110' : ''} transition-transform`}>{ch.icon}</div>
                <h3 className={`text-sm font-bold ${activeChannel === i ? 'text-brand-700' : 'text-gray-900'}`}>{ch.title}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">{ch.action}</p>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeChannel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              className="bg-surface-50 rounded-xl border border-gray-100 p-5">
              <div className="grid sm:grid-cols-3 gap-3">
                {channels[activeChannel].details.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-xs text-gray-600">{d}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ FORM + MAP ═══ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-heading text-lg font-bold text-gray-900 mb-1">Drop us a line</h2>
              <p className="text-xs text-gray-400 mb-4">We'll get back within 4 hours during business days.</p>
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@company.com"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">I need help with *</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
                      <option value="">Choose topic</option>
                      <option value="demo">Booking a demo</option>
                      <option value="pricing">Understanding pricing</option>
                      <option value="setup">Setting up my PG</option>
                      <option value="migration">Migrating existing data</option>
                      <option value="bug">Reporting a bug</option>
                      <option value="other">Something else</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows={3} placeholder="Tell us how we can help..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all resize-none" />
                </div>
                <button type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold rounded-xl hover:from-brand-700 hover:to-brand-600 shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center">
                  Send Message <Send className="ml-2 w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-heading text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-brand-500" /> Office Hours</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-600">Monday — Friday</span><span className="font-medium text-gray-900">9AM — 6PM</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Saturday</span><span className="font-medium text-gray-900">10AM — 4PM</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Sunday</span><span className="text-gray-400">Closed</span></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white">
              <MapPin className="w-5 h-5 text-brand-400 mb-2" />
              <h3 className="text-sm font-heading font-bold mb-1">Hyderabad HQ</h3>
              <p className="text-xs text-slate-400 mb-3">HITEC City, Hyderabad<br />Telangana 500081, India</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-300"><Phone className="w-3 h-3" /> +91 80109 42551</span>
              </div>
            </div>

            <div className="bg-brand-50 rounded-xl p-5 border border-brand-100">
              <h3 className="text-sm font-heading font-bold text-brand-800 mb-1">🎁 Enterprise?</h3>
              <p className="text-xs text-brand-600 mb-3">Managing 100+ tenants? Get priority setup, dedicated support, and custom pricing.</p>
              <Link to="/demo" className="inline-flex items-center text-xs font-semibold text-brand-700 hover:text-brand-800">
                Book a call <ArrowRight className="ml-1 w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ QUICK ═══ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center mb-8">
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-1">Quick answers</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { q: 'How fast do you respond?', a: 'Live chat: 2 min. Email: 4 hours. Phone: instant during business hours.' },
              { q: 'Do you offer on-site setup?', a: 'Yes, for Business and Enterprise plans in Hyderabad. Remote setup for all plans.' },
              { q: 'Can you migrate my data?', a: 'Absolutely. We handle the entire migration from Excel, registers, or any other system.' },
              { q: 'Is there a self-help resource?', a: 'Yes — our help center has 50+ guides, video tutorials, and FAQs.' },
            ].map((f, i) => (
              <div key={i} className="bg-surface-50 rounded-xl p-4 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-1 flex items-start gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />{f.q}</h4>
                <p className="text-[10px] text-gray-500 ml-5">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
