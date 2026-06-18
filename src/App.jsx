import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ClipboardCheck, Compass, ShieldCheck, Sparkles } from 'lucide-react';

const Lottie = lazy(() => import('lottie-react'));

const LOTTIE_URLS = {
  checkmark: 'checkmark',
  microCelebrate: 'microCelebrate',
  roadmapCelebrate: 'roadmapCelebrate',
  fortressReveal: 'fortressReveal',
  success: 'checkmark'
};

const animationLoaders = {
  checkmark: () => import('./assets/lottie/checkmark.json'),
  microCelebrate: () => import('./assets/lottie/microCelebrate.json'),
  roadmapCelebrate: () => import('./assets/lottie/roadmapCelebrate.json'),
  fortressReveal: () => import('./assets/lottie/fortressReveal.json')
};

const RemoteLottie = ({ src, loop = true, autoplay = true, className = '', style, onComplete }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!src || !animationLoaders[src]) {
      setAnimationData(null);
      return () => {
        isMounted = false;
      };
    }

    animationLoaders[src]().then((module) => {
      if (isMounted) {
        setAnimationData(module.default);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (!animationData) {
    return (
      <div className={`flex items-center justify-center ${className}`} aria-hidden="true">
        <div className="h-8 w-8 rounded-full bg-slate-200/80 ring-4 ring-white/70" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className={`flex items-center justify-center ${className}`} aria-hidden="true">
          <div className="h-8 w-8 rounded-full bg-slate-200/80 ring-4 ring-white/70" />
        </div>
      }
    >
      <Lottie animationData={animationData} loop={loop} autoplay={autoplay} onComplete={onComplete} className={className} style={style} />
    </Suspense>
  );
};

const JOURNEY_MODULES = [
  {
    id: 'life',
    title: 'Life Snapshot',
    icon: '👤',
    time: '1 min',
    desc: 'Who are you building this foundation for?',
    helper: 'This helps us understand your core responsibilities and what kind of safety net fits you best.',
    questions: [
      {
        id: 'stage',
        text: 'Which best describes your current life stage?',
        type: 'single',
        options: [
          { id: 'single_nodep', label: 'Single, no dependents', icon: '🚶' },
          { id: 'single_dep', label: 'Single, supporting family', icon: '👨‍👩‍👧' },
          { id: 'married_nodep', label: 'Married, no kids yet', icon: '👫' },
          { id: 'married_dep', label: 'Married, with kids', icon: '👨‍👩‍👧‍👦' }
        ]
      }
    ]
  },
  {
    id: 'cashflow',
    title: 'Cash Flow Check',
    icon: '💸',
    time: '1 min',
    desc: "Let's check your daily financial engine.",
    helper: "We don't need exact numbers, just a general feel of your financial stability.",
    questions: [
      {
        id: 'income_stability',
        text: 'How stable is your monthly income?',
        type: 'single',
        options: [
          { id: 'very_stable', label: 'Very stable (Fixed salary)', icon: '🏢' },
          { id: 'somewhat', label: 'Somewhat stable (Variable/Freelance)', icon: '💻' },
          { id: 'unpredictable', label: 'Unpredictable (Business/Gig)', icon: '📈' }
        ]
      },
      {
        id: 'savings_habit',
        text: 'How would you describe your savings habit?',
        type: 'single',
        options: [
          { id: 'consistent', label: 'I save a portion consistently', icon: '🌱' },
          { id: 'sometimes', label: 'I save whatever is left over', icon: '🤷' },
          { id: 'struggling', label: 'Hard to save right now', icon: '😬' }
        ]
      }
    ]
  },
  {
    id: 'emergency',
    title: 'Safety Net',
    icon: '🏦',
    time: '1 min',
    desc: 'Your first wall against surprises.',
    helper: 'An emergency fund is cash you can access easily. This helps gauge your short-term readiness.',
    questions: [
      {
        id: 'emergencyFund',
        text: 'If your income stopped today, how long could your savings cover essential bills?',
        type: 'single',
        options: [
          { id: 1, label: 'Less than 1 month', subtitle: 'Still building the habit' },
          { id: 2, label: '1 to 3 months', subtitle: 'Getting there' },
          { id: 3, label: '3 to 6 months', subtitle: 'Solid buffer' },
          { id: 4, label: 'More than 6 months', subtitle: 'Fully funded' }
        ]
      }
    ]
  },
  {
    id: 'protection',
    title: 'The Shield',
    icon: '🛡️',
    time: '1 min',
    desc: 'Checking your cover against life risks.',
    helper: 'This helps us identify if there are any gaps between what you have and what your family might need.',
    questions: [
      {
        id: 'protection',
        text: 'Which of these do you currently have? (Select all that apply)',
        type: 'multi',
        options: [
          { id: 'hmo', label: 'Company HMO / Health Card', icon: '🏥' },
          { id: 'health_ins', label: 'Personal Health Insurance', icon: '🩺' },
          { id: 'life_ins', label: 'Life Insurance', icon: '❤️' },
          { id: 'critical', label: 'Critical Illness Coverage', icon: '🎗️' },
          { id: 'none', label: 'None of the above yet', icon: '🌱' }
        ]
      },
      {
        id: 'dependents',
        text: 'Who depends on your income? (Select all that apply)',
        type: 'multi',
        options: [
          { id: 'kids', label: 'Children', icon: '👶' },
          { id: 'spouse', label: 'Spouse/Partner', icon: '🤝' },
          { id: 'parents', label: 'Parents/Siblings', icon: '👵' },
          { id: 'none', label: 'No one right now', icon: '👤' }
        ]
      }
    ]
  },
  {
    id: 'goals',
    title: 'Goals & Direction',
    icon: '🧭',
    time: '1 min',
    desc: 'What are you aiming to build next?',
    helper: 'Knowing your priorities helps us suggest the most relevant next step for your roadmap.',
    questions: [
      {
        id: 'priorities',
        text: 'What are your top 2 financial priorities right now?',
        type: 'multi',
        max: 2,
        options: [
          { id: 'save', label: 'Build Emergency Fund', icon: '💰' },
          { id: 'protect', label: 'Protect Family/Income', icon: '🛡️' },
          { id: 'debt', label: 'Manage/Clear Debt', icon: '💳' },
          { id: 'invest', label: 'Grow Wealth / Invest', icon: '📈' },
          { id: 'health', label: 'Prepare a Health Fund', icon: '🏥' }
        ]
      }
    ]
  }
];

const getProgressColor = (percent) => {
  const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));

  if (safePercent <= 25) return '#ef4444';
  if (safePercent <= 50) return '#f97316';
  if (safePercent <= 75) return '#eab308';
  return '#22c55e';
};

const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  const baseStyle = 'w-full py-4 px-6 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center gap-2 text-base';
  const variants = {
    primary: 'bg-slate-800 text-white shadow-md hover:bg-slate-900 hover:-translate-y-0.5',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    outline: 'border-2 border-slate-200 text-slate-600 hover:border-slate-800 hover:text-slate-800',
    emerald: 'bg-emerald-600 text-white shadow-md hover:bg-emerald-700',
    indigo: 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-40 cursor-not-allowed transform-none shadow-none' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const QUICK_REVIEW_TRUST_CUES = [
  { icon: ShieldCheck, label: 'Free' },
  { icon: ClipboardCheck, label: 'Quick' },
  { icon: Compass, label: 'Guided' }
];

const IntroIcon = () => (
  <motion.div
    initial={{ scale: 0.96, opacity: 0, y: 8 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    className="relative flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-slate-200 bg-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
  >
    <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-white/10 via-transparent to-emerald-400/10" />
    <div className="absolute -right-2 -top-2 rounded-full border border-white/70 bg-white/95 p-1.5 shadow-sm">
      <Sparkles className="h-3.5 w-3.5 text-slate-500" strokeWidth={2.4} />
    </div>
    <Compass className="relative z-10 h-9 w-9 text-white" strokeWidth={2.2} />
  </motion.div>
);

const TrustCue = ({ icon: Icon, label }) => (
  <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 px-3 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
    <Icon className="h-4 w-4 text-slate-500" strokeWidth={2.2} />
    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</span>
  </div>
);

const PrimaryActionButton = ({ children, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ y: -1, scale: 1.01 }}
    whileTap={{ scale: 0.985 }}
    transition={{ duration: 0.2 }}
    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-900 px-6 py-[1.125rem] text-base font-semibold text-white shadow-[0_18px_32px_rgba(15,23,42,0.2)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 hover:bg-slate-800"
  >
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-pulse-soft" aria-hidden="true" />
    <span className="absolute inset-x-6 top-0 h-px bg-white/20" aria-hidden="true" />
    <span>{children}</span>
    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.4} />
  </motion.button>
);

const SecondaryActionButton = ({ children, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.99 }}
    transition={{ duration: 0.2 }}
    className="w-full rounded-full px-4 py-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
  >
    {children}
  </motion.button>
);

const WelcomeMapGraphic = () => (
  <div className="welcome-map-graphic" aria-hidden="true">
    <svg viewBox="0 0 360 560" className="h-full w-full" fill="none">
      <defs>
        <linearGradient id="routeFade" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.5" />
          <stop offset="56%" stopColor="var(--brand-primary-soft)" stopOpacity="0.34" />
          <stop offset="100%" stopColor="var(--brand-primary-soft)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="map-angled-grid">
        {[
          'M-42 526L84 400L210 526L398 338',
          'M-28 430L92 310L212 430L388 254',
          'M-18 334L90 226L198 334L368 164',
          'M28 584L154 458L280 584',
          'M118 568L244 442L392 590',
          'M-34 214L74 106L182 214L296 100'
        ].map((line) => (
          <path key={line} d={line} />
        ))}
      </g>
      {[
        { d: 'M24 560L88 496L142 442L206 378L276 308L340 244', delay: '0s', duration: '7.2s' },
        { d: 'M-18 410L56 336L128 408L202 334L286 250L378 158', delay: '1.6s', duration: '7.8s' },
        { d: 'M378 458L312 392L248 328L178 258L108 188L36 116', delay: '3.2s', duration: '7.1s' },
        { d: 'M326 560L278 512L326 464L266 404L202 340L252 290L304 238', delay: '4.8s', duration: '8s' },
        { d: 'M116 560L172 504L118 450L180 388L236 332L306 262L374 194', delay: '6.4s', duration: '7.5s' }
      ].map((route) => (
        <path
          key={route.d}
          className="map-angled-route"
          d={route.d}
          pathLength="1"
          style={{ '--route-delay': route.delay, '--route-duration': route.duration }}
        />
      ))}
      {[
        { x: 54, y: 530, delay: '0.52s' },
        { x: 114, y: 470, delay: '0.92s' },
        { x: 174, y: 410, delay: '1.32s' },
        { x: 242, y: 342, delay: '1.72s' },
        { x: 22, y: 370, delay: '2.5s' },
        { x: 92, y: 372, delay: '2.9s' },
        { x: 164, y: 372, delay: '3.3s' },
        { x: 244, y: 292, delay: '3.7s' },
        { x: 346, y: 426, delay: '4.52s' },
        { x: 280, y: 360, delay: '4.92s' },
        { x: 214, y: 294, delay: '5.32s' },
        { x: 144, y: 224, delay: '5.72s' },
        { x: 302, y: 536, delay: '6.5s' },
        { x: 302, y: 488, delay: '6.9s' },
        { x: 266, y: 404, delay: '7.3s' },
        { x: 226, y: 316, delay: '7.7s' },
        { x: 144, y: 532, delay: '8.52s' },
        { x: 146, y: 422, delay: '8.92s' },
        { x: 208, y: 360, delay: '9.32s' },
        { x: 272, y: 296, delay: '9.72s' }
      ].map((step) => (
        <circle
          key={`${step.x}-${step.y}-${step.delay}`}
          className="map-milestone-dot"
          cx={step.x}
          cy={step.y}
          r="5"
          style={{ '--dot-delay': step.delay }}
        />
      ))}
    </svg>
  </div>
);

const QuickReviewIntroScreen = ({ onPrimary, onSecondary }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-5 sm:px-6"
  >
    <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-slate-900/[0.04] to-transparent" />
    <div className="absolute left-[-6rem] top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
    <div className="absolute right-[-5rem] bottom-4 h-44 w-44 rounded-full bg-slate-900/5 blur-3xl" />

    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className="relative z-10 w-full max-w-[28rem] px-6 py-7 sm:px-8 sm:py-8"
    >
      <div className="flex justify-center">
        <IntroIcon />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2" aria-hidden="true">
        <span className="h-2 w-8 rounded-full bg-slate-900" />
        <span className="h-2 w-2 rounded-full bg-slate-200" />
        <span className="h-2 w-2 rounded-full bg-slate-200" />
      </div>

      <div className="mt-7 text-center">
        <h2 className="text-[2rem] font-extrabold tracking-tight text-slate-900 sm:text-[2.25rem]">Get Started</h2>
        <p className="mx-auto mt-4 max-w-[24rem] text-sm leading-7 text-slate-600 sm:text-[15px]">
          To build a realistic starting point, we&apos;ll ask a few quick details. This is not an application and there is zero commitment required.
        </p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {QUICK_REVIEW_TRUST_CUES.map(({ icon, label }) => (
          <TrustCue key={label} icon={icon} label={label} />
        ))}
      </div>

      <div className="my-7 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="space-y-3">
        <PrimaryActionButton onClick={onPrimary}>Build My Starting Plan</PrimaryActionButton>
        <SecondaryActionButton onClick={onSecondary}>Wait, go back</SecondaryActionButton>
      </div>
    </motion.div>
  </motion.div>
);

const CelebrationOverlay = ({ active, src, className = '' }) => {
  if (!active) {
    return null;
  }

  return (
    <div className={`pointer-events-none absolute inset-0 z-40 flex items-center justify-center ${className}`}>
      <RemoteLottie src={src} loop={false} className="h-full w-full" />
    </div>
  );
};

const ScoreRing = ({ score, colorClass }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} className="stroke-slate-100" strokeWidth="6" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          className={`${colorClass} transition-all duration-1500 ease-out`}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          style={{ strokeDasharray: circumference, strokeDashoffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{score}</span>
      </div>
    </div>
  );
};

const AnalyzingScreen = ({ onComplete }) => {
  const [text, setText] = useState('Checking your cash flow layer...');

  useEffect(() => {
    const t1 = setTimeout(() => setText('Reviewing your safety net...'), 1000);
    const t2 = setTimeout(() => setText('Matching goals with next steps...'), 2200);
    const t3 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="h-full min-h-[100dvh] md:min-h-full flex flex-col justify-center items-center p-8 bg-slate-800 text-white text-center animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      <div className="relative z-10 w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-slate-600 rounded-full border-t-emerald-400 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl">🛡️</div>
      </div>
      <h2 className="text-2xl font-bold mb-3 tracking-tight">Building Your Fortress</h2>
      <p className="text-slate-300 font-medium animate-pulse-soft">{text}</p>
    </div>
  );
};

const DashboardScreen = ({ data, onTransitionToQuote, onResetJourney, celebrationActive }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="app-scroll bg-slate-50 h-full hide-scrollbar relative">
      <CelebrationOverlay active={celebrationActive} src={LOTTIE_URLS.fortressReveal} className="bg-white/30 backdrop-blur-[2px]" />
      <div className="bg-white px-6 pt-12 pb-10 rounded-b-[2.5rem] shadow-sm border-b border-slate-100 text-center relative z-10 shrink-0 animate-slide-up">
        {/* Share & Save icon buttons — relocated from bottom row */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button
            aria-label="Share link"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-slate-100 shadow-sm text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button
            aria-label="Save image"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-slate-100 shadow-sm text-slate-500 hover:text-emerald-600 hover:border-emerald-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">Your Financial Fortress</h2>

        <div className="relative mx-auto w-40 h-40 mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <ScoreRing score={data.score} colorClass={data.scoreColor} />
          </div>
          <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-2xl border-2 border-slate-50 z-20 transform translate-x-2 -translate-y-2">
            {data.persona.emoji}
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">{data.persona.title}</h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto font-medium">{data.persona.subtitle}</p>

        <div className="mt-6 text-left max-w-[280px] mx-auto">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            <span>How this was estimated</span>
            <svg className={`w-4 h-4 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showBreakdown && (
            <div className="mt-3 space-y-3 animate-fade-in pb-2">
              {[
                { label: 'Cash Flow & Income', value: data.breakdown.cashflow, max: 25 },
                { label: 'Emergency Safety Net', value: data.breakdown.emergency, max: 20 },
                { label: 'Protection Coverage', value: data.breakdown.protection, max: 30 },
                { label: 'Goals & Direction', value: data.breakdown.goals, max: 25 }
              ].map((item, idx) => {
                const percent = (item.value / item.max) * 100;

                return (
                  <div key={idx}>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>{item.label}</span>
                      <span className="text-slate-400">
                        {item.value}/{item.max}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="progress-fill h-1.5 rounded-full" style={{ width: `${percent}%`, backgroundColor: getProgressColor(percent) }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 mt-6 mb-8 pb-[calc(env(safe-area-inset-bottom)+2.5rem)] space-y-4">
        <h3 className="font-bold text-slate-800 px-1 text-sm">Layer Analysis</h3>

        {data.threats.map((threat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 flex gap-4 animate-slide-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${threat.bgClass}`}>{threat.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-slate-800 text-sm">{threat.title}</h4>
              </div>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 ${threat.badgeClass}`}>
                {threat.status}
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">{threat.desc}</p>
            </div>
          </div>
        ))}

          <div className="bg-slate-800 rounded-[1.5rem] p-6 shadow-md text-white mt-8 relative overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <span className="text-3xl mb-3 block">{data.cta.icon}</span>
            <h3 className="text-lg font-bold mb-2 tracking-tight">{data.cta.headline}</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed font-medium">{data.cta.hook}</p>

            <Button
              onClick={onTransitionToQuote}
              variant="emerald"
              className="mb-3 animate-pulse-soft shadow-[0_12px_32px_rgba(16,185,129,0.3)]"
            >
                {data.cta.buttonText}
            </Button>

            <button
              onClick={onResetJourney}
              className="w-full py-2.5 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
            >
              Reset Journey
            </button>
            <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed">No payment. No commitment. Just a personalized starting estimate.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

function App() {
  const [screen, setScreen] = useState('welcome');
  const [completedModules, setCompletedModules] = useState([]);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [answers, setAnswers] = useState({
    stage: '',
    income_stability: '',
    savings_habit: '',
    emergencyFund: null,
    protection: [],
    dependents: [],
    priorities: [],
    confidence: ''
  });
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quoteStep, setQuoteStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteData, setQuoteData] = useState({
    dob: '',
    gender: '',
    goal: '',
    budget: '',
    name: '',
    phone: '',
    email: '',
    consent: false
  });

  const [completionFx, setCompletionFx] = useState({ active: false, moduleId: null, final: false });
  const [pendingHubScroll, setPendingHubScroll] = useState(false);
  const [analyzeButtonReady, setAnalyzeButtonReady] = useState(false);
  const [dashboardCelebration, setDashboardCelebration] = useState(false);
  const [quoteSuccessCelebration, setQuoteSuccessCelebration] = useState(false);
  const [moduleTimings, setModuleTimings] = useState({});
  const [moduleStartedAt, setModuleStartedAt] = useState({});
  const [playedCheckAnimation, setPlayedCheckAnimation] = useState({});

  const nextModuleRef = useRef(null);
  const hubScrollRef = useRef(null);
  const resultsCtaRef = useRef(null);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((timerId) => clearTimeout(timerId));
    timersRef.current = [];
  };

  const schedule = (callback, delay) => {
    const timerId = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((existingTimerId) => existingTimerId !== timerId);
      callback();
    }, delay);

    timersRef.current.push(timerId);
    return timerId;
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (screen === 'hub' && pendingHubScroll && nextModuleRef.current) {
      const timerId = window.setTimeout(() => {
        if (nextModuleRef.current) {
          nextModuleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setPendingHubScroll(false);
      }, 1300);

      timersRef.current.push(timerId);

      return () => clearTimeout(timerId);
    }
  }, [screen, pendingHubScroll, completedModules]);

  useEffect(() => {
    if (screen === 'hub' && analyzeButtonReady && hubScrollRef.current) {
      const timerId = window.setTimeout(() => {
        if (hubScrollRef.current) {
          hubScrollRef.current.scrollTo({
            top: hubScrollRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 250);

      timersRef.current.push(timerId);
      return () => clearTimeout(timerId);
    }
  }, [screen, analyzeButtonReady]);

  const restartJourney = () => {
    clearTimers();
    setScreen('welcome');
    setCompletedModules([]);
    setActiveModuleId(null);
    setAnswers({
      stage: '',
      income_stability: '',
      savings_habit: '',
      emergencyFund: null,
      protection: [],
      dependents: [],
      priorities: [],
      confidence: ''
    });
    setCurrentQIndex(0);
    setQuoteStep(1);
    setIsSubmitting(false);
    setQuoteData({
      dob: '',
      gender: '',
      goal: '',
      budget: '',
      name: '',
      phone: '',
      email: '',
      consent: false
    });
    setCompletionFx({ active: false, moduleId: null, final: false });
    setPendingHubScroll(false);
    setAnalyzeButtonReady(false);
    setDashboardCelebration(false);
    setQuoteSuccessCelebration(false);
    setModuleTimings({});
    setModuleStartedAt({});
    setPlayedCheckAnimation({});
  };

  const getTimeTakenMessage = (seconds) => {
    const templates = [
      (value) => `Wow, you're done in less than ${value} seconds!`,
      (value) => `See, completed within just ${value} seconds!`,
      (value) => `Finished exactly ${value} seconds!`,
      (value) => `Nice, you wrapped this up in ${value} seconds!`
    ];

    const safeSeconds = Math.max(1, Math.round(seconds));
    const chosenTemplate = templates[safeSeconds % templates.length];
    return chosenTemplate(safeSeconds);
  };

  const handleAnswer = (qId, value, isMulti = false, max = null) => {
    setAnswers((prev) => {
      if (!isMulti) {
        return { ...prev, [qId]: value };
      }

      let currentList = [...(prev[qId] || [])];

      if (value === 'none') {
        return { ...prev, [qId]: ['none'] };
      }

      currentList = currentList.filter((item) => item !== 'none');

      if (currentList.includes(value)) {
        return { ...prev, [qId]: currentList.filter((item) => item !== value) };
      }

      if (max && currentList.length >= max) {
        return prev;
      }

      return { ...prev, [qId]: [...currentList, value] };
    });
  };

  const calculateFortressData = useMemo(() => {
    let score = 0;
    const breakdown = { cashflow: 0, emergency: 0, protection: 0, goals: 0 };

    if (answers.savings_habit === 'consistent') {
      breakdown.cashflow += 15;
    } else if (answers.savings_habit === 'sometimes') {
      breakdown.cashflow += 8;
    }

    if (answers.income_stability === 'very_stable') {
      breakdown.cashflow += 10;
    } else if (answers.income_stability === 'somewhat') {
      breakdown.cashflow += 5;
    }

    if (answers.emergencyFund === 4) {
      breakdown.emergency = 20;
    } else if (answers.emergencyFund === 3) {
      breakdown.emergency = 15;
    } else if (answers.emergencyFund === 2) {
      breakdown.emergency = 10;
    } else if (answers.emergencyFund === 1) {
      breakdown.emergency = 5;
    }

    const protCount = answers.protection.includes('none') ? 0 : answers.protection.length;

    if (protCount >= 3) {
      breakdown.protection = 30;
    } else if (protCount === 2) {
      breakdown.protection = 20;
    } else if (protCount === 1) {
      breakdown.protection = 10;
    }

    if (answers.priorities.length > 0) {
      breakdown.goals = 25;
    }

    score = breakdown.cashflow + breakdown.emergency + breakdown.protection + breakdown.goals;

    let persona = {
      title: 'Building Phase',
      emoji: '🧱',
      subtitle: 'You have a starting point, but your layers can be strengthened.'
    };

    let scoreColor = 'stroke-amber-400';

    if (score >= 80) {
      persona = {
        title: 'Strong Foundation',
        emoji: '🏰',
        subtitle: 'Looking good! Your base is well-rounded and stable.'
      };
      scoreColor = 'stroke-emerald-500';
    } else if (score >= 55) {
      persona = {
        title: 'On the Right Track',
        emoji: '🛤️',
        subtitle: 'You have solid layers, but a few areas are worth reviewing.'
      };
      scoreColor = 'stroke-indigo-500';
    }

    const hasDeps = answers.dependents.length > 0 && !answers.dependents.includes('none');
    const threats = [];

    if (answers.emergencyFund < 3) {
      threats.push({
        title: 'Unexpected Expenses',
        icon: '💸',
        status: 'Room to Grow',
        bgClass: 'bg-amber-50 text-amber-500',
        badgeClass: 'bg-amber-100 text-amber-700',
        desc: 'Your savings are starting to build, but a sudden repair could stress your current cash flow.'
      });
    } else {
      threats.push({
        title: 'Unexpected Expenses',
        icon: '🏦',
        status: 'Well Protected',
        bgClass: 'bg-emerald-50 text-emerald-500',
        badgeClass: 'bg-emerald-100 text-emerald-700',
        desc: 'Your rainy day fund is strong enough to handle short-term income pauses gracefully.'
      });
    }

    if (!answers.protection.includes('health_ins') && !answers.protection.includes('critical') && !answers.protection.includes('hmo')) {
      threats.push({
        title: 'Major Health Event',
        icon: '🏥',
        status: 'Needs Attention',
        bgClass: 'bg-rose-50 text-rose-500',
        badgeClass: 'bg-rose-100 text-rose-700',
        desc: 'A major medical event could tap into savings meant for other goals. A health shield adds a crucial layer.'
      });
    } else {
      threats.push({
        title: 'Major Health Event',
        icon: '🩺',
        status: 'Has Some Cover',
        bgClass: 'bg-indigo-50 text-indigo-500',
        badgeClass: 'bg-indigo-100 text-indigo-700',
        desc: 'You have health coverage in place to help defend your savings against medical costs.'
      });
    }

    if (hasDeps && !answers.protection.includes('life_ins')) {
      threats.push({
        title: 'Family Backup Plan',
        icon: '👨‍👩‍👧‍👦',
        status: 'Missing Layer',
        bgClass: 'bg-rose-50 text-rose-500',
        badgeClass: 'bg-rose-100 text-rose-700',
        desc: 'People rely on your income engine. Life insurance acts as a safety net if that engine stops.'
      });
    }

    let cta = {};

    if (hasDeps && !answers.protection.includes('life_ins')) {
      cta = {
        headline: 'You have people counting on you.',
        hook: 'You work hard for your family. Checking out a backup plan helps ensure they are supported no matter what.',
        buttonText: 'Check My Family Backup Plan',
        icon: '🛡️'
      };
    } else if (protCount === 0) {
      cta = {
        headline: 'Build your first safety shield.',
        hook: "Your savings help with today, but a protection plan shields your tomorrow. Let's find beginner-friendly options.",
        buttonText: 'Show Me Beginner Options',
        icon: '🌱'
      };
    } else if (answers.priorities.includes('invest') && score < 60) {
      cta = {
        headline: 'Protect before you grow.',
        hook: 'Your investment goals are safer when your basic protection layer is solid. Let\'s review your balance.',
        buttonText: 'Review My Safety Net',
        icon: '📈'
      };
    } else {
      cta = {
        headline: 'Keep building your momentum.',
        hook: 'Let\'s review a personalized strategy to align your current setup with your future goals.',
        buttonText: 'Explore My Options',
        icon: '🧭'
      };
    }

    return { score, breakdown, persona, scoreColor, threats, cta };
  }, [answers]);

  const renderWelcome = () => (
    <div className="screen-mesh h-full flex flex-col justify-center items-center p-8 text-center animate-fade-in relative z-10 overflow-hidden">
      <WelcomeMapGraphic />
      <div className="welcome-logo mb-8">
        <Compass className="h-10 w-10 text-white" strokeWidth={2.2} />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight leading-tight">
        Map My Future
      </h1>
      <p className="text-slate-500 mb-10 leading-relaxed max-w-xs mx-auto font-medium">
        Let&apos;s look at where you stand today. Tap through a few quick steps to see how prepared you are for tomorrow.
      </p>
      <div className="w-full mt-auto mb-8 space-y-4">
        <Button onClick={() => setScreen('hub')}>Start My Journey</Button>
        <p className="text-xs text-slate-600 font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Takes about 3 minutes
        </p>
      </div>
      <p className="text-[10px] text-slate-500 font-medium tracking-wide">v{__APP_VERSION__}</p>
    </div>
  );

  const renderHub = () => {
    const progress = (completedModules.length / JOURNEY_MODULES.length) * 100;
    const showMiniInsight = completedModules.length === 2 || completedModules.length === 3;
    const isFinalCelebrationActive = completionFx.active && completionFx.final;

    return (
      <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
        <CelebrationOverlay active={isFinalCelebrationActive} src={LOTTIE_URLS.roadmapCelebrate} className="bg-slate-950/20 backdrop-blur-[1px]" />
        <div className="bg-white px-6 pt-10 pb-6 rounded-b-[2rem] shadow-sm relative z-10 border-b border-slate-100 animate-slide-up">
          <h2 className="text-xl font-extrabold text-slate-800 mb-5">Your Profile Journey</h2>
          <div className="mb-2 flex justify-between items-end">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Foundation Builder</span>
            <span className="font-extrabold text-slate-800 text-lg">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="progress-fill h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%`, backgroundColor: getProgressColor(progress) }}></div>
          </div>
        </div>

        <div ref={hubScrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar pb-36">
          {showMiniInsight && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-[1.5rem] p-5 flex gap-4 items-start animate-fade-in shadow-sm">
              <span className="text-indigo-500 text-2xl shrink-0">💡</span>
              <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                Good start! Your profile shows you&apos;re already thinking ahead. Complete the remaining sections to unlock your full Financial Fortress.
              </p>
            </div>
          )}

          {JOURNEY_MODULES.map((mod, idx) => {
            const isComplete = completedModules.includes(mod.id);
            const isNext = !isComplete && (idx === 0 || completedModules.includes(JOURNEY_MODULES[idx - 1].id));
            const isLocked = !isComplete && !isNext;
            const isRecentCompletion = completionFx.active && completionFx.moduleId === mod.id;
            const shouldPlayCheckAnimation = isComplete && !playedCheckAnimation[mod.id];

            return (
              <div
                key={mod.id}
                ref={isNext ? nextModuleRef : null}
                onClick={() => {
                  if (!isLocked && !isComplete) {
                    setActiveModuleId(mod.id);
                    setModuleStartedAt((prev) => ({
                      ...prev,
                      [mod.id]: Date.now()
                    }));
                    setCurrentQIndex(0);
                    setScreen('module');
                  }
                }}
                className={`relative overflow-hidden p-5 rounded-[1.5rem] border-2 transition-all duration-300 flex items-center gap-4
                  ${isComplete ? 'bg-white border-slate-100 shadow-sm' : isNext ? 'bg-white border-slate-800 shadow-md cursor-pointer translate-y-[-2px] animate-pulse-glow' : 'bg-slate-100/50 border-transparent opacity-60'}`}
              >
                {isRecentCompletion && (
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                    <div className="absolute inset-0 opacity-95">
                      <RemoteLottie src={LOTTIE_URLS.microCelebrate} loop={false} className="h-full w-full" />
                    </div>
                  </div>
                )}
                <div
                  className={`relative z-20 w-20 h-20 rounded-[1.4rem] flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden ${isComplete ? 'bg-emerald-50 border border-emerald-100 shadow-sm' : isNext ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-200 grayscale'}`}
                >
                  {isComplete ? (
                    shouldPlayCheckAnimation ? (
                      <RemoteLottie
                        src={LOTTIE_URLS.checkmark}
                        loop={false}
                        className="h-[4.7rem] w-[4.7rem] scale-[1.3]"
                        onComplete={() =>
                          setPlayedCheckAnimation((prev) => ({
                            ...prev,
                            [mod.id]: true
                          }))
                        }
                      />
                    ) : (
                      <span className="text-[3.7rem] leading-none text-emerald-600 font-black">✓</span>
                    )
                  ) : (
                    mod.icon
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm ${isComplete ? 'text-slate-800' : isNext ? 'text-slate-900' : 'text-slate-500'}`}>{mod.title}</h3>
                  <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-1">
                    {isComplete && moduleTimings[mod.id] ? moduleTimings[mod.id] : mod.time}
                  </p>
                </div>
                {isNext && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white shrink-0 animate-pulse-soft">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
                {isLocked && (
                  <div className="text-slate-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-30 p-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
          {completedModules.length === JOURNEY_MODULES.length && analyzeButtonReady && (
            <div ref={resultsCtaRef}>
              <Button onClick={() => setScreen('analyzing')} className="cta-results-motion border border-sky-200/70 text-white">
                See My Results
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderModule = () => {
    const module = JOURNEY_MODULES.find((m) => m.id === activeModuleId);

    if (!module) {
      return null;
    }

    const q = module.questions[currentQIndex];
    const currentAnswer = answers[q.id];
    const canProceed = q.type === 'multi' ? currentAnswer && currentAnswer.length > 0 : currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== '';

    const handleNext = () => {
      if (currentQIndex < module.questions.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
      } else {
        const isFinalModule = completedModules.length + 1 === JOURNEY_MODULES.length;
        const startedAt = moduleStartedAt[module.id] || Date.now();
        const elapsedSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));

        if (!completedModules.includes(module.id)) {
          setCompletedModules((prev) => [...prev, module.id]);
        }

        setModuleTimings((prev) => ({
          ...prev,
          [module.id]: getTimeTakenMessage(elapsedSeconds)
        }));

        setCompletionFx({ active: true, moduleId: module.id, final: isFinalModule });
        if (isFinalModule) {
          setAnalyzeButtonReady(false);
          schedule(() => {
            setCompletionFx({ active: false, moduleId: null, final: false });
            setAnalyzeButtonReady(true);
          }, 2200);
        } else {
          setPendingHubScroll(true);
          schedule(() => {
            setCompletionFx({ active: false, moduleId: null, final: false });
          }, 1500);
        }

        setScreen('hub');
      }
    };

    return (
      <div className="h-full flex flex-col bg-slate-50 animate-fade-in relative">
        <div className="pt-8 px-6 pb-6 shrink-0 bg-white rounded-b-[2rem] shadow-sm relative z-10 border-b border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => (currentQIndex > 0 ? setCurrentQIndex((prev) => prev - 1) : setScreen('hub'))} className="text-slate-400 hover:text-slate-600 font-medium text-sm flex items-center gap-1">
              ← Back
            </button>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{module.title}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full">
            <div
              className="progress-fill h-full rounded-full transition-all"
              style={{
                width: `${((currentQIndex + 1) / module.questions.length) * 100}%`,
                backgroundColor: getProgressColor(((currentQIndex + 1) / module.questions.length) * 100)
              }}
            ></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 pb-28 hide-scrollbar">
          <h2 className="text-xl font-extrabold text-slate-800 mb-3 leading-snug">{q.text}</h2>

          {module.helper && (
            <div className="bg-slate-100/80 p-3 rounded-xl mb-6 flex gap-3 items-start border border-slate-200/60">
              <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{module.helper}</p>
            </div>
          )}

          {q.type === 'multi' && (
            <p className="text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">
              Select all that apply {q.max && `(Max ${q.max})`}
            </p>
          )}

          <div className="space-y-3">
            {q.options.map((opt) => {
              const isSelected = q.type === 'multi' ? currentAnswer && currentAnswer.includes(opt.id) : currentAnswer === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleAnswer(q.id, opt.id, q.type === 'multi', q.max)}
                  className={`p-4 rounded-[1.5rem] border-2 cursor-pointer flex items-center gap-4 transition-all duration-200
                    ${isSelected ? 'border-slate-800 bg-white shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center shrink-0 border-2 transition-colors ${q.type === 'multi' ? 'rounded-md' : 'rounded-full'} ${isSelected ? 'border-slate-800 bg-slate-800' : 'border-slate-300 bg-white'}`}
                  >
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className={`font-bold text-sm ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{opt.label}</span>
                    {opt.subtitle && <span className="text-[11px] font-medium text-slate-500 mt-0.5">{opt.subtitle}</span>}
                  </div>
                  {opt.icon && <span className="text-2xl opacity-90">{opt.icon}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-20">
          <Button disabled={!canProceed} onClick={handleNext}>
            {currentQIndex < module.questions.length - 1 ? 'Continue' : 'Finish Module'}
          </Button>
        </div>
      </div>
    );
  };

  const renderQuoteTransition = () => (
    <QuickReviewIntroScreen onPrimary={() => setScreen('quote_form')} onSecondary={() => setScreen('dashboard')} />
  );

  const renderQuoteForm = () => {
    const updateQuote = (field, value) => setQuoteData((prev) => ({ ...prev, [field]: value }));
    const submitLead = async () => {
      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);

      const payload = {
        submittedAt: new Date().toISOString(),
        currentScreen: screen,
        completedModules,
        activeModuleId,
        answers,
        quoteData,
        scoreData: calculateFortressData,
        moduleTimings
      };

      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          let message = 'Unable to submit your request right now.';

          try {
            const errorBody = await response.json();
            message = errorBody.error || message;
          } catch {
            // Keep the generic message when Cloudflare returns a non-JSON error page.
          }

          throw new Error(message);
        }

        setQuoteSuccessCelebration(true);
        setScreen('quote_teaser');
        schedule(() => setQuoteSuccessCelebration(false), 2400);
      } catch (error) {
        alert(error.message || 'Unable to submit your request right now. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const nextStep = () => {
      if (quoteStep < 4) {
        setQuoteStep((prev) => prev + 1);
        return;
      }

      submitLead();
    };
    const prevStep = () => (quoteStep > 1 ? setQuoteStep((prev) => prev - 1) : setScreen('quote_transition'));

    const canProceed = () => {
      if (quoteStep === 1) {
        return quoteData.dob && quoteData.gender;
      }

      if (quoteStep === 2) {
        return quoteData.goal;
      }

      if (quoteStep === 3) {
        return quoteData.budget;
      }

      if (quoteStep === 4) {
        return quoteData.name && quoteData.phone && quoteData.email && quoteData.consent;
      }

      return false;
    };

    return (
      <div className="h-full flex flex-col bg-slate-50 animate-slide-up relative">
        <div className="pt-8 px-6 pb-6 shrink-0 bg-white rounded-b-[2rem] shadow-sm relative z-10 border-b border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevStep} className="text-slate-400 hover:text-slate-600 font-medium text-sm flex items-center gap-1">
              ← Back
            </button>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step {quoteStep} of 4</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full">
            <div
              className="progress-fill h-full rounded-full transition-all"
              style={{ width: `${(quoteStep / 4) * 100}%`, backgroundColor: getProgressColor((quoteStep / 4) * 100) }}
            ></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 pb-28 hide-scrollbar">
          {quoteStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-extrabold text-slate-800 mb-6">Basic Details</h2>
              <div className="bg-slate-100/80 p-3 rounded-xl mb-8 flex gap-3 items-start border border-slate-200/60">
                <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Age and gender help us estimate possible premium ranges more accurately. This is kept strictly private.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Birthdate</label>
                  <input
                    type="date"
                    value={quoteData.dob}
                    onChange={(e) => updateQuote('dob', e.target.value)}
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-slate-800 focus:outline-none font-medium text-slate-700 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
                  <div className="flex gap-3">
                    {['Male', 'Female'].map((g) => (
                      <button
                        key={g}
                        onClick={() => updateQuote('gender', g)}
                        className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${quoteData.gender === g ? 'border-slate-800 bg-slate-800 text-white shadow-md' : 'border-slate-100 bg-white text-slate-600 shadow-sm'}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {quoteStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-extrabold text-slate-800 mb-2">Primary Focus</h2>
              <p className="text-slate-500 text-sm mb-6 font-medium">What do you want this estimate to prioritize?</p>
              <div className="space-y-3">
                {[
                  { id: 'family', label: 'Family Protection', icon: '👨‍👩‍👧‍👦' },
                  { id: 'health', label: 'Health & Illness Coverage', icon: '🏥' },
                  { id: 'savings', label: 'Savings + Protection', icon: '💰' },
                  { id: 'invest', label: 'Investment Growth', icon: '📈' },
                  { id: 'explore', label: 'Still Exploring', icon: '🧭' }
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => updateQuote('goal', opt.id)}
                    className={`p-4 rounded-[1.5rem] border-2 cursor-pointer flex gap-4 items-center transition-all ${quoteData.goal === opt.id ? 'border-slate-800 bg-slate-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className={`font-bold text-sm ${quoteData.goal === opt.id ? 'text-slate-900' : 'text-slate-700'}`}>{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {quoteStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-extrabold text-slate-800 mb-2">Choose Your Starting Level</h2>
              <p className="text-slate-500 text-sm mb-6 font-medium">
                This helps us prepare options that match both your goals and comfort level. You can adjust this later.
              </p>
              <div className="space-y-4">
                {[
                  {
                    id: '<1500',
                    title: 'Starter Foundation',
                    label: 'Below ₱1,500 / month',
                    daily: '~₱50/day',
                    desc: 'For starting small and building consistency.',
                    support: 'May help with basic protection or entry-level planning options.',
                    badge: null
                  },
                  {
                    id: '1500-3000',
                    title: 'Balanced Protection',
                    label: '₱1,500 – ₱3,000 / month',
                    daily: '~₱50-₱100/day',
                    desc: 'For practical protection that fits monthly cash flow.',
                    support: 'May support starter life coverage, health protection, or savings-focused options depending on your profile.',
                    badge: 'Most practical starting point',
                    badgeColor: 'bg-indigo-100 text-indigo-700'
                  },
                  {
                    id: '3000-5000',
                    title: 'Stronger Safety Net',
                    label: '₱3,000 – ₱5,000 / month',
                    daily: '~₱100-₱160/day',
                    desc: 'For more flexibility, wider benefits, or stronger family protection.',
                    support: 'May allow stronger coverage, added benefits, or more customized planning.',
                    badge: 'More flexibility',
                    badgeColor: 'bg-emerald-100 text-emerald-700'
                  },
                  {
                    id: '5000+',
                    title: 'Growth Builder',
                    label: '₱5,000+ / month',
                    daily: '₱160+/day',
                    desc: 'For stronger long-term planning, savings, and protection potential.',
                    support:
                      'May support higher protection, investment-linked options, education funding, or retirement planning depending on suitability.',
                    badge: 'Long-term focused',
                    badgeColor: 'bg-amber-100 text-amber-700'
                  },
                  {
                    id: 'unsure',
                    title: 'Help Me Decide',
                    label: 'Not sure yet',
                    daily: null,
                    desc: 'Let an advisor suggest a realistic range based on your profile.',
                    support: 'Get personalized guidance without pressure.',
                    badge: null
                  }
                ].map((opt) => {
                  const isSelected = quoteData.budget === opt.id;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => updateQuote('budget', opt.id)}
                      className={`p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all ${isSelected ? 'border-slate-800 bg-slate-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                    >
                      {opt.badge && (
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 ${opt.badgeColor}`}>
                          {opt.badge}
                        </span>
                      )}
                      <div className="flex justify-between items-start mb-1">
                        <span className={`font-extrabold text-base ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>{opt.title}</span>
                        <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex shrink-0 items-center justify-center ${isSelected ? 'border-slate-800' : 'border-slate-300'}`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-slate-600 text-sm">{opt.label}</span>
                        {opt.daily && <span className="text-[11px] font-medium text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">{opt.daily}</span>}
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{opt.desc}</p>

                      {isSelected && (
                        <div className="mt-4 pt-3 border-t border-slate-200 animate-slide-up">
                          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                            <span className="font-bold text-slate-700">What this may support: </span>
                            {opt.support}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-[11px] text-slate-400 font-medium text-center leading-relaxed px-4">
                You can adjust this later. A higher range may allow more flexibility, stronger coverage, or added savings features depending on your profile.
              </p>
            </div>
          )}

          {quoteStep === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-extrabold text-slate-800 mb-2">Almost done!</h2>
              <p className="text-slate-500 text-sm mb-6 font-medium">Where should we send your detailed profile assessment?</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Juan Dela Cruz"
                    value={quoteData.name}
                    onChange={(e) => updateQuote('name', e.target.value)}
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-slate-800 focus:outline-none font-medium text-slate-700 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="09XX XXX XXXX"
                    value={quoteData.phone}
                    onChange={(e) => updateQuote('phone', e.target.value)}
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-slate-800 focus:outline-none font-medium text-slate-700 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="juan@example.com"
                    value={quoteData.email}
                    onChange={(e) => updateQuote('email', e.target.value)}
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-slate-800 focus:outline-none font-medium text-slate-700 shadow-sm"
                  />
                  <p className="mt-2 text-[11px] text-slate-400 font-medium leading-relaxed">
                    We&apos;ll use this email to send your detailed profile assessment and helpful follow-up guidance related to your results.
                  </p>
                </div>
                <div className="pt-2 flex items-start gap-3 bg-slate-100/50 p-4 rounded-2xl border border-slate-100">
                  <div
                    className={`mt-0.5 w-5 h-5 flex-shrink-0 border-2 rounded flex items-center justify-center cursor-pointer transition-colors ${quoteData.consent ? 'border-slate-800 bg-slate-800' : 'border-slate-300 bg-white'}`}
                    onClick={() => updateQuote('consent', !quoteData.consent)}
                  >
                    {quoteData.consent && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed cursor-pointer" onClick={() => updateQuote('consent', !quoteData.consent)}>
                    I agree to receive my detailed profile assessment by email and to be contacted with relevant follow-up guidance. No payment or application is required.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-20">
          <Button disabled={!canProceed() || isSubmitting} onClick={nextStep}>
            {quoteStep < 4 ? 'Continue' : isSubmitting ? 'Sending...' : 'Send My Summary'}
          </Button>
        </div>
      </div>
    );
  };

  const renderQuoteTeaser = () => {
    const getGoalText = (id) => ({ family: 'Family Protection', health: 'Health & Illness', savings: 'Savings + Protection', explore: 'Exploring Options' }[id] || 'General Estimate');

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-y-auto hide-scrollbar relative overflow-hidden">
        <CelebrationOverlay active={quoteSuccessCelebration} src={LOTTIE_URLS.success} className="bg-white/30 backdrop-blur-[2px]" />
        <div className="bg-slate-800 px-6 pt-16 pb-20 text-center relative z-10 shrink-0 rounded-b-[2.5rem] shadow-md animate-slide-up">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 mx-auto rounded-[1.5rem] flex items-center justify-center text-3xl mb-6 border border-emerald-500/30">📩</div>
          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">You’re All Set!!</h2>
          <p className="text-slate-300 text-sm font-medium">An advisor will review your profile shortly.</p>
        </div>

        <div className="px-5 -mt-12 relative z-20 space-y-4 pb-10">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-md border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-5 block">Your Snapshot Summary</span>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                <span className="text-xs text-slate-500 font-medium">Suggested Focus</span>
                <span className="font-bold text-slate-800 text-sm text-right">{getGoalText(quoteData.goal)}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                <span className="text-xs text-slate-500 font-medium">Comfort Range</span>
                <span className="font-bold text-slate-800 text-sm text-right">{quoteData.budget.replace('-', ' - ')}/mo</span>
              </div>
              <div className="flex justify-between items-end pb-1">
                <span className="text-xs text-slate-500 font-medium">Status</span>
                <span className="font-bold text-emerald-600 text-sm text-right flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Profile Shared
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-100/50 rounded-[1.5rem] p-6 border border-slate-200/50 text-center">
            <h3 className="font-bold text-slate-800 mb-2 text-sm">What happens next?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-0 font-medium">
              We&apos;ll send your detailed profile assessment by email and may follow up with guidance that matches your results. Feel free to ask questions with absolutely zero commitment.
            </p>
          </div>

          <div className="pt-2 space-y-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button onClick={() => setScreen('dashboard')} variant="primary" className="py-3.5">
              Back to My Fortress
            </Button>
            <Button onClick={restartJourney} variant="secondary" className="py-3.5">
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell w-full md:max-w-md md:h-[850px] md:min-h-0 md:max-h-[95vh] relative md:rounded-[2.5rem] md:shadow-2xl overflow-hidden flex flex-col md:border-[8px] md:border-slate-800 bg-white">
      <div className="flex-1 overflow-hidden relative">
        {screen === 'welcome' && renderWelcome()}
        {screen === 'hub' && renderHub()}
        {screen === 'module' && renderModule()}
        {screen === 'analyzing' && (
          <AnalyzingScreen
            onComplete={() => {
              setScreen('dashboard');
              setDashboardCelebration(true);
              schedule(() => setDashboardCelebration(false), 2400);
            }}
          />
        )}
        {screen === 'dashboard' && (
          <DashboardScreen
            data={calculateFortressData}
            onTransitionToQuote={() => setScreen('quote_transition')}
            onResetJourney={restartJourney}
            celebrationActive={dashboardCelebration}
          />
        )}
        {screen === 'quote_transition' && renderQuoteTransition()}
        {screen === 'quote_form' && renderQuoteForm()}
        {screen === 'quote_teaser' && renderQuoteTeaser()}
      </div>
    </div>
  );
}

export default App;
