import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Headerhome from "../components/Headerhome";
import '../index.css';

export function Homepage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("autotoken69");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-blue-900">
      <Headerhome />

      {/* Hero Section */}
      <section className="relative py-32 px-6 md:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 blur-3xl" />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent mb-8 leading-tight">
              AI-Powered Code Perfection
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Transform your code with intelligent debugging, real-time optimization, and expert-level explanations
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/signup"
                className="relative group bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-900 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300"
              >
                <span className="relative z-10">Start Debugging Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-cyan-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 px-6 md:px-20 bg-slate-800/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <motion.h2 initial="hidden" animate="visible" variants={slideUp} className="text-4xl font-bold text-center text-emerald-300 mb-20">
            Why CodeLens?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Deep Code Analysis",
                icon: "🔍",
                desc: "Context-aware error detection across 20+ languages",
                bg: "bg-emerald-500/10",
              },
              {
                title: "AI Explanations",
                icon: "🧠",
                desc: "Human-readable solutions with code examples",
                bg: "bg-cyan-500/10",
              },
              {
                title: "Real-Time Fixes",
                icon: "⚡",
                desc: "Instant optimizations with version comparisons",
                bg: "bg-blue-500/10",
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-2xl border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm hover:border-emerald-400/30 transition-all"
              >
                <div className={`text-5xl mb-6 p-4 rounded-lg w-max ${feature.bg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-emerald-200 mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Demo Section */}
      <section className="py-28 px-6 md:px-20 bg-gradient-to-br from-slate-900 to-emerald-900">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={slideUp} className="text-center mb-20">
            <h2 className="text-4xl font-bold text-emerald-300 mb-6">See It in Action</h2>
            <p className="text-slate-400 text-xl">From broken code to polished solution</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeIn} className="space-y-8">
              <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
                <h4 className="text-xl font-semibold text-emerald-200 mb-4">Original Code</h4>
                <pre className="p-4 rounded-lg bg-slate-900/50 text-slate-300 text-sm font-mono">
                  {`function sum(arr) {\n  let total = 0;\n  for (i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total\n}`}
                </pre>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="space-y-8">
              <div className="p-6 rounded-xl bg-slate-800/30 border border-emerald-700/50 backdrop-blur-sm">
                <h4 className="text-xl font-semibold text-emerald-200 mb-4">Optimized Solution</h4>
                <pre className="p-4 rounded-lg bg-slate-900/50 text-slate-300 text-sm font-mono">
                  {`function sum(array) {\n  return array.reduce(\n    (accumulator, current) => accumulator + current,\n    0\n  );\n}`}
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 px-6 md:px-20 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-20" initial="hidden" animate="visible" variants={slideUp}>
            <h2 className="text-4xl font-bold text-emerald-300 mb-6">Smart Debugging Features</h2>
            <p className="text-slate-400 text-xl">Beyond basic error detection</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              "Performance optimization",
              "Code style enforcement",
              "Interactive debugging",
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="p-6 bg-slate-800/30 rounded-xl border border-slate-700/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-emerald-400/10 rounded-lg flex items-center justify-center text-emerald-400">
                    ✔️
                  </div>
                  <span className="text-slate-300 text-lg">{feature}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 md:px-20 bg-gradient-to-br from-slate-900 to-emerald-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="p-8 rounded-3xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-4xl font-bold text-emerald-300 mb-6">Start Coding Confidently</h2>
            <p className="text-slate-400 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of developers shipping better code daily
            </p>
            <div className="flex justify-center gap-6">
              <Link
                to="/signup"
                className="px-12 py-5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-emerald-400/20"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-lg border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              CodeLens
            </div>
            <div className="flex gap-8">
              <Link to="/docs" className="text-slate-400 hover:text-emerald-300 transition-colors">Documentation</Link>
              <Link to="/support" className="text-slate-400 hover:text-emerald-300 transition-colors">Support</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-slate-500 text-sm">
            © 2024 CodeLens. Intelligent debugging for modern developers.
          </div>
        </div>
      </footer>
    </div>
  );
}