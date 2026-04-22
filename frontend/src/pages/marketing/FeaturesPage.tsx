import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Shield, Building2, CreditCard, MessageSquare, BarChart3,
  ArrowRight, CheckCircle, Zap, Clock, Bell, FileText, Smartphone,
  Lock, TrendingUp, Settings, Eye, Layers, RefreshCw, Sparkles
} from 'lucide-react';

const FeaturesPage = () => {
  const [activePillar, setActivePillar] = useState(0);
  const [beforeAfter, setBeforeAfter] = useState<'before' | 'after'>('after');

  /* ── Feature Pillars with deep-dive content ── */
  const pillars = [
    {
      icon: <Users className="w-5 h-5" />, label: 'Tenants', gradient: 'from-blue-500 to-cyan-400',
      headline: 'Complete Tenant Lifecycle',
      subline: 'From the first inquiry to checkout — every touchpoint automated.',
      capabilities: [
        { icon: <Sparkles className="w-4 h-4" />, name: 'Digital Onboarding', detail: 'Tenants self-register via a link. Aadhaar is auto-verified. Room is auto-assigned based on availability and preference.' },
        { icon: <FileText className="w-4 h-4" />, name: 'Smart Documents', detail: 'Rental agreements auto-generated with e-sign. ID proofs stored encrypted. Zero paperwork.' },
        { icon: <Bell className="w-4 h-4" />, name: 'Lifecycle Alerts', detail: 'Automated reminders for agreement renewal, rent due, checkout notices, and deposit returns.' },
        { icon: <Eye className="w-4 h-4" />, name: 'Tenant Portal', detail: 'Tenants see their payment history, raise complaints, download receipts, and update profiles — all self-service.' },
      ],
    },
    {
      icon: <CreditCard className="w-5 h-5" />, label: 'Payments', gradient: 'from-purple-500 to-pink-400',
      headline: 'Automated Revenue Engine',
      subline: 'Set it up once. Collections happen on autopilot.',
      capabilities: [
        { icon: <RefreshCw className="w-4 h-4" />, name: 'Recurring Billing', detail: 'Configure rent cycles once. System auto-generates invoices, sends reminders, and tracks every rupee.' },
        { icon: <CreditCard className="w-4 h-4" />, name: 'Omnichannel Payments', detail: 'Accept via UPI, cards, net banking, and wallets. All transactions reconciled automatically.' },
        { icon: <TrendingUp className="w-4 h-4" />, name: 'Collection Intelligence', detail: 'See who\'s paid, who\'s overdue, and who\'s at risk. AI-powered escalation workflows.' },
        { icon: <BarChart3 className="w-4 h-4" />, name: 'Financial Reports', detail: 'P&L, cash flow, GST summaries, and collection efficiency — export-ready in one click.' },
      ],
    },
    {
      icon: <Building2 className="w-5 h-5" />, label: 'Property', gradient: 'from-emerald-500 to-teal-400',
      headline: 'Property Operations Hub',
      subline: 'Every room, every floor, every property — under your control.',
      capabilities: [
        { icon: <Layers className="w-4 h-4" />, name: 'Multi-Property View', detail: 'Manage unlimited PGs from one dashboard. Filter by property, floor, room type, or occupancy status.' },
        { icon: <Settings className="w-4 h-4" />, name: 'Room Configuration', detail: 'Define sharing types (single/double/triple), amenities, pricing tiers, and seasonal adjustments.' },
        { icon: <Clock className="w-4 h-4" />, name: 'Maintenance Workflows', detail: 'Tenants raise requests → staff gets notified → track resolution time → close with photo proof.' },
        { icon: <BarChart3 className="w-4 h-4" />, name: 'Occupancy Dashboard', detail: 'Real-time fill rate, vacancy forecasting, and waitlist management for every property.' },
      ],
    },
    {
      icon: <Shield className="w-5 h-5" />, label: 'Security', gradient: 'from-rose-500 to-red-400',
      headline: 'Enterprise-Grade Security',
      subline: 'Your data is sacred. We treat it that way.',
      capabilities: [
        { icon: <Lock className="w-4 h-4" />, name: 'Data Encryption', detail: 'AES-256 encryption at rest, TLS 1.3 in transit. No one — not even our team — can read your data.' },
        { icon: <Shield className="w-4 h-4" />, name: 'Role-Based Access', detail: 'Define who sees what. Owner, manager, accountant, warden — each role gets exactly the access they need.' },
        { icon: <Eye className="w-4 h-4" />, name: 'Audit Logging', detail: 'Every login, edit, and deletion is recorded with timestamp, user, and IP address.' },
        { icon: <FileText className="w-4 h-4" />, name: 'Compliance Ready', detail: 'Built for Indian data protection regulations with automated compliance reporting.' },
      ],
    },
  ];

  /* ── Before / After data ── */
  const beforeAfterData = {
    before: [
      { metric: 'Rent Collection Time', value: '5-7 days', icon: <Clock className="w-4 h-4" /> },
      { metric: 'Tenant Onboarding', value: '2-3 hours', icon: <Users className="w-4 h-4" /> },
      { metric: 'Monthly Reporting', value: '1 full day', icon: <FileText className="w-4 h-4" /> },
      { metric: 'Complaint Resolution', value: '48-72 hours', icon: <MessageSquare className="w-4 h-4" /> },
      { metric: 'Payment Tracking', value: 'Spreadsheets', icon: <CreditCard className="w-4 h-4" /> },
      { metric: 'Occupancy Visibility', value: 'Manual head count', icon: <Building2 className="w-4 h-4" /> },
    ],
    after: [
      { metric: 'Rent Collection Time', value: 'Same day', icon: <Clock className="w-4 h-4" /> },
      { metric: 'Tenant Onboarding', value: '5 minutes', icon: <Users className="w-4 h-4" /> },
      { metric: 'Monthly Reporting', value: '1 click', icon: <FileText className="w-4 h-4" /> },
      { metric: 'Complaint Resolution', value: '< 4 hours', icon: <MessageSquare className="w-4 h-4" /> },
      { metric: 'Payment Tracking', value: 'Fully automated', icon: <CreditCard className="w-4 h-4" /> },
      { metric: 'Occupancy Visibility', value: 'Real-time dashboard', icon: <Building2 className="w-4 h-4" /> },
    ],
  };

  const fadeUp = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ HERO — Problem-Agitate-Solve ═══ */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-4">
              <Zap className="w-3 h-3 mr-1" /> Platform Features
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Stop managing spreadsheets.<br />
              <span className="text-gradient-brand">Start managing your business.</span>
            </h1>
            <p className="text-base text-gray-500 max-w-2xl mx-auto mb-8">
              PG Manager Pro replaces 6+ tools with one platform. Tenant records, rent collection, complaints, room tracking, reporting, and communications — unified.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/hostel-signup" className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:from-brand-700 hover:to-brand-600 transition-all hover:-translate-y-0.5">
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center px-6 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TOOLS REPLACED ═══ */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="bg-surface-50 rounded-xl border border-gray-100 p-6">
            <p className="text-center text-[10px] text-gray-400 font-semibold uppercase tracking-[0.15em] mb-4">Replaces your entire stack</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {[
                { icon: '📒', label: 'Registers' }, { icon: '📊', label: 'Excel Sheets' }, { icon: '💬', label: 'WhatsApp Groups' },
                { icon: '🧾', label: 'Receipt Books' }, { icon: '📱', label: 'Payment Apps' }, { icon: '📞', label: 'Call Logs' },
              ].map((t, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="text-[10px] text-gray-500 font-medium line-through decoration-red-400">{t.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ INTERACTIVE FEATURE EXPLORER ═══ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Explore by capability</h2>
            <p className="text-sm text-gray-500">Click a pillar to deep-dive into what it does</p>
          </motion.div>

          {/* Pillar Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
            {pillars.map((p, i) => (
              <button key={i} onClick={() => setActivePillar(i)}
                className={`p-3 rounded-xl text-center transition-all border ${activePillar === i ? 'bg-white border-brand-200 shadow-md' : 'bg-white/60 border-gray-100 hover:border-gray-200'}`}>
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${p.gradient} text-white mb-2 shadow-sm ${activePillar === i ? 'scale-110' : ''} transition-transform`}>{p.icon}</div>
                <div className={`text-xs font-semibold ${activePillar === i ? 'text-brand-700' : 'text-gray-600'}`}>{p.label}</div>
              </button>
            ))}
          </div>

          {/* Active Pillar Content */}
          <AnimatePresence mode="wait">
            <motion.div key={activePillar} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`bg-gradient-to-r ${pillars[activePillar].gradient} p-6`}>
                <h3 className="font-heading text-xl font-bold text-white mb-1">{pillars[activePillar].headline}</h3>
                <p className="text-sm text-white/80">{pillars[activePillar].subline}</p>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-4">
                {pillars[activePillar].capabilities.map((cap, ci) => (
                  <div key={ci} className="bg-surface-50 rounded-lg p-4 border border-gray-100 hover:border-brand-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-brand-500">{cap.icon}</span>
                      <h4 className="text-sm font-bold text-gray-900">{cap.name}</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{cap.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ BEFORE vs AFTER ═══ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">The transformation</h2>
            <p className="text-sm text-gray-500">See what changes when you switch to PG Manager Pro</p>
          </motion.div>

          {/* Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-surface-50 rounded-full p-1 border border-gray-100">
              <button onClick={() => setBeforeAfter('before')} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${beforeAfter === 'before' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500'}`}>
                ❌ Without Us
              </button>
              <button onClick={() => setBeforeAfter('after')} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${beforeAfter === 'after' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500'}`}>
                ✅ With PG Manager Pro
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={beforeAfter} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {beforeAfterData[beforeAfter].map((item, i) => (
                <div key={i} className={`rounded-xl p-4 border ${beforeAfter === 'before' ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                  <div className={`mb-2 ${beforeAfter === 'before' ? 'text-red-400' : 'text-emerald-500'}`}>{item.icon}</div>
                  <div className="text-xs text-gray-500 mb-0.5">{item.metric}</div>
                  <div className={`text-sm font-bold ${beforeAfter === 'before' ? 'text-red-700' : 'text-emerald-700'}`}>{item.value}</div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ USE CASES ═══ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Built for every PG type</h2>
            <p className="text-sm text-gray-500">Whether you have 10 beds or 1,000 — we've got you covered</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { emoji: '🏠', title: 'Single PG Owners', desc: 'Manage one property with up to 50 tenants. Automate rent, complaints, and allocations without hiring extra staff.', stat: '40% of our customers' },
              { emoji: '🏢', title: 'Multi-Property Operators', desc: 'Run 3-10 properties from one dashboard. Centralize payments, compare performance, and deploy staff efficiently.', stat: '35% of our customers' },
              { emoji: '🏗️', title: 'Hostel Chains & Enterprises', desc: 'Manage 50+ locations with custom branding, API integrations, dedicated support, and SLA guarantees.', stat: '25% of our customers' },
            ].map((uc, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm card-hover">
                <div className="text-3xl mb-3">{uc.emoji}</div>
                <h3 className="text-sm font-heading font-bold text-gray-900 mb-2">{uc.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{uc.desc}</p>
                <div className="text-[10px] text-brand-600 font-semibold bg-brand-50 inline-block px-2 py-0.5 rounded-full">{uc.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MOBILE APP PREVIEW ═══ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
            <span className="inline-block text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-3">Mobile First</span>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">Your PG in your pocket</h2>
            <p className="text-sm text-gray-500 mb-5">Both owners and tenants get native mobile apps. Manage on the go — from approving leave requests to checking payment status.</p>
            <div className="space-y-2.5">
              {[
                'Real-time push notifications for payments & complaints',
                'Tenant self-service: receipts, profile updates, requests',
                'Owner dashboard: occupancy, revenue, alerts',
                'Works offline with smart sync when reconnected',
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-600">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}
            className="flex justify-center">
            {/* Phone mockup */}
            <div className="relative w-56">
              <div className="bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                <div className="bg-slate-800 rounded-[1.6rem] overflow-hidden">
                  <div className="bg-brand-600 px-4 py-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-white" />
                    <span className="text-xs font-semibold text-white">PG Manager Pro</span>
                  </div>
                  <div className="bg-white p-3 space-y-2.5">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                      <div className="text-[10px] text-emerald-600 font-bold">TODAY'S COLLECTION</div>
                      <div className="text-lg font-bold text-emerald-700">₹42,500</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
                        <div className="text-[9px] text-blue-600 font-semibold">OCCUPIED</div>
                        <div className="text-sm font-bold text-blue-700">47/50</div>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-2 text-center border border-amber-100">
                        <div className="text-[9px] text-amber-600 font-semibold">PENDING</div>
                        <div className="text-sm font-bold text-amber-700">3</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[9px] text-gray-400 font-semibold uppercase">Recent Activity</div>
                      {['Arjun paid ₹8,500', 'Room 205 — Maintenance', 'Priya — New move-in'].map((a, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-md px-2 py-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-emerald-400' : i === 1 ? 'bg-amber-400' : 'bg-blue-400'}`} />
                          <span className="text-[10px] text-gray-600">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating notification */}
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-3 -right-6 bg-white rounded-lg shadow-lg px-3 py-2 border border-gray-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle className="w-3 h-3 text-emerald-600" /></div>
                <div className="text-[9px]"><div className="font-bold text-gray-900">Payment Received</div><div className="text-gray-400">₹8,500 from Arjun</div></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-15" />
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">Ready to ditch the spreadsheets?</h2>
          <p className="text-sm text-slate-300 mb-6">Join 150+ PG owners who've already made the switch</p>
          <div className="flex gap-3 justify-center">
            <Link to="/hostel-signup" className="px-7 py-3 bg-white text-brand-700 font-bold rounded-xl hover:bg-gray-50 shadow-xl text-sm transition-all hover:-translate-y-0.5">
              Start Free Trial <ArrowRight className="inline ml-1.5 w-4 h-4" />
            </Link>
            <Link to="/demo" className="px-7 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/15 hover:bg-white/20 transition-all text-sm">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
