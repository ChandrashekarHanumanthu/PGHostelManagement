import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

type Plan = {
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  highlight?: string;
  features: string[];
};

const plans: Plan[] = [
  {
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    tagline: 'For new PG owners validating operations',
    features: [
      'Up to 20 tenants',
      'Single property setup',
      'Room and tenant management',
      'Basic payment tracking',
    ],
  },
  {
    name: 'Growth',
    monthly: 1499,
    yearly: 14990,
    tagline: 'For active PG businesses scaling occupancy',
    highlight: 'Most Popular',
    features: [
      'Up to 100 tenants',
      'Up to 3 properties',
      'Tenant onboarding links',
      'Payment workflows and reminders',
      'Complaints and notices',
      'Priority support',
    ],
  },
  {
    name: 'Scale',
    monthly: 4999,
    yearly: 49990,
    tagline: 'For multi-property operators',
    features: [
      'Up to 500 tenants',
      'Up to 10 properties',
      'Everything in Growth',
      'Advanced reporting',
      'Operational control views',
      'Phone support',
    ],
  },
  {
    name: 'Enterprise',
    monthly: -1,
    yearly: -1,
    tagline: 'For large chains and managed operations',
    features: [
      'Unlimited tenants and properties',
      'Dedicated onboarding team',
      'Custom implementation support',
      'Priority response SLAs',
    ],
  },
];

const faq = [
  { q: 'Can I switch plans later?', a: 'Yes. You can upgrade as you scale and move between plans based on operational needs.' },
  { q: 'Do you help with setup?', a: 'Yes. We provide onboarding guidance and migration help based on your plan.' },
  { q: 'Do I need a credit card for trial?', a: 'No. You can start with zero payment details and evaluate the product first.' },
  { q: 'Is annual billing discounted?', a: 'Yes. Annual plans are discounted versus equivalent monthly billing.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const PricingPage: React.FC = () => {
  const [yearly, setYearly] = useState(false);

  const normalizedPlans = useMemo(
    () =>
      plans.map((plan) => {
        if (plan.monthly <= 0) return { ...plan, shownPrice: plan.monthly };
        const shownPrice = yearly ? Math.round(plan.yearly / 12) : plan.monthly;
        return { ...plan, shownPrice };
      }),
    [yearly]
  );

  return (
    <div>
      <section className="mk-section">
        <div className="mk-wrap max-w-4xl text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.45 }}>
            <span className="mk-eyebrow">
              <Sparkles className="w-3.5 h-3.5" />
              Transparent Pricing
            </span>
            <h1 className="mk-title">
              Choose a plan that matches
              <br />
              your occupancy and growth stage.
            </h1>
            <p className="mk-subtitle max-w-2xl mx-auto">
              Start lean, then scale into advanced workflows as your tenant base expands.
              No lock-in contracts.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.05 }} className="mt-7 inline-flex p-1 rounded-full border border-[#cbd9ed] bg-white">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${!yearly ? 'bg-[#0f6fff] text-white' : 'text-slate-600'}`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${yearly ? 'bg-[#0f6fff] text-white' : 'text-slate-600'}`}
            >
              Yearly (save 17%)
            </button>
          </motion.div>
        </div>
      </section>

      <section className="mk-section mk-section-alt pt-4">
        <div className="mk-wrap grid lg:grid-cols-4 md:grid-cols-2 gap-4">
          {normalizedPlans.map((plan, idx) => (
            <motion.article
              key={plan.name}
              {...fadeUp}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className={`mk-card p-6 flex flex-col ${plan.highlight ? 'border-[#9ec4fa] ring-1 ring-[#b8d4fb]' : ''}`}
            >
              {plan.highlight ? (
                <span className="inline-flex w-fit mb-3 text-[11px] px-2.5 py-1 rounded-full bg-[#e8f2ff] text-[#0f6fff] font-bold">
                  {plan.highlight}
                </span>
              ) : null}
              <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
              <p className="text-sm text-slate-600 mt-1 leading-6">{plan.tagline}</p>

              <div className="mt-6">
                {plan.shownPrice === 0 ? (
                  <p className="text-4xl font-semibold text-slate-900">Free</p>
                ) : plan.shownPrice < 0 ? (
                  <p className="text-3xl font-semibold text-slate-900">Custom</p>
                ) : (
                  <>
                    <p className="text-4xl font-semibold text-slate-900">₹{plan.shownPrice.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">per month</p>
                  </>
                )}
              </div>

              <Link
                to={plan.shownPrice < 0 ? '/contact' : '/hostel-signup'}
                className={`mt-6 ${plan.highlight ? 'mk-button-primary' : 'mk-button-secondary'} w-full`}
              >
                {plan.shownPrice < 0 ? 'Contact sales' : 'Start trial'}
              </Link>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600 leading-6">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mk-section">
        <div className="mk-wrap grid md:grid-cols-2 gap-4">
          {faq.map((item, idx) => (
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
      </section>

      <section className="mk-section">
        <div className="mk-wrap">
          <div className="mk-dark-panel p-8 md:p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Need help choosing the right plan?
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 max-w-2xl mx-auto">
              We can map your current tenant volume and process complexity to the most cost-effective plan.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/demo" className="mk-button-primary">
                Book consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="mk-button-secondary">Talk to support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
