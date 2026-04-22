import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Users, Shield, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingPage: React.FC = () => {
  const { hostelName } = useAuth();
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6" style={{fontFamily: 'santhoshi, sans-serif'}}
            >
              Manage Your
              <span className="text-blue-600">
                {' '}Hostel Business
              </span>
              <br />
              Like a Pro
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Complete PG/Hostel management solution. Handle tenants, rooms, payments, and complaints - 
              all in one place. Perfect for single hostels or multi-property businesses.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/hostel-signup"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all text-lg" style={{fontFamily: 'santhoshi, sans-serif'}}
              >
                <Building2 className="w-5 h-5 mr-2" />
                Register your Hostel
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all text-lg"
              >
                Sign In to Existing Hostel
              </Link>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Tenant Management",
                description: "Easy tenant onboarding, profile management, and room allocation with automated workflows."
              },
              {
                icon: <Building2 className="w-8 h-8 text-purple-600" />,
                title: "Room Management",
                description: "Configure room types, track occupancy, manage maintenance, and optimize your space utilization."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                title: "Payment Tracking",
                description: "Automated rent collection, payment history, overdue tracking, and financial reporting."
              },
              {
                icon: <Shield className="w-8 h-8 text-red-600" />,
                title: "Secure & Multi-Tenant",
                description: "Each hostel has isolated data. Bank-level security with role-based access control."
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-indigo-600" />,
                title: "Complaint System",
                description: "Track and resolve tenant issues efficiently with status updates and communication tools."
              },
              {
                icon: <Building2 className="w-8 h-8 text-orange-600" />,
                title: "Multi-Property Ready",
                description: "Scale from one hostel to unlimited properties. Each with independent admin access."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-center text-white"
          >
            <h2 className="text-3xl font-semibold mb-4">
              Ready to Transform Your Hostel Management?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of hostel owners who've streamlined their operations with PG Manager Pro.
            </p>
            <Link
              to="/hostel-signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all text-lg"
            >
              Get Started Now - It's Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 {hostelName || 'PG Manager Pro'}. Built for hostel owners, by hostel owners.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
