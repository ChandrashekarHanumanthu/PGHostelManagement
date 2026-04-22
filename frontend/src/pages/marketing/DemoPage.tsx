import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clock3,
  CreditCard,
  MessageSquareText,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

const tourModules = [
  {
    icon: <BarChart3 className="w-4 h-4" />,
    title: 'Operations dashboard',
    text: 'Occupancy, dues, and collection signals in one view.',
  },
  {
    icon: <Users className="w-4 h-4" />,
    title: 'Tenant lifecycle',
    text: 'From invite and onboarding to room allocation and move-out.',
  },
  {
    icon: <CreditCard className="w-4 h-4" />,
    title: 'Collection workflows',
    text: 'Reminders, proofs, approvals, and payment records.',
  },
  {
    icon: <MessageSquareText className="w-4 h-4" />,
    title: 'Support and notices',
    text: 'Complaints and announcements with full status traceability.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const DemoPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pgName: '',
    city: '',
    tenantsCount: '',
    preferredDate: '',
    preferredTime: '',
    note: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 2));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="mk-section">
        <div className="mk-wrap max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mk-card p-8 text-center"
          >
            <span className="inline-flex w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </span>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">Demo request confirmed</h1>
            <p className="mt-2 text-sm text-slate-600">
              Our team will connect with you soon and confirm the exact meeting slot.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setStep(0);
              }}
              className="mk-button-secondary mt-6"
            >
              Book another demo
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="mk-section">
        <div className="mk-wrap max-w-4xl text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.45 }}>
            <span className="mk-eyebrow">
              <PlayCircle className="w-3.5 h-3.5" />
              Product Walkthrough
            </span>
            <h1 className="mk-title">
              Book a practical demo focused on
              <br />
              your PG operations.
            </h1>
            <p className="mk-subtitle max-w-3xl mx-auto">
              See how PG Manager Pro maps to your workflows in onboarding, collections, room control,
              and tenant communication.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-5 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="w-4 h-4 text-[#0f6fff]" />
                30-minute session
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0ea5a4]" />
                1:1 with product team
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                No commitment required
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mk-section mk-section-alt pt-4">
        <div className="mk-wrap">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="max-w-2xl mb-8">
            <span className="mk-eyebrow">
              <Sparkles className="w-3.5 h-3.5" />
              What You Will See
            </span>
            <h2 className="mk-title text-[clamp(1.7rem,3.2vw,2.5rem)]">A clear product tour with real scenarios.</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tourModules.map((module, idx) => (
              <motion.article
                key={module.title}
                {...fadeUp}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="mk-card p-5"
              >
                <span className="inline-flex w-9 h-9 rounded-lg bg-[#eaf3ff] border border-[#d2e4fb] text-[#0f6fff] items-center justify-center">
                  {module.icon}
                </span>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{module.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-7">{module.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-wrap grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="mk-card p-6 md:p-7">
            <h2 className="text-xl font-semibold text-slate-900">Schedule your demo</h2>
            <p className="mt-2 text-sm text-slate-600">
              Takes less than one minute. We will tailor the call to your setup.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {['Your details', 'Property info', 'Preferred slot'].map((label, idx) => (
                <React.Fragment key={label}>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${idx <= step ? 'bg-[#eaf2ff] text-[#0f6fff]' : 'bg-slate-100 text-slate-400'}`}>
                    {idx + 1}. {label}
                  </div>
                  {idx < 2 ? <span className="text-slate-300">-</span> : null}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={submitForm} className="mt-6">
              <AnimatePresence mode="wait">
                {step === 0 ? (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3.5"
                  >
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1.5">
                          Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">
                          Email *
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Phone *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <button type="button" onClick={nextStep} className="mk-button-primary w-full">
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : null}

                {step === 1 ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3.5"
                  >
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="pgName" className="block text-xs font-bold text-slate-700 mb-1.5">
                          PG / Hostel name *
                        </label>
                        <input
                          id="pgName"
                          name="pgName"
                          type="text"
                          required
                          value={formData.pgName}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                          placeholder="Your property name"
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-xs font-bold text-slate-700 mb-1.5">
                          City / Area *
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                          placeholder="Hyderabad"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="tenantsCount" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Tenant count *
                      </label>
                      <select
                        id="tenantsCount"
                        name="tenantsCount"
                        required
                        value={formData.tenantsCount}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                      >
                        <option value="">Select range</option>
                        <option value="1-20">1-20</option>
                        <option value="21-50">21-50</option>
                        <option value="51-100">51-100</option>
                        <option value="101-250">101-250</option>
                        <option value="250+">250+</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={prevStep} className="mk-button-secondary flex-1">
                        Back
                      </button>
                      <button type="button" onClick={nextStep} className="mk-button-primary flex-1">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : null}

                {step === 2 ? (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3.5"
                  >
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="preferredDate" className="block text-xs font-bold text-slate-700 mb-1.5">
                          Preferred date *
                        </label>
                        <input
                          id="preferredDate"
                          name="preferredDate"
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.preferredDate}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                        />
                      </div>
                      <div>
                        <label htmlFor="preferredTime" className="block text-xs font-bold text-slate-700 mb-1.5">
                          Preferred time *
                        </label>
                        <select
                          id="preferredTime"
                          name="preferredTime"
                          required
                          value={formData.preferredTime}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                        >
                          <option value="">Select slot</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="note" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Optional note
                      </label>
                      <textarea
                        id="note"
                        name="note"
                        rows={3}
                        value={formData.note}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none resize-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                        placeholder="Share anything specific you want us to focus on."
                      />
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={prevStep} className="mk-button-secondary flex-1">
                        Back
                      </button>
                      <button type="submit" className="mk-button-primary flex-1">
                        Confirm demo
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </form>
          </motion.div>

          <motion.aside {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }} className="space-y-4">
            <article className="mk-dark-panel p-6">
              <p className="text-xs uppercase tracking-widest text-slate-400">Expected outcomes</p>
              <h3 className="mt-2 text-xl font-semibold text-white">What teams typically gain after onboarding</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                  <span>Clear monthly collection visibility with lower follow-up load</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                  <span>Cleaner tenant records and room assignment history</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                  <span>Faster issue resolution with structured complaint workflows</span>
                </p>
              </div>
            </article>

            <article className="mk-card p-5">
              <h3 className="text-base font-semibold text-slate-900">Want to start directly?</h3>
              <p className="mt-2 text-sm text-slate-600 leading-7">
                If you already know the plan, you can start your free trial now and explore immediately.
              </p>
              <Link to="/hostel-signup" className="mk-button-secondary mt-4">
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          </motion.aside>
        </div>
      </section>

      <section className="mk-section mk-section-alt">
        <div className="mk-wrap">
          <div className="mk-dark-panel p-8 md:p-10 text-center">
            <span className="mk-eyebrow bg-white/10 border-white/20 text-[#dbeafe]">
              <CalendarClock className="w-3.5 h-3.5" />
              Plan your slot
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Let us map your current workflow into a scalable SaaS setup.
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm leading-7 text-slate-300">
              This is a practical working session focused on your occupancy, rent cycle, and day-to-day operations.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setStep(0)} className="mk-button-primary">
                Continue booking
              </button>
              <Link to="/contact" className="mk-button-secondary">Talk to support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;
