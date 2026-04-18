import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Barcode,
  BellRing,
  BookOpen,
  CheckCircle2,
  Clock3,
  Moon,
  ShieldCheck,
  Sun,
  WifiOff,
  XCircle,
} from 'lucide-react';

interface LandingPageProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

type BenefitCard = {
  title: string;
  summary: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const benefitCards: BenefitCard[] = [
  {
    title: 'Easy Stock Entry',
    summary: 'Barcode-first, keyboard-fast flow',
    description:
      'Scan barcode or search by name. Add quantity and save in seconds, even when the shop is busy.',
    icon: Barcode,
    accent: 'from-[#4DA3FF]/30 to-[#44E8A7]/20',
  },
  {
    title: 'Low Stock Alerts',
    summary: 'Know before shelves go empty',
    description:
      'Get clear low-stock warnings so you can reorder on time and avoid losing daily walk-in customers.',
    icon: BellRing,
    accent: 'from-[#5BA5FF]/30 to-[#4CC38A]/20',
  },
  {
    title: 'Daily Sales Summaries',
    summary: 'Quick view of sales and margin',
    description:
      'See what sold today, what moved slowly, and your running profit without manual calculator work.',
    icon: BookOpen,
    accent: 'from-[#3A8BFF]/30 to-[#2FB67A]/20',
  },
  {
    title: 'Offline Functionality',
    summary: 'Works through patchy internet',
    description:
      'Continue billing and stock updates when network drops. Sync safely when the connection returns.',
    icon: WifiOff,
    accent: 'from-[#5E9CFF]/30 to-[#3FB882]/20',
  },
];

const oldWayPoints = [
  'Stock counted from memory or old notebook pages',
  'Items missed during fast billing hours',
  'Manual totals with calculator mistakes',
  'No reliable backup if notebook is lost',
];

const newWayPoints = [
  'Live stock count you can trust at any time',
  'Automatic alerts for low quantity products',
  'Daily summary with sale and profit clarity',
  'Secure digital records tied to your account',
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
    },
  },
};

export const LandingPage: React.FC<LandingPageProps> = ({
  darkMode,
  onToggleTheme,
  onGoToLogin,
  onGoToRegister,
}) => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--on-surface)] relative overflow-x-hidden transition-colors duration-500">
      <div className="ambient-glow ambient-glow-primary fixed top-[-20%] left-[-10%] w-[55%] h-[55%] bg-[#1E4C86] opacity-20 blur-[130px] pointer-events-none" />
      <div className="ambient-glow ambient-glow-secondary fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#1E7A55] opacity-20 blur-[140px] pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 py-4 pointer-events-none bg-[var(--bg-main)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 pointer-events-auto">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 text-left"
          >
            <div className="logo-container group cursor-pointer">
              <img
                src="/logo.png"
                alt="Godamm logo"
                className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
            </div>
            <div className="hidden min-[380px]:block">
              <p className="text-[11px] sm:text-xs font-black text-[var(--on-surface)] tracking-tight">Godamm</p>
              <p className="hidden sm:block text-[10px] text-[var(--on-surface-low)] uppercase tracking-[0.18em] opacity-70">
                Inventory for local shops
              </p>
            </div>
          </button>

          <nav className="hidden md:flex p-1.5 items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            <a
              href="#features"
              className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--on-surface-low)] hover:text-[var(--on-surface)] hover:bg-white/5 transition-all"
            >
              Features
            </a>
            <a
              href="#comparison"
              className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--on-surface-low)] hover:text-[var(--on-surface)] hover:bg-white/5 transition-all"
            >
              Old vs New
            </a>
            <a
              href="#start"
              className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--on-surface-low)] hover:text-[var(--on-surface)] hover:bg-white/5 transition-all"
            >
              Start Free
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={onToggleTheme}
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              title={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              className="flex items-center justify-center w-10 h-10 rounded-2xl glass-card border-[rgba(255,255,255,0.05)] text-[var(--on-surface-low)] hover:text-[var(--on-surface)] hover:bg-white/5 transition-all duration-300"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#FDE047]" /> : <Moon className="w-4 h-4 text-[#60A5FA]" />}
            </button>
            <button
              onClick={onGoToLogin}
              className="px-3 sm:px-5 py-2.5 rounded-2xl border border-[var(--border)] text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[var(--on-surface)] hover:bg-white/5 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={onGoToRegister}
              className="group inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1E4C86] to-[#1E7A55] text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] transition-all shadow-[0_10px_30px_rgba(30,76,134,0.35)] hover:shadow-[0_12px_36px_rgba(30,122,85,0.35)]"
            >
              Register
              <ArrowRight className="hidden min-[380px]:block w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-28 sm:pt-32 pb-14">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-10 lg:gap-14 items-start"
          >
            <motion.div variants={itemVariants} className="space-y-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#1E7A55]/30 bg-[#1E7A55]/10 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-[#4DE0A0]">
                Built for kirana, boutique, and hardware stores
              </span>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-[-0.03em] text-[var(--on-surface)]">
                  Run your shop with peace of mind and save time every day.
                </h1>
                <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--on-surface-low)]">
                  Stop guessing stock and profit from notebooks. Godamm helps you track items, sales, and low-stock
                  alerts in one simple dashboard your staff can learn quickly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4" id="start">
                <button
                  onClick={onGoToRegister}
                  className="group inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#1D4E89] to-[#1F7C58] text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_rgba(29,78,137,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  Start Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onGoToLogin}
                  className="inline-flex justify-center items-center px-6 py-3.5 rounded-2xl border border-[var(--border)] text-sm font-bold uppercase tracking-[0.14em] text-[var(--on-surface)] hover:bg-white/5 transition-all"
                >
                  Already have account? Sign In
                </button>
              </div>

              <motion.div variants={itemVariants} className="grid sm:grid-cols-3 gap-3">
                <div className="glass-card px-4 py-4 border-[rgba(255,255,255,0.08)]">
                  <p className="text-xs uppercase tracking-[0.13em] text-[var(--on-surface-low)]">Time saved</p>
                  <p className="mt-1 text-xl font-black text-[var(--on-surface)]">2+ hrs/day</p>
                  <p className="text-xs text-[var(--on-surface-low)]">No manual tally at closing time</p>
                </div>
                <div className="glass-card px-4 py-4 border-[rgba(255,255,255,0.08)]">
                  <p className="text-xs uppercase tracking-[0.13em] text-[var(--on-surface-low)]">Stock clarity</p>
                  <p className="mt-1 text-xl font-black text-[var(--on-surface)]">Live count</p>
                  <p className="text-xs text-[var(--on-surface-low)]">Know what is available instantly</p>
                </div>
                <div className="glass-card px-4 py-4 border-[rgba(255,255,255,0.08)]">
                  <p className="text-xs uppercase tracking-[0.13em] text-[var(--on-surface-low)]">Confidence</p>
                  <p className="mt-1 text-xl font-black text-[var(--on-surface)]">Less errors</p>
                  <p className="text-xs text-[var(--on-surface-low)]">Cleaner billing and records</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -inset-5 bg-gradient-to-br from-[#1E4C86]/30 via-[#2878D9]/15 to-[#1E7A55]/30 blur-3xl rounded-[2rem]" />
              <div className="relative glass-card rounded-[1.75rem] p-5 sm:p-6 border-[rgba(255,255,255,0.1)]">
                <div className="rounded-2xl border border-[#1E7A55]/25 bg-[#1E7A55]/10 px-4 py-3 mb-4">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[#93F6CB]">Today at a glance</p>
                  <p className="text-sm sm:text-base font-bold text-[var(--on-surface)] mt-1">Your shop is running smooth</p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-[var(--on-surface-low)]">Sales today</p>
                        <p className="text-lg font-black text-[var(--on-surface)]">Rs 18,460</p>
                      </div>
                      <Clock3 className="w-5 h-5 text-[#66B7FF]" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-[var(--on-surface-low)]">Gross margin</p>
                        <p className="text-lg font-black text-[var(--on-surface)]">Rs 3,210</p>
                      </div>
                      <ShieldCheck className="w-5 h-5 text-[#56DDA8]" />
                    </div>
                  </div>

                  <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--on-surface-low)] mb-2">Low stock alerts</p>
                    <div className="space-y-2 text-sm text-[var(--on-surface)]">
                      <div className="flex items-center justify-between rounded-lg bg-[#1E4C86]/15 px-3 py-2 border border-[#1E4C86]/20">
                        <span>Sunflower Oil 1L</span>
                        <span className="font-bold">3 left</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-[#1E7A55]/15 px-3 py-2 border border-[#1E7A55]/20">
                        <span>Basmati Rice 5kg</span>
                        <span className="font-bold">5 left</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#65B3FF]">Simple features. Real control.</p>
            <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-[var(--on-surface)]">
              Everything a local shop needs, nothing extra.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[var(--on-surface-low)] leading-relaxed">
              The interface is made for quick daily use by owners and staff. You can onboard your team in minutes.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid sm:grid-cols-2 gap-4 sm:gap-5 mt-10"
          >
            {benefitCards.map((card) => {
              const Icon = card.icon;

              return (
                <motion.article
                  key={card.title}
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`} />
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#1E4C86]/15 border border-[#1E4C86]/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#6DBDFF]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-[var(--on-surface)]">{card.title}</h3>
                      <p className="text-xs sm:text-sm font-semibold text-[#58DCA8] mt-1">{card.summary}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--on-surface-low)]">{card.description}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </section>

        <section id="comparison" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#58DCA8]">Old way vs new way</p>
            <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-[var(--on-surface)]">
              Move from guesswork to clear, secure records.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[var(--on-surface-low)] leading-relaxed">
              Keep your data organized and available whenever you need to order stock or check business health.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-5 mt-10">
            <motion.article
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="glass-card p-6 border-[rgba(255,255,255,0.08)]"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-red-400">Old way</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-[var(--on-surface)]">Notebook and memory</h3>
              <ul className="mt-5 space-y-3">
                {oldWayPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-[var(--on-surface-low)] leading-relaxed">
                    <XCircle className="w-4 h-4 mt-0.5 text-red-400 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="glass-card p-6 border-[rgba(86,221,168,0.35)]"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[#6EE7B7]">New way</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-[var(--on-surface)]">Digital and dependable</h3>
              <ul className="mt-5 space-y-3">
                {newWayPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-[var(--on-surface-low)] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#6EE7B7] shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] p-7 sm:p-10"
          >
            <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(23,78,141,0.26),rgba(31,124,88,0.24))]" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9AD7FF]">Start in minutes</p>
              <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-[var(--on-surface)]">
                Stop worrying about stock gaps. Start your free account today.
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--on-surface-low)]">
                No setup complexity. Add your first items, set low-stock limits, and begin tracking your daily sales
                summary immediately.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onGoToRegister}
                  className="group inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#1D4E89] to-[#1F7C58] text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_rgba(29,78,137,0.35)] transition-all"
                >
                  Start Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onGoToLogin}
                  className="inline-flex justify-center items-center px-6 py-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-sm font-bold uppercase tracking-[0.14em] text-[var(--on-surface)] hover:bg-white/5 transition-all"
                >
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 py-8 px-4 text-center">
        <p className="text-xs text-[var(--on-surface-low)] opacity-80">
          Godamm Inventory Command Center {currentYear}. Built for everyday local business operations.
        </p>
      </footer>
    </div>
  );
};
