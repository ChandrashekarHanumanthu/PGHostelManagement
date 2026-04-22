import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BellRing,
  Building2,
  CheckCircle2,
  CreditCard,
  FileBarChart2,
  IdCard,
  LayoutDashboard,
  MessageSquareWarning,
  ShieldCheck,
  Sparkles,
  Users2,
} from 'lucide-react';

const featureRows = [
  {
    icon: <Users2 className="w-5 h-5 text-[#0f6fff]" />,
    title: 'Tenant lifecycle workflows',
    bullets: [
      'Digital invite and self-onboarding links',
      'Profile, ID proofs, and room assignment history',
      'Move-in to move-out timeline and checklists',
    ],
  },
  {
    icon: <CreditCard className="w-5 h-5 text-[#0ea5a4]" />,
    title: 'Payments and collections',
    bullets: [
      'Recurring cycles with automated reminders',
      'Approval flow for tenant-submitted payment proofs',
      'Monthly due list, pending tracker, and receipts',
    ],
  },
  {
    icon: <MessageSquareWarning className="w-5 h-5 text-[#0f6fff]" />,
    title: 'Complaints and notices',
    bullets: [
      'Issue intake with status and accountability',
      'Owner and tenant visibility on resolution',
      'Broadcast notices with timeline traceability',
    ],
  },
  {
    icon: <LayoutDashboard className="w-5 h-5 text-[#0ea5a4]" />,
    title: 'Operations dashboard',
    bullets: [
      'Live occupancy and rent collection indicators',
      'Quick actions for rooms, tenants, payments',
      'Snapshot views for daily decision making',
    ],
  },
  {
    icon: <FileBarChart2 className="w-5 h-5 text-[#0f6fff]" />,
    title: 'Reports and controls',
    bullets: [
      'Revenue and payment summary views',
      'Room and tenant-level operational records',
      'Export-friendly data for audits and bookkeeping',
    ],
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#0ea5a4]" />,
    title: 'Security and role access',
    bullets: [
      'JWT auth and role-based access controls',
      'Protected admin and tenant surfaces',
      'Safer workflows for operations and data',
    ],
  },
];

const integrationTiles = [
  { icon: <IdCard className="w-4 h-4" />, name: 'Document workflows', text: 'Manage tenant identity and profile records with confidence.' },
  { icon: <BellRing className="w-4 h-4" />, name: 'Reminder engine', text: 'Rent and task nudges at the right time for the right user.' },
  { icon: <Building2 className="w-4 h-4" />, name: 'Room operations', text: 'Track room categories, status, and occupancy movement.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const FeaturesPage: React.FC = () => {
  return (
    <div>
      <section className="mk-section">
        <div className="mk-wrap max-w-4xl">
          <motion.div {...fadeUp} transition={{ duration: 0.45 }} className="text-center">
            <span className="mk-eyebrow">
              <Sparkles className="w-3.5 h-3.5" />
              Platform Capabilities
            </span>
            <h1 className="mk-title">
              A complete SaaS stack for
              <br />
              PG and hostel operations.
            </h1>
            <p className="mk-subtitle max-w-3xl mx-auto">
              Replace disconnected tools with one operating system for tenant management, payments,
              complaints, room workflows, and daily business visibility.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/demo" className="mk-button-primary">
                See live walkthrough
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/pricing" className="mk-button-secondary">Compare plans</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mk-section mk-section-alt">
        <div className="mk-wrap">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="max-w-2xl mb-9">
            <span className="mk-eyebrow">Core Modules</span>
            <h2 className="mk-title text-[clamp(1.7rem,3.2vw,2.5rem)]">Everything teams need to operate daily without friction.</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {featureRows.map((row, idx) => (
              <motion.article
                key={row.title}
                {...fadeUp}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="mk-card p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-[#edf5ff] border border-[#d6e6fb] flex items-center justify-center">
                  {row.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{row.title}</h3>
                <ul className="mt-3 space-y-2.5">
                  {row.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600 leading-6">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-wrap grid lg:grid-cols-[1.1fr_0.9fr] gap-5 items-stretch">
          <motion.div {...fadeUp} transition={{ duration: 0.45 }} className="mk-dark-panel p-7 md:p-8">
            <p className="text-xs uppercase tracking-widest text-slate-400">Operator Experience</p>
            <h2 className="mt-3 text-3xl md:text-[2.2rem] leading-tight font-semibold text-white tracking-tight">
              Built to reduce admin load while improving revenue confidence.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Owners and managers get an interface designed for practical hostel operations:
              fast actions, clear metrics, and predictable workflows.
            </p>
            <div className="mt-7 grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-2xl font-semibold text-white">3x</p>
                <p className="text-xs text-slate-400 mt-1">Faster monthly closure</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-2xl font-semibold text-white">90%</p>
                <p className="text-xs text-slate-400 mt-1">Lower follow-up overhead</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-2xl font-semibold text-white">1</p>
                <p className="text-xs text-slate-400 mt-1">Unified operating dashboard</p>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.05 }} className="grid gap-4">
            {integrationTiles.map((tile) => (
              <article key={tile.name} className="mk-card p-5">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#e9f3ff] text-[#0f6fff] border border-[#cfe1fb]">
                  {tile.icon}
                </div>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{tile.name}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-7">{tile.text}</p>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-wrap">
          <div className="mk-card p-8 md:p-10 text-center">
            <span className="mk-eyebrow">Next Step</span>
            <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
              Want to see your own hostel workflow inside this system?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm leading-7 text-slate-600">
              We can run a guided walkthrough using your current process and show exactly how it maps into PG Manager Pro.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/demo" className="mk-button-primary">Book a demo</Link>
              <Link to="/hostel-signup" className="mk-button-secondary">Start free trial</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
