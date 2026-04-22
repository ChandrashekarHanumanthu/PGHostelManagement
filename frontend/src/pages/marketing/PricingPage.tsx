import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check, X, ArrowRight, Building2, Users, Shield, Zap,
  TrendingUp, CheckCircle, Calculator, Sparkles, Star, Crown
} from 'lucide-react';

const PricingPage = () => {
  const [yearly, setYearly] = useState(false);
  const [tenants, setTenants] = useState(50);
  const [hours, setHours] = useState(30);

  /* ROI calc */
  const hourlyRate = 200; // ₹ per hour of owner/manager time
  const monthlySaved = hours * 4 * hourlyRate; // weekly hours * 4 weeks * rate
  const yearlySaved = monthlySaved * 12;
  const suggestedPlan = tenants <= 20 ? 0 : tenants <= 100 ? 1 : tenants <= 500 ? 2 : 3;

  const plans = [
    {
      name: 'Starter', price: { m: 0, y: 0 }, popular: false,
      tagline: 'Free forever for small PGs',
      badge: null,
      features: ['Up to 20 tenants', '1 property', 'Basic tenant management', 'Room allocation', 'Payment tracking', 'Email support'],
    },
    {
      name: 'Pro', price: { m: 1499, y: 14990 }, popular: true,
      tagline: 'For serious PG operators',
      badge: 'Most Popular',
      features: ['Up to 100 tenants', '3 properties', 'Online payment collection', 'Mobile app for tenants', 'Advanced analytics', 'Complaint management', 'Auto invoicing', 'Priority support'],
    },
    {
      name: 'Business', price: { m: 4999, y: 49990 }, popular: false,
      tagline: 'For multi-property businesses',
      badge: 'Best Value',
      features: ['Up to 500 tenants', '10 properties', 'Everything in Pro', 'Owner + tenant mobile apps', 'Automated payments', 'API access', 'Custom reports', 'Priority phone support'],
    },
    {
      name: 'Enterprise', price: { m: -1, y: -1 }, popular: false,
      tagline: 'For hostel chains at scale',
      badge: null,
      features: ['Unlimited everything', 'Custom branding', 'Dedicated account manager', 'Custom integrations', 'SLA guarantees', '24/7 phone support', 'On-site training', 'Custom development'],
    },
  ];

  const fadeUp = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ HERO ═══ */}
      <section className="pt-28 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-3 h-3 mr-1" /> Pricing
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
              Invest ₹50/day.<br />
              <span className="text-gradient-brand">Save ₹50,000/month.</span>
            </h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto mb-6">
              Every plan pays for itself in the first month. Start free, upgrade when you're ready.
            </p>
            <div className="inline-flex bg-surface-50 rounded-full p-1 border border-gray-100">
              <button onClick={() => setYearly(false)} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${!yearly ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Monthly</button>
              <button onClick={() => setYearly(true)} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${yearly ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                Yearly <span className="ml-1 text-[10px] text-emerald-600 font-bold">SAVE 17%</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ PRICING CARDS ═══ */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan, i) => (
            <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`relative rounded-xl overflow-hidden border flex flex-col ${plan.popular ? 'border-brand-300 shadow-xl shadow-brand-500/10 ring-1 ring-brand-200 scale-[1.02]' : 'border-gray-100 shadow-sm'} ${i === suggestedPlan ? '' : ''}`}>
              {plan.badge && (
                <div className={`text-center py-1 text-[10px] font-bold uppercase tracking-wider ${plan.popular ? 'bg-gradient-to-r from-brand-500 to-purple-500 text-white' : 'bg-amber-100 text-amber-700'}`}>{plan.badge}</div>
              )}
              <div className="bg-white p-5 flex-1 flex flex-col">
                <h3 className="font-heading text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="text-[10px] text-gray-400 mb-3">{plan.tagline}</p>
                <div className="mb-4">
                  {plan.price.m === 0 ? (
                    <div><span className="text-3xl font-heading font-bold text-gray-900">Free</span><span className="text-xs text-gray-400 ml-1">forever</span></div>
                  ) : plan.price.m === -1 ? (
                    <div><span className="text-2xl font-heading font-bold text-gray-900">Custom</span><span className="text-xs text-gray-400 ml-1">let's talk</span></div>
                  ) : (
                    <div>
                      <span className="text-3xl font-heading font-bold text-gray-900">₹{(yearly ? Math.round(plan.price.y / 12) : plan.price.m).toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-1">/mo</span>
                      {yearly && <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Billed ₹{plan.price.y.toLocaleString()}/yr</div>}
                    </div>
                  )}
                </div>
                <Link to={plan.price.m === -1 ? '/contact' : '/hostel-signup'}
                  className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all mb-4 ${plan.popular ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/25 hover:from-brand-700 hover:to-brand-600' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                  {plan.price.m === -1 ? 'Contact Sales' : plan.price.m === 0 ? 'Get Started' : 'Start Free Trial'}
                </Link>
                <div className="space-y-1.5 flex-1">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-600">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ ROI CALCULATOR ═══ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-surface-50">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center mb-8">
            <span className="inline-flex items-center text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-3">
              <Calculator className="w-3 h-3 mr-1" /> ROI Calculator
            </span>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Calculate your savings</h2>
            <p className="text-sm text-gray-500">See how much time and money PG Manager Pro saves you</p>
          </motion.div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="space-y-5">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2">
                    <span>Number of Tenants</span>
                    <span className="text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{tenants}</span>
                  </label>
                  <input type="range" min={5} max={500} value={tenants} onChange={e => setTenants(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full bg-gray-200 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:cursor-pointer" />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>5</span><span>500</span></div>
                </div>
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2">
                    <span>Hours spent on PG management / week</span>
                    <span className="text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{hours}h</span>
                  </label>
                  <input type="range" min={5} max={80} value={hours} onChange={e => setHours(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full bg-gray-200 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:cursor-pointer" />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>5h</span><span>80h</span></div>
                </div>
                <div className="bg-brand-50 rounded-lg p-3 border border-brand-100">
                  <div className="text-[10px] text-brand-600 font-semibold mb-1">RECOMMENDED PLAN</div>
                  <div className="text-sm font-bold text-brand-700">
                    {plans[suggestedPlan].name} — {plans[suggestedPlan].price.m === 0 ? 'Free' : plans[suggestedPlan].price.m === -1 ? 'Custom' : `₹${plans[suggestedPlan].price.m.toLocaleString()}/mo`}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Estimated Savings</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] text-slate-400">Monthly time saved</div>
                    <div className="text-2xl font-heading font-bold text-emerald-400">{Math.round(hours * 0.7 * 4)} hours</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Monthly value of time saved</div>
                    <div className="text-2xl font-heading font-bold text-emerald-400">₹{monthlySaved.toLocaleString()}</div>
                  </div>
                  <div className="section-divider" />
                  <div>
                    <div className="text-[10px] text-slate-400">Annual savings</div>
                    <div className="text-3xl font-heading font-bold text-white">₹{yearlySaved.toLocaleString()}</div>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold">
                    That's a {Math.round(yearlySaved / ((plans[suggestedPlan].price.m || 1) * 12) * 100)}% return on your investment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST SIGNALS ═══ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">No risk. No lock-in.</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: <Shield className="w-5 h-5" />, title: '14-Day Free Trial', desc: 'Full access. No credit card.' },
              { icon: <Zap className="w-5 h-5" />, title: 'Cancel Anytime', desc: 'No contracts. No penalties.' },
              { icon: <TrendingUp className="w-5 h-5" />, title: 'Free Migration', desc: 'We import your existing data.' },
              { icon: <Users className="w-5 h-5" />, title: 'Free Onboarding', desc: 'Dedicated setup assistance.' },
            ].map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-surface-50 rounded-xl p-5 border border-gray-100 text-center card-hover">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 text-brand-600 mb-3">{t.icon}</div>
                <h3 className="text-xs font-bold text-gray-900 mb-0.5">{t.title}</h3>
                <p className="text-[10px] text-gray-500">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-15" />
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-3">Start free. Scale when ready.</h2>
          <p className="text-sm text-slate-300 mb-6">150+ PG owners already made the switch. Your turn.</p>
          <Link to="/hostel-signup" className="inline-flex items-center px-8 py-3.5 bg-white text-brand-700 font-bold rounded-xl hover:bg-gray-50 shadow-xl text-sm transition-all hover:-translate-y-0.5">
            Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
