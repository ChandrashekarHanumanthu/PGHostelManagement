import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock3,
  LineChart,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

const highlights = [
  {
    icon: <Building2 className="w-5 h-5 text-[#0f6fff]" />,
    title: 'Built only for PG operations',
    text: 'We are focused on one category and keep improving around real day-to-day hostel workflows.',
  },
  {
    icon: <LineChart className="w-5 h-5 text-[#0ea5a4]" />,
    title: 'Outcome-first product culture',
    text: 'Every release is judged by time saved, collections improved, and operator stress reduced.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#0f6fff]" />,
    title: 'Trust and reliability',
    text: 'Role-based security, controlled access, and clean audit trails across operations.',
  },
];

const values = [
  {
    title: 'Practicality over buzzwords',
    text: 'We design for owners and admins who need speed, clarity, and fewer follow-ups.',
  },
  {
    title: 'Shipping with discipline',
    text: 'We prioritize stable product upgrades that teams can adopt without operational disruption.',
  },
  {
    title: 'Long-term partnership',
    text: 'Our support, onboarding, and roadmap are built to grow with your occupancy and complexity.',
  },
];

const timeline = [
  { year: '2023', detail: 'Started by interviewing PG owners handling operations manually.' },
  { year: '2024', detail: 'Launched core modules for tenant onboarding, room control, and payments.' },
  { year: '2025', detail: 'Expanded to workflow automation, complaint management, and reports.' },
  { year: '2026', detail: 'Scaling into a full SaaS operating system for multi-property teams.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const AboutPage: React.FC = () => {
  return (
    <div>
      <section className="mk-section">
        <div className="mk-wrap max-w-4xl text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.45 }}>
            <span className="mk-eyebrow">
              <Sparkles className="w-3.5 h-3.5" />
              About PG Manager Pro
            </span>
            <h1 className="mk-title">
              We build software that helps
              <br />
              PG operators run cleaner businesses.
            </h1>
            <p className="mk-subtitle max-w-3xl mx-auto">
              PG Manager Pro exists to replace fragmented tools with one reliable system for occupancy,
              collections, tenant support, and operational visibility.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mk-section mk-section-alt pt-4">
        <div className="mk-wrap grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { value: '150+', label: 'Active PG businesses' },
            { value: '5,000+', label: 'Tenants managed monthly' },
            { value: '98%', label: 'Collection consistency' },
            { value: '24x7', label: 'Cloud system availability' },
          ].map((item, idx) => (
            <motion.article
              key={item.label}
              {...fadeUp}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="mk-card mk-card-soft p-5 text-center"
            >
              <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
              <p className="text-sm text-slate-600 mt-1">{item.label}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-wrap">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="max-w-2xl mb-9">
            <span className="mk-eyebrow">Why We Exist</span>
            <h2 className="mk-title text-[clamp(1.7rem,3.2vw,2.5rem)]">
              Built from real operator pain, not generic SaaS templates.
            </h2>
          </motion.div>

          <div className="mk-grid-3">
            {highlights.map((item, idx) => (
              <motion.article
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="mk-card p-6"
              >
                <div className="w-11 h-11 rounded-xl bg-[#eef5ff] border border-[#d3e4fb] flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-section mk-section-alt">
        <div className="mk-wrap grid lg:grid-cols-[1.05fr_0.95fr] gap-5">
          <motion.div {...fadeUp} transition={{ duration: 0.45 }} className="mk-dark-panel p-7 md:p-8">
            <p className="text-xs uppercase tracking-widest text-slate-400">Our Principles</p>
            <h2 className="mt-3 text-3xl md:text-[2.1rem] leading-tight font-semibold text-white tracking-tight">
              Product decisions guided by operational reality.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              We partner closely with property teams and design features that reduce repetitive work,
              improve team accountability, and help owners make clearer decisions.
            </p>

            <div className="mt-7 space-y-3">
              {values.map((value) => (
                <article key={value.title} className="rounded-xl border border-slate-700 bg-slate-900/65 p-4">
                  <h3 className="text-sm font-semibold text-white">{value.title}</h3>
                  <p className="text-xs leading-6 text-slate-300 mt-1">{value.text}</p>
                </article>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.05 }} className="mk-card p-6 md:p-7">
            <h3 className="text-lg font-semibold text-slate-900">Journey so far</h3>
            <div className="mt-5 space-y-4">
              {timeline.map((item) => (
                <div key={item.year} className="flex gap-3">
                  <span className="inline-flex shrink-0 h-7 px-2.5 items-center rounded-full bg-[#eaf2ff] text-[#0f6fff] text-xs font-black border border-[#cfe1fb]">
                    {item.year}
                  </span>
                  <p className="text-sm leading-7 text-slate-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-wrap">
          <div className="mk-card p-8 md:p-10 text-center">
            <span className="mk-eyebrow">
              <BadgeCheck className="w-3.5 h-3.5" />
              Built for Growth
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Ready to modernize your PG operations?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm leading-7 text-slate-600">
              Start with a free trial or book a guided demo and we will map your current process to the platform.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/hostel-signup" className="mk-button-primary">
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/demo" className="mk-button-secondary">Book demo</Link>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="w-3.5 h-3.5 text-[#0f6fff]" />
                Go live quickly
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0ea5a4]" />
                Built for teams
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
