import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Building2, Users, Shield, ArrowRight, CheckCircle, Star,
  Zap, BarChart3, Sparkles, CreditCard, MessageSquare,
  TrendingUp, Clock, Bell, ChevronDown, ArrowUpRight,
  Play, Layers, Globe, FileText, Phone, Rocket,
  PieChart, Home, Lock, Eye, RefreshCw, MapPin
} from 'lucide-react';

/* ── Animated Counter ── */
const Counter = ({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let v = 0; const inc = target / 40;
    const t = setInterval(() => { v += inc; if (v >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(v)); }, 25);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ── FAQ ── */
const FAQ = ({ q, a, open: d }: { q: string; a: string; open?: boolean }) => {
  const [open, setOpen] = useState(d);
  return (
    <div className={`border rounded-xl transition-all ${open ? 'border-brand-200 bg-brand-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3.5 text-left">
        <span className="text-sm font-semibold text-gray-900 pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>{open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
          <div className="px-5 pb-3.5 text-sm text-gray-600 leading-relaxed">{a}</div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
};

const HomePage = () => {
  const [activePain, setActivePain] = useState(0);
  const [activeTest, setActiveTest] = useState(0);

  const pains = [
    { emoji: '📋', title: 'Paper Registers', desc: 'Entries get lost. No search. No backup. One fire and it\'s all gone.', fix: 'Digital tenant profiles with cloud backup and instant search.' },
    { emoji: '📊', title: 'Excel Sheets', desc: 'Version chaos. Formulas break. No real-time updates across team.', fix: 'Live dashboard with automatic calculations and team access.' },
    { emoji: '💬', title: 'WhatsApp Groups', desc: 'Important messages buried. No accountability. Professional? Hardly.', fix: 'In-app complaints, notices, and tenant portal — all trackable.' },
    { emoji: '💸', title: 'Cash Payments', desc: 'No receipts. "I already paid" disputes. Hours counting cash.', fix: 'Online payments with auto-receipts and transparent ledger.' },
    { emoji: '📞', title: 'Phone Calls', desc: '10 calls/day for basic questions. "Is my room ready?" "When is rent due?"', fix: 'Tenant self-service app answers 90% of queries automatically.' },
  ];

  const tests = [
    { name: 'Ramesh K.', role: 'Sri Venkateswara PG', loc: 'HITEC City', text: 'Went from managing everything on paper to a full digital system in one weekend. Rent collection improved by 40%.', stat: '40% faster collection', initials: 'RK', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Sunita R.', role: 'Ladies Paradise PG', loc: 'Gachibowli', text: 'My tenants love the app. Complaints dropped because they can track resolution in real-time.', stat: '80% fewer complaints', initials: 'SR', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Naveen P.', role: 'Green Valley Hostel', loc: 'Kondapur', text: 'Managing 3 properties was chaos. Now I do it from one screen on my phone while traveling.', stat: '20h saved weekly', initials: 'NP', gradient: 'from-emerald-500 to-teal-500' },
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveTest(p => (p + 1) % tests.length), 5000);
    return () => clearInterval(t);
  }, []);

  const f = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ═══════════ HERO — CENTERED PERSPECTIVE ═══════════ */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-surface-950">
        <div className="absolute inset-0 dot-pattern opacity-15" />

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </span>
            <span className="text-xs font-semibold text-slate-300">Introducing PG Manager Pro 2.0</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-5xl sm:text-6xl lg:text-[5.5rem] font-bold text-white leading-[1.05] tracking-tight mb-6 max-w-4xl">
            The Operating System for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-brand-400 to-purple-400">Your PG Business.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Replace chaotic registers, messy Excel sheets, and endless WhatsApp messages. Automate rent, manage tenants, and grow your revenue from one beautiful dashboard.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link to="/hostel-signup" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] hover:-translate-y-1 transition-all text-sm">
              Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link to="/demo" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 backdrop-blur-md transition-all text-sm group">
              <Play className="mr-2 w-4 h-4 text-slate-400 group-hover:text-brand-400 transition-colors" /> See How It Works
            </Link>
          </motion.div>

          {/* Floating Abstract UI */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-5xl relative mt-4 [perspective:2000px]">

            {/* Center Core */}
            <div className="relative z-20 rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-surface-900 mx-auto transform-gpu [transform:rotateX(12deg)] hover:[transform:rotateX(5deg)] transition-transform duration-700 ease-out">
              <div className="bg-surface-950 px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-slate-700/80" /><div className="w-3 h-3 rounded-full bg-slate-700/80" /><div className="w-3 h-3 rounded-full bg-slate-700/80" /></div>
                <div className="text-[10px] text-slate-500 font-mono tracking-widest bg-white/5 px-4 py-1 rounded-full">app.pgmanagerpro.com</div>
                <div className="w-16 flex justify-end"><Lock className="w-3 h-3 text-emerald-500" /></div>
              </div>
              <div className="p-6 md:p-8 relative overflow-hidden h-[300px] md:h-[450px]">
                {/* Abstract Data Viz inside Dashboard */}
                <div className="absolute top-6 md:top-8 left-6 md:left-8 right-6 md:right-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="text-left">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Total Collection</div>
                    <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2 tracking-tight">₹8,42,500</div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><TrendingUp className="w-3 h-3 mr-1" />+14.2% vs last month</div>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 md:w-32 flex flex-col items-center justify-center"><div className="text-2xl font-bold text-white mb-1"><Counter target={124} /></div><div className="text-[10px] text-slate-400 font-medium">Active Tenants</div></div>
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 md:w-32 flex flex-col items-center justify-center"><div className="text-2xl font-bold text-cyan-400 mb-1"><Counter target={96} suffix="%" /></div><div className="text-[10px] text-slate-400 font-medium">Occupancy Rate</div></div>
                  </div>
                </div>
                {/* Graph */}
                <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 h-32 md:h-48 flex items-end justify-between">
                  {[40, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 95].map((h, i) => (
                    <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, delay: 0.6 + i * 0.05, ease: "easeOut" }}
                      className="w-2.5 sm:w-4 md:w-5 lg:w-6 bg-gradient-to-t from-brand-600/80 to-purple-400/80 rounded-t-sm md:rounded-t-md opacity-90 border-t border-white/20" />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements (Hidden on mobile) */}
            <motion.div animate={{ y: [-15, 10, -15] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-12 -left-12 z-30 bg-surface-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl hidden lg:flex items-center gap-3.5 w-[280px]">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30"><CheckCircle className="w-6 h-6 text-emerald-400" /></div>
              <div><div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Rent Received</div><div className="text-sm font-bold text-white">₹12,400 from Room 201</div></div>
            </motion.div>

            <motion.div animate={{ y: [15, -10, 15] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-24 -right-16 z-30 bg-surface-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl hidden lg:flex items-center gap-3.5 w-[300px]">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30"><Users className="w-6 h-6 text-blue-400" /></div>
              <div><div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">New Move-in</div><div className="text-sm font-bold text-white leading-tight">Aditya Sharma<br /><span className="text-xs text-emerald-400 font-normal flex items-center mt-1"><CheckCircle className="w-3 h-3 mr-1" /> Aadhaar Verified</span></div></div>
            </motion.div>

            <motion.div animate={{ y: [-10, 8, -10] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-8 left-16 z-30 bg-surface-800/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl hidden lg:flex items-center gap-3 pr-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30"><MessageSquare className="w-5 h-5 text-amber-400" /></div>
              <div className="text-sm text-slate-300 font-medium">Issue #142 <span className="text-emerald-400 ml-1">Resolved</span></div>
            </motion.div>

          </motion.div>
        </div>

      </section>

      {/* ═══════════ PAIN POINTS CAROUSEL ═══════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div {...f} transition={{ duration: 0.4 }} className="text-center mb-10">
            <span className="inline-flex items-center text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full mb-3">😩 Sound Familiar?</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Still running your PG the old way?</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">Click each pain point to see how PG Manager Pro fixes it</p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-4">
            {/* Pain point tabs */}
            <div className="lg:col-span-2 space-y-2">
              {pains.map((p, i) => (
                <button key={i} onClick={() => setActivePain(i)}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-center gap-3 ${activePain === i ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                  <span className="text-xl">{p.emoji}</span>
                  <div>
                    <div className={`text-sm font-semibold ${activePain === i ? 'text-red-700' : 'text-gray-700'}`}>{p.title}</div>
                    <div className="text-[10px] text-gray-400">Click to see the fix →</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Pain content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div key={activePain} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                  className="bg-surface-50 rounded-xl border border-gray-100 overflow-hidden h-full">
                  <div className="bg-red-50 border-b border-red-100 p-5">
                    <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">❌ THE PROBLEM</div>
                    <h3 className="text-base font-heading font-bold text-red-800 mb-1">{pains[activePain].title}</h3>
                    <p className="text-sm text-red-600">{pains[activePain].desc}</p>
                  </div>
                  <div className="bg-emerald-50 p-5">
                    <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">✅ THE FIX</div>
                    <p className="text-sm text-emerald-700 leading-relaxed">{pains[activePain].fix}</p>
                    <Link to="/features" className="inline-flex items-center text-xs font-semibold text-emerald-600 mt-3 hover:text-emerald-700">
                      Explore this feature <ArrowRight className="ml-1 w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ METRICS STRIP ═══════════ */}
      <section className="py-10 bg-hero-gradient">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { v: 150, s: '+', l: 'PGs Managed', sub: 'Across 12 cities' },
            { v: 5000, s: '+', l: 'Happy Tenants', sub: 'And growing daily' },
            { v: 98, s: '%', l: 'Collection Rate', sub: 'Industry-leading' },
            { v: 20, s: 'h', l: 'Saved Weekly', sub: 'Per PG owner' },
          ].map((m, i) => (
            <motion.div key={i} {...f} transition={{ duration: 0.4, delay: i * 0.06 }}
              className="bg-white/5 rounded-xl p-5 border border-white/10 text-center backdrop-blur-sm">
              <div className="text-3xl font-heading font-bold text-white mb-0.5"><Counter target={m.v} suffix={m.s} /></div>
              <div className="text-xs font-medium text-white/90">{m.l}</div>
              <div className="text-[10px] text-slate-400">{m.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ PRODUCT WALKTHROUGH ═══════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...f} transition={{ duration: 0.4 }} className="text-center mb-12">
            <span className="inline-flex items-center text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-3">
              <Layers className="w-3 h-3 mr-1" /> How It Works
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Three steps. Five minutes. You're live.</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              { step: '01', title: 'Create your PG', desc: 'Sign up, add your property details, configure room types and pricing. Takes under 2 minutes.', icon: <Building2 className="w-5 h-5" />, gradient: 'from-blue-500 to-cyan-400', details: ['Add property name & address', 'Configure single/double/triple rooms', 'Set rent amounts & billing cycles', 'Invite your team (manager, warden)'] },
              { step: '02', title: 'Onboard your tenants', desc: 'Share a signup link. Tenants register, upload ID proof, and get assigned rooms — automatically.', icon: <Users className="w-5 h-5" />, gradient: 'from-purple-500 to-pink-400', details: ['Share invite link via WhatsApp/Email', 'Digital KYC with Aadhaar verification', 'Automatic room assignment', 'Tenant self-service portal activated'] },
              { step: '03', title: 'Sit back and manage', desc: 'Payments auto-collect, complaints auto-route, reports auto-generate. You just make decisions.', icon: <Rocket className="w-5 h-5" />, gradient: 'from-emerald-500 to-teal-400', details: ['Auto rent reminders & collection', 'Complaint tracking & resolution', 'Real-time occupancy dashboard', 'One-click financial reports'] },
            ].map((s, i) => (
              <motion.div key={i} {...f} transition={{ duration: 0.4, delay: i * 0.08 }}
                className="grid lg:grid-cols-2 gap-5 items-center bg-surface-50 rounded-xl border border-gray-100 p-6 card-hover">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-md`}>{s.icon}</div>
                  <div>
                    <div className="text-[10px] font-bold text-brand-500 uppercase tracking-wider mb-1">Step {s.step}</div>
                    <h3 className="text-base font-heading font-bold text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-sm text-gray-500">{s.desc}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 lg:pl-4">
                  {s.details.map((d, j) => (
                    <div key={j} className="flex items-start gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-600">{d}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURE BENTO ═══════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...f} transition={{ duration: 0.4 }} className="text-center mb-10">
            <span className="inline-flex items-center text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-3">
              <Zap className="w-3 h-3 mr-1" /> Features
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Everything you need, built in</h2>
            <p className="text-sm text-gray-500">No add-ons. No integrations needed. It all just works.</p>
          </motion.div>

          {/* Bento grid — mixed sizes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Large card */}
            <motion.div {...f} transition={{ duration: 0.4 }}
              className="lg:col-span-2 bg-gradient-to-br from-brand-600 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <PieChart className="w-6 h-6 mb-3 text-white/80" />
              <h3 className="font-heading text-lg font-bold mb-1">Real-Time Dashboard</h3>
              <p className="text-sm text-white/80 max-w-sm mb-4">Your entire PG business at a glance. Occupancy, revenue, payments, complaints — all live, all the time.</p>
              <div className="grid grid-cols-3 gap-2">
                {[{ l: 'Occupancy', v: '94%' }, { l: 'Revenue', v: '₹8.2L' }, { l: 'Collected', v: '89%' }].map((s, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-2.5 text-center border border-white/10">
                    <div className="text-sm font-bold">{s.v}</div><div className="text-[10px] text-white/60">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Small cards */}
            {[
              { icon: <CreditCard className="w-5 h-5" />, title: 'Online Payments', desc: 'UPI, cards, net banking. Auto receipts.', gradient: 'from-emerald-500 to-teal-400' },
              { icon: <Users className="w-5 h-5" />, title: 'Tenant Portal', desc: 'Self-service. Pay rent, raise issues, download receipts.', gradient: 'from-blue-500 to-cyan-400' },
              { icon: <MessageSquare className="w-5 h-5" />, title: 'Complaint System', desc: 'Raise → Assign → Track → Resolve → Rate.', gradient: 'from-amber-500 to-orange-400' },
              { icon: <Shield className="w-5 h-5" />, title: 'Enterprise Security', desc: 'AES-256 encryption. Role-based access.', gradient: 'from-rose-500 to-red-400' },
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Smart Reports', desc: 'P&L, occupancy trends, collection efficiency.', gradient: 'from-indigo-500 to-violet-400' },
              { icon: <Bell className="w-5 h-5" />, title: 'Auto Alerts', desc: 'Payment reminders, lease expiry, maintenance due.', gradient: 'from-purple-500 to-pink-400' },
              { icon: <Home className="w-5 h-5" />, title: 'Room Manager', desc: 'Allocate, transfer, track maintenance.', gradient: 'from-teal-500 to-cyan-400' },
            ].map((feat, i) => (
              <motion.div key={i} {...f} transition={{ duration: 0.3, delay: i * 0.04 }}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm card-hover group">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-110 transition-transform`}>{feat.icon}</div>
                <h3 className="text-sm font-heading font-bold text-gray-900 mb-0.5">{feat.title}</h3>
                <p className="text-xs text-gray-500">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...f} transition={{ duration: 0.4 }} className="text-center mb-10">
            <span className="inline-flex items-center text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-3">
              <Star className="w-3 h-3 mr-1 fill-brand-500" /> Customer Stories
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">PG owners love us. Here's proof.</h2>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTest} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
              className="bg-surface-50 rounded-xl border border-gray-100 p-8">
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2">
                  <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
                  <p className="text-base text-gray-700 leading-relaxed italic mb-4">"{tests[activeTest].text}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${tests[activeTest].gradient} flex items-center justify-center text-xs font-bold text-white`}>{tests[activeTest].initials}</div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{tests[activeTest].name}</div>
                      <div className="text-xs text-gray-500">{tests[activeTest].role} · {tests[activeTest].loc}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100 text-center shadow-sm">
                  <div className="text-2xl font-heading font-bold text-brand-600 mb-1">{tests[activeTest].stat}</div>
                  <div className="text-[10px] text-gray-400">Reported improvement</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center gap-1.5 mt-5">
            {tests.map((_, i) => (
              <button key={i} onClick={() => setActiveTest(i)}
                className={`h-1.5 rounded-full transition-all ${i === activeTest ? 'w-6 bg-brand-500' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING PREVIEW ═══════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...f} transition={{ duration: 0.4 }}>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Starts at ₹0. Seriously.</h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto mb-8">Free forever for PGs under 20 tenants. Paid plans from ₹50/day.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {[
              { plan: 'Starter', price: 'Free', sub: 'Up to 20 tenants', badge: null },
              { plan: 'Pro', price: '₹1,499/mo', sub: 'Up to 100 tenants', badge: 'Popular' },
              { plan: 'Business', price: '₹4,999/mo', sub: 'Up to 500 tenants', badge: null },
            ].map((p, i) => (
              <motion.div key={i} {...f} transition={{ duration: 0.3, delay: i * 0.06 }}
                className={`bg-white rounded-xl p-5 border ${p.badge ? 'border-brand-300 shadow-md ring-1 ring-brand-200' : 'border-gray-100 shadow-sm'} card-hover relative`}>
                {p.badge && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-gradient-to-r from-brand-500 to-purple-500 px-3 py-0.5 rounded-full">{p.badge}</div>}
                <div className="text-xs font-semibold text-gray-500 mb-1">{p.plan}</div>
                <div className="text-xl font-heading font-bold text-gray-900 mb-0.5">{p.price}</div>
                <div className="text-[10px] text-gray-400">{p.sub}</div>
              </motion.div>
            ))}
          </div>
          <Link to="/pricing" className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700">
            See all plans & compare features <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <motion.div {...f} transition={{ duration: 0.4 }} className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Quick answers</h2>
          </motion.div>
          <div className="space-y-2">
            {[
              { q: 'How long does setup take?', a: 'Under 5 minutes. Add property details, configure rooms, invite tenants — done. No tech skills needed.' },
              { q: 'Is my data safe?', a: 'Bank-level AES-256 encryption, role-based access, and fully isolated multi-tenant architecture. We\'re GDPR-ready.' },
              { q: 'Can I manage multiple PGs?', a: 'Yes — unlimited properties from one dashboard. Switch between them seamlessly.' },
              { q: 'What if I need help?', a: 'Email support 24/7, live chat during business hours, and dedicated onboarding for all paid plans. We also have WhatsApp support.' },
              { q: 'Is there a free plan?', a: 'Yes — the Starter plan is free forever for PGs with up to 20 tenants. No credit card required.' },
            ].map((faq, i) => <FAQ key={i} q={faq.q} a={faq.a} open={i === 0} />)}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-15" />
        <div className="absolute top-10 -right-20 w-64 h-64 bg-purple-500/25 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-20 w-64 h-64 bg-brand-500/25 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div {...f} transition={{ duration: 0.4 }}>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3">Stop managing chaos.<br />Start managing your business.</h2>
            <p className="text-sm text-slate-300 mb-8 max-w-md mx-auto">Join 150+ PG owners who replaced registers, Excel and WhatsApp with one platform.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/hostel-signup" className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-brand-700 font-bold rounded-xl hover:bg-gray-50 shadow-xl text-sm transition-all hover:-translate-y-0.5">
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link to="/demo" className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/15 hover:bg-white/20 text-sm transition-all">
                Book a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

