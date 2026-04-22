import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Users, Target, Award, Heart, Shield, TrendingUp,
  ArrowRight, Sparkles, Rocket, Globe, Lightbulb, CheckCircle,
  MapPin, Zap, Star, Coffee, Code, Headphones
} from 'lucide-react';

const AboutPage = () => {
  const fadeUp = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

  /* ── Journey Timeline ── */
  const timeline = [
    { year: '2022', title: 'The Problem', desc: 'Our founders managed 3 PGs in Hyderabad using registers, WhatsApp, and Excel. They lost ₹2L to missed payments.', icon: <Lightbulb className="w-4 h-4" />, color: 'bg-amber-500' },
    { year: '2023', title: 'The Build', desc: 'Quit jobs. Built the first version in 6 months. Tested with 5 PG owners. Iterated 47 times.', icon: <Code className="w-4 h-4" />, color: 'bg-blue-500' },
    { year: '2024', title: 'The Growth', desc: 'Launched publicly. Hit 50 PGs in 4 months. Raised seed funding. Expanded team to 15.', icon: <Rocket className="w-4 h-4" />, color: 'bg-purple-500' },
    { year: '2025', title: 'The Scale', desc: '150+ PGs, 5,000+ tenants across 12 cities. Processing ₹2Cr+ in monthly rent collections.', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-emerald-500' },
  ];

  /* ── Culture Values ── */
  const culture = [
    { emoji: '🚀', title: 'Ship Fast, Learn Faster', desc: 'We deploy every week. Customer feedback drives our roadmap, not assumptions.' },
    { emoji: '🤝', title: 'Owner Empathy', desc: 'Every team member spends time with real PG owners monthly. We build what they need.' },
    { emoji: '🔍', title: 'Obsess Over Details', desc: 'From pixel-perfect UI to the last edge case in rent calculation. Details matter.' },
    { emoji: '💪', title: 'Do More With Less', desc: 'Small team, big impact. 15 people serving 150+ PGs and 5,000+ tenants.' },
  ];

  /* ── Team ── */
  const team = [
    { name: 'Rajesh Kumar', role: 'Co-founder & CEO', bio: 'Managed 3 PGs himself. Knows every pain point first-hand. Ex-real estate at JLL.', initials: 'RK', gradient: 'from-brand-500 to-indigo-500' },
    { name: 'Priya Sharma', role: 'Co-founder & CTO', bio: 'Built payments infra at Razorpay. Obsessed with making complex things simple.', initials: 'PS', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Vikram Reddy', role: 'Head of Product', bio: 'Ex-Freshworks. Designs products that PG owners love, not just use.', initials: 'VR', gradient: 'from-emerald-500 to-teal-500' },
    { name: 'Ananya Singh', role: 'Head of Growth', bio: 'Grew Zolo\'s Hyderabad market 5x. Knows every PG cluster in the city.', initials: 'AS', gradient: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ HERO — Narrative-driven ═══ */}
      <section className="pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
            <span className="inline-flex items-center text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-4">
              <Heart className="w-3 h-3 mr-1" /> Our Story
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              We lost ₹2 Lakh to missed payments.<br />
              <span className="text-gradient-brand">So we built the fix.</span>
            </h1>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              PG Manager Pro wasn't born in a boardroom — it was born from the frustration of running PGs with registers, WhatsApp groups, and Excel sheets. We lived the problem. Now we're solving it for 150+ PGs.
            </p>
          </motion.div>

          {/* Key numbers strip */}
          <motion.div {...fadeUp} transition={{ duration: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { num: '150+', label: 'PGs Trust Us', icon: <Building2 className="w-4 h-4" /> },
              { num: '5,000+', label: 'Tenants Served', icon: <Users className="w-4 h-4" /> },
              { num: '₹2Cr+', label: 'Monthly Volume', icon: <TrendingUp className="w-4 h-4" /> },
              { num: '12', label: 'Cities', icon: <MapPin className="w-4 h-4" /> },
            ].map((s, i) => (
              <div key={i} className="bg-surface-50 rounded-xl p-4 border border-gray-100 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-brand-50 text-brand-600 mb-2">{s.icon}</div>
                <div className="text-xl font-heading font-bold text-gray-900">{s.num}</div>
                <div className="text-[10px] text-gray-500">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ JOURNEY TIMELINE ═══ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Our journey</h2>
            <p className="text-sm text-gray-500">From frustrated PG owners to India's fastest-growing PG management platform</p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-300 via-purple-400 to-emerald-400" />
            <div className="space-y-6">
              {timeline.map((t, i) => (
                <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative flex gap-5">
                  <div className={`relative z-10 w-10 h-10 shrink-0 ${t.color} rounded-xl flex items-center justify-center text-white shadow-md`}>{t.icon}</div>
                  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex-1">
                    <div className="text-[10px] font-bold text-brand-500 uppercase tracking-wider mb-1">{t.year}</div>
                    <h3 className="text-sm font-heading font-bold text-gray-900 mb-1">{t.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CULTURE ═══ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">How we think</h2>
            <p className="text-sm text-gray-500">The principles that drive every decision</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-4">
            {culture.map((c, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-surface-50 rounded-xl p-5 border border-gray-100 card-hover">
                <div className="text-2xl mb-2">{c.emoji}</div>
                <h3 className="text-sm font-heading font-bold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">The people building this</h2>
            <p className="text-sm text-gray-500">Small team, big ambitions</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((m, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm card-hover group">
                <div className={`bg-gradient-to-br ${m.gradient} h-24 flex items-center justify-center`}>
                  <span className="text-2xl font-heading font-bold text-white/90 group-hover:scale-110 transition-transform">{m.initials}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-heading font-bold text-gray-900">{m.name}</h3>
                  <p className="text-[10px] text-brand-600 font-semibold mb-1.5">{m.role}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{m.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BACKED BY ═══ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.15em] mb-4">Backed by</p>
            <div className="flex flex-wrap justify-center items-center gap-6 opacity-40">
              {['Y Combinator', 'Sequoia Scout', 'T-Hub', 'NASSCOM'].map((b, i) => (
                <span key={i} className="font-heading text-base font-bold text-gray-900">{b}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ JOIN US CTA ═══ */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-15" />
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-6 text-center sm:text-left items-center">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white mb-2">Join our mission</h2>
              <p className="text-sm text-slate-300">Whether you're a PG owner looking to modernize or a builder who wants to join the team.</p>
            </div>
            <div className="flex gap-3 justify-center sm:justify-end">
              <Link to="/hostel-signup" className="px-6 py-2.5 bg-white text-brand-700 font-bold rounded-xl hover:bg-gray-50 shadow-xl text-sm transition-all">Get Started</Link>
              <Link to="/contact" className="px-6 py-2.5 bg-white/10 text-white font-semibold rounded-xl border border-white/15 hover:bg-white/20 transition-all text-sm">We're Hiring</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
