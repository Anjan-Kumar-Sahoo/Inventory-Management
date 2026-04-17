import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  darkMode: boolean;
  onToggleTheme: () => void;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, darkMode, onToggleTheme, children }) => {
  return (
    <div className={darkMode ? 'min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-slate-100 text-slate-900'}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex justify-end mb-6">
          <button
            onClick={onToggleTheme}
            className={darkMode
              ? 'px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors'
              : 'px-3 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/logo.png" alt="Inventory logo" className="h-16 mb-6" />
            <h1 className="text-4xl font-bold mb-3">{title}</h1>
            <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className={darkMode
              ? 'bg-slate-900 border border-slate-800 rounded-2xl p-6'
              : 'bg-white border border-slate-200 rounded-2xl p-6'}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
