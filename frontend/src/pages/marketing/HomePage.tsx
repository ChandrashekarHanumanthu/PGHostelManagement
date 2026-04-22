import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';

const stats = [
  { value: '150+', label: 'PGs live on platform' },
  { value: '5,000+', label: 'Tenants managed monthly' },
  { value: '98.6%', label: 'Collection success rate' },
  { value: '20h/week', label: 'Average admin time saved' },
];

const featureHighlights = [
  {
    icon: <UsersRound className="w-5 h-5 text-[#0f6fff]" />,
    title: 'Tenant lifecycle automation',
    text: 'Invite, onboard, document verify, allocate room, and track move-out from one workflow.',
  },
  {
    icon: <CreditCard className="w-5 h-5 text-[#0ea5a4]" />,
    title: 'Revenue and rent operations',
    text: 'Recurring rent cycles, reminders, payment proof, approval queue, and real-time ledgers.',
  },
  {
    icon: <MessageSquareText className="w-5 h-5 text-[#0756c7]" />,
    title: 'Complaints and announcements',
    text: 'Structured issue tracking and tenant communication with complete audit trail.',
  },
];

const workflow = [
  {
    step: '01',
    title: 'Set up your PG in minutes',
    text: 'Configure properties, room categories, and rent plans with guided setup.',
  },
  {
    step: '02',
    title: 'Invite tenants digitally',
    text: 'Send a secure signup link and let tenants complete profile setup themselves.',
  },
  {
    step: '03',
    title: 'Run operations from one dashboard',
    text: 'Track occupancy, payments, complaints, and alerts without switching tools.',
  },
];

const testimonials = [
  {
    name: 'Ramesh Kumar',
    property: 'Siva Sai Sri Hostel',
    quote: 'We moved from spreadsheets to PG Manager Pro and instantly reduced rent follow-up chaos.',
  },
  {
    name: 'Priya Nair',
    property: 'Urban Nest Ladies PG',
    quote: 'The tenant onboarding flow is smooth and our support tickets are now fully trackable.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const HomePage: React.FC = () => {
  return (
    <div>
      <section className="mk-section">
        <div className="mk-wrap grid lg:grid-cols-[1.05fr_0.95fr] gap-9 items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.45 }}>
            <span className="mk-eyebrow">
              <Sparkles className="w-3.5 h-3.5" />
              RevenueOS For PG Operators
            </span>
            <h1 className="mk-title">
              Modern operations for
              <br />
              high-performing PG businesses.
            </h1>
            <p className="mk-subtitle max-w-xl">
              PG Manager Pro gives hostel owners one command center to run occupancy, rent collections,
              tenant support, and reporting at scale.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/hostel-signup" className="mk-button-primary">
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/demo" className="mk-button-secondary">
                Book live demo
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-5 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Secure cloud backups
              </span>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.05 }} className="mk-dark-panel p-6 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Live Dashboard</p>
                <p className="mt-1 text-2xl md:text-3xl font-semibold text-white">SUN RISE HOSTEL</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/25">
                Healthy
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Collected this month</p>
                <p className="text-2xl font-semibold text-white mt-1">₹8.4L</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Occupancy</p>
                <p className="text-2xl font-semibold text-white mt-1">94%</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Pending issues</p>
                <p className="text-2xl font-semibold text-white mt-1">6</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Due reminders</p>
                <p className="text-2xl font-semibold text-white mt-1">14</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mk-section mk-section-alt">
        <div className="mk-wrap grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((item, idx) => (
            <motion.div
              key={item.label}
              {...fadeUp}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="mk-card mk-card-soft p-5"
            >
              <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
              <p className="text-sm text-slate-600 mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-wrap">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="max-w-2xl mb-10">
            <span className="mk-eyebrow">Core Platform</span>
            <h2 className="mk-title text-[clamp(1.7rem,3.4vw,2.6rem)]">Built for real hostel workflows, not generic CRM screens.</h2>
          </motion.div>

          <div className="mk-grid-3">
            {featureHighlights.map((feature, idx) => (
              <motion.article
                key={feature.title}
                {...fadeUp}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="mk-card p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-[#eff5ff] border border-[#d2e2fb] flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{feature.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-section mk-section-alt">
        <div className="mk-wrap">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="max-w-2xl mb-9">
            <span className="mk-eyebrow">
              <CalendarClock className="w-3.5 h-3.5" />
              Rollout Path
            </span>
            <h2 className="mk-title text-[clamp(1.7rem,3.4vw,2.6rem)]">From setup to scale in three practical steps.</h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-4">
            {workflow.map((item, idx) => (
              <motion.article
                key={item.step}
                {...fadeUp}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="mk-card p-6"
              >
                <p className="text-xs font-semibold text-[#0f6fff] tracking-wider">STEP {item.step}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-wrap grid lg:grid-cols-2 gap-4">
          {testimonials.map((item, idx) => (
            <motion.article
              key={item.name}
              {...fadeUp}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="mk-card p-6"
            >
              <p className="text-base leading-8 text-slate-700">“{item.quote}”</p>
              <p className="mt-5 text-sm font-semibold text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500 mt-1">{item.property}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-wrap">
          <div className="mk-dark-panel p-8 md:p-10 text-center">
            <span className="mk-eyebrow bg-white/10 border-white/20 text-[#dbeafe]">Get Started</span>
            <h2 className="mt-5 text-3xl md:text-4xl font-semibold text-white tracking-tight">
              Upgrade from manual PG admin to predictable operations.
            </h2>
            <p className="mt-4 text-slate-300 max-w-2xl mx-auto text-sm leading-7">
              Launch your account in minutes, onboard tenants quickly, and centralize every operational signal in one place.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/hostel-signup" className="mk-button-primary">Start free trial</Link>
              <Link to="/pricing" className="mk-button-secondary">See pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
