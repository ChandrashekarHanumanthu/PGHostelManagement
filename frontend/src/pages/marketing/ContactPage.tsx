import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Headset,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
} from 'lucide-react';

const channels = [
  {
    id: 'chat',
    title: 'Live chat',
    action: 'Fastest response',
    icon: <MessageSquareText className="w-4 h-4" />,
    details: ['Mon-Sat support window', 'Quick product and setup questions', 'Average response in minutes'],
  },
  {
    id: 'email',
    title: 'Email',
    action: 'hello@pgmanagerpro.com',
    icon: <Mail className="w-4 h-4" />,
    details: ['Best for detailed queries', 'Structured follow-up by team', 'Typical response within 4 hours'],
  },
  {
    id: 'call',
    title: 'Phone',
    action: '+91 80109 42551',
    icon: <Phone className="w-4 h-4" />,
    details: ['Direct call with support', 'No IVR workflow', 'Good for urgent operator issues'],
  },
];

const quickFaq = [
  {
    q: 'How quickly do you respond?',
    a: 'Live chat is fastest. Email replies usually arrive within 4 business hours.',
  },
  {
    q: 'Can you help with onboarding?',
    a: 'Yes. We help with setup, tenant migration guidance, and rollout best practices.',
  },
  {
    q: 'Do you support enterprise teams?',
    a: 'Yes. We provide priority support and tailored onboarding for larger properties.',
  },
  {
    q: 'Can I schedule a product call?',
    a: 'Yes. Use our demo route and choose your preferred slot.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const ContactPage: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">Message received</h1>
            <p className="mt-2 text-sm text-slate-600">
              Our team will get back to you shortly. You can also call us for faster support.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mk-button-secondary mt-6"
            >
              Send another message
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
              <Headset className="w-3.5 h-3.5" />
              Contact Support
            </span>
            <h1 className="mk-title">
              Reach the PG Manager Pro team
              <br />
              without waiting in long queues.
            </h1>
            <p className="mk-subtitle max-w-3xl mx-auto">
              Pick your preferred channel for product questions, onboarding help, or account support.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mk-section mk-section-alt pt-4">
        <div className="mk-wrap">
          <div className="grid md:grid-cols-3 gap-3">
            {channels.map((channel, idx) => (
              <button
                key={channel.id}
                type="button"
                onClick={() => setActiveChannel(idx)}
                className={`mk-card p-5 text-left transition-all ${
                  activeChannel === idx ? 'border-[#9cc3fa] ring-1 ring-[#b9d5fb]' : ''
                }`}
              >
                <span className="inline-flex w-9 h-9 rounded-lg bg-[#eaf3ff] border border-[#d2e4fb] text-[#0f6fff] items-center justify-center">
                  {channel.icon}
                </span>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{channel.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{channel.action}</p>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={channels[activeChannel].id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mk-card mt-4 p-5"
            >
              <div className="grid md:grid-cols-3 gap-3">
                {channels[activeChannel].details.map((item) => (
                  <p key={item} className="text-sm text-slate-600 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-wrap grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="mk-card p-6 md:p-7">
            <h2 className="text-xl font-semibold text-slate-900">Send us a message</h2>
            <p className="mt-2 text-sm text-slate-600">
              Share what you need and we will route it to the right team quickly.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
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
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                  >
                    <option value="">Choose topic</option>
                    <option value="demo">Book a demo</option>
                    <option value="pricing">Pricing and plans</option>
                    <option value="setup">Setup and onboarding</option>
                    <option value="support">Support request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#d2deec] bg-white px-3 py-2.5 text-sm text-slate-800 outline-none resize-none focus:border-[#93bcfb] focus:ring-2 focus:ring-[#dbeafe]"
                  placeholder="Tell us how we can help."
                />
              </div>

              <button type="submit" className="mk-button-primary w-full">
                Send message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

          <motion.aside {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }} className="space-y-4">
            <article className="mk-dark-panel p-6">
              <h3 className="text-lg font-semibold text-white">Support desk</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="flex items-start gap-2">
                  <Clock3 className="w-4 h-4 mt-0.5 text-[#93c5fd] shrink-0" />
                  <span>Monday to Saturday, 9:00 AM to 6:00 PM</span>
                </p>
                <p className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-[#93c5fd] shrink-0" />
                  <a href="mailto:hello@pgmanagerpro.com">hello@pgmanagerpro.com</a>
                </p>
                <p className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-[#93c5fd] shrink-0" />
                  <a href="tel:+918010942551">+91 80109 42551</a>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#93c5fd] shrink-0" />
                  <span>HITEC City, Hyderabad, Telangana</span>
                </p>
              </div>
            </article>

            <article className="mk-card p-5">
              <h3 className="text-base font-semibold text-slate-900">Need a guided walkthrough?</h3>
              <p className="mt-2 text-sm text-slate-600 leading-7">
                Book a 30-minute product consultation for your exact PG operations.
              </p>
              <Link to="/demo" className="mk-button-secondary mt-4">
                Schedule demo
                <CalendarDays className="w-4 h-4" />
              </Link>
            </article>
          </motion.aside>
        </div>
      </section>

      <section className="mk-section mk-section-alt">
        <div className="mk-wrap">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="max-w-2xl mb-8">
            <span className="mk-eyebrow">
              <HelpCircle className="w-3.5 h-3.5" />
              Quick Answers
            </span>
            <h2 className="mk-title text-[clamp(1.7rem,3.2vw,2.5rem)]">Common questions before teams reach out.</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {quickFaq.map((item, idx) => (
              <motion.article
                key={item.q}
                {...fadeUp}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="mk-card p-5"
              >
                <h3 className="text-base font-semibold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-7">{item.a}</p>
              </motion.article>
            ))}
          </div>

          <div className="mk-dark-panel p-8 md:p-10 mt-8 text-center">
            <span className="mk-eyebrow bg-white/10 border-white/20 text-[#dbeafe]">Next step</span>
            <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Ready to get your team onboard quickly?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm leading-7 text-slate-300">
              Start a free trial now or schedule a guided call and we will help you map your rollout plan.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/hostel-signup" className="mk-button-primary">
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/demo" className="mk-button-secondary">Book live demo</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
