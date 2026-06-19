import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Compass } from 'lucide-react';

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

const CalibratingScorePlaceholder = () => (
  <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
    <div className="absolute inset-0 rounded-full border-[8px] border-slate-100" />
    <div className="absolute inset-0 rounded-full border-[8px] border-transparent border-t-indigo-500 border-r-emerald-400 animate-spin" />
    <div className="absolute inset-4 rounded-full bg-white shadow-inner blur-[1px]" />
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-4xl font-extrabold text-slate-300 tracking-tight blur-sm">68</span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 animate-pulse">Calculating</span>
    </div>
  </div>
);

const QuickWinSimulatorCard = () => (
  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-100/70 p-5 text-center shadow-sm">
    <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-700/40 bg-emerald-900 text-white shadow-sm">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M4 17l6-6 4 4 6-8" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M15 7h5v5" />
      </svg>
    </div>
    <div className="mx-auto mb-3 w-fit rounded-full border border-emerald-700/40 bg-emerald-900 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
      +20 pts
    </div>
    <h3 className="text-sm font-extrabold tracking-tight text-slate-800">Let&apos;s see how to boost your rating.</h3>
    <p className="mx-auto mt-2 max-w-[18rem] text-xs font-medium leading-relaxed text-slate-500">
      Answer 4 quick questions to simulate your easiest &apos;quick wins&apos; for a stronger profile.
    </p>
    <div className="mt-5 grid grid-cols-3 gap-2.5" aria-label="Potential improvement slots">
      {[
        { icon: '🛡️', label: 'Health Shield' },
        { icon: '🌴', label: 'Lifestyle Fund' },
        { icon: '🛡️', label: 'Life Protection' }
      ].map((slot) => (
        <div key={slot.label} className="flex min-h-[5.25rem] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/60 px-2 py-3 text-center text-[11px] font-bold leading-tight text-slate-500 opacity-60">
          <span className="text-lg grayscale">{slot.icon}</span>
          <span>{slot.label}</span>
        </div>
      ))}
    </div>
  </div>
);

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
      <div className="relative z-10 mb-8">
        <div className="welcome-logo">
          <Compass className="h-10 w-10 text-white" strokeWidth={2.2} />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-3 tracking-tight">Building Your Fortress</h2>
      <p className="text-slate-300 font-medium animate-pulse-soft">{text}</p>
    </div>
  );
};

const DashboardScreen = ({ data, onTransitionToQuote, onResetJourney, celebrationActive }) => {
  const [isNaturalCtaVisible, setIsNaturalCtaVisible] = useState(false);
  const dashboardScrollRef = useRef(null);
  const naturalCtaRef = useRef(null);

  useEffect(() => {
    const scrollElement = dashboardScrollRef.current;
    const ctaElement = naturalCtaRef.current;

    if (!scrollElement || !ctaElement || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNaturalCtaVisible(entry.isIntersecting);
      },
      {
        root: scrollElement,
        threshold: 0.22
      }
    );

    observer.observe(ctaElement);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-slate-50 h-full relative overflow-hidden">
      <CelebrationOverlay active={celebrationActive} src={LOTTIE_URLS.fortressReveal} className="bg-white/30 backdrop-blur-[2px]" />
      <div ref={dashboardScrollRef} className="app-scroll h-full hide-scrollbar relative">
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
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">Layer Analysis</h2>

        <div className="relative mx-auto w-40 h-40 mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            <CalibratingScorePlaceholder />
          </div>
          <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-2xl border-2 border-slate-50 z-20 transform translate-x-2 -translate-y-2">
            🛡️
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">Analyzing your inputs...</h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[300px] mx-auto font-medium">
          We found a few vulnerabilities in your safety net. We need to calibrate your profile to calculate your exact score.
        </p>
      </div>

        <div className="px-5 mt-6 mb-8 pb-[calc(env(safe-area-inset-bottom)+7.5rem)] space-y-4">
        <h3 className="font-bold text-slate-800 px-1 text-sm">Quick Layer Preview</h3>

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

        <QuickWinSimulatorCard />

          <div ref={naturalCtaRef} className="bg-slate-800 rounded-[1.5rem] p-6 shadow-md text-white mt-8 relative overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <span className="text-3xl mb-3 block">{data.cta.icon}</span>
            <h3 className="text-lg font-bold mb-2 tracking-tight">{data.cta.headline}</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed font-medium">{data.cta.hook}</p>
            <p className="mb-3 text-center text-xs font-semibold text-slate-300">Takes ~30 seconds.</p>

            <Button
              onClick={() => onTransitionToQuote(data.cta)}
              variant="emerald"
              className="cta-quick-wins-motion mb-3 border border-emerald-200/70 text-white"
            >
                Calibrate My Score
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
      {!isNaturalCtaVisible && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent animate-slide-up">
          <div className="pointer-events-auto">
            <Button onClick={() => onTransitionToQuote(data.cta)} variant="emerald" className="cta-quick-wins-motion border border-emerald-200/70 text-white">
              Calibrate My Score
            </Button>
          </div>
        </div>
      )}
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
    age: 30,
    gender: '',
    goal: '',
    budget: '',
    name: '',
    phone: '',
    email: '',
    consent: false
  });
  const [quoteIntent, setQuoteIntent] = useState(null);
  const [contactCopySent, setContactCopySent] = useState(false);

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
  const ageHoldTimerRef = useRef(null);

  const clearTimers = () => {
    timersRef.current.forEach((timerId) => clearTimeout(timerId));
    timersRef.current = [];
    if (ageHoldTimerRef.current) {
      clearInterval(ageHoldTimerRef.current);
      ageHoldTimerRef.current = null;
    }
  };

  const schedule = (callback, delay) => {
    const timerId = window.setTimeout(() => {
      timersRef.current = timersRef.current.filter((existingTimerId) => existingTimerId !== timerId);
      callback();
    }, delay);

    timersRef.current.push(timerId);
    return timerId;
  };

  const handleTransitionToQuote = (cta) => {
    setQuoteIntent(
      cta
        ? {
            headline: cta.headline,
            buttonText: cta.buttonText,
            wizardHeadline: cta.wizardHeadline
          }
        : null
    );
    setQuoteStep(1);
    setScreen('quote_form');
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
      age: 30,
      gender: '',
      goal: '',
      budget: '',
      name: '',
      phone: '',
      email: '',
      consent: false
    });
    setQuoteIntent(null);
    setContactCopySent(false);
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
        buttonText: 'Check My Family Quick Wins',
        wizardHeadline: "Let's check your family quick wins.",
        icon: '🛡️'
      };
    } else if (protCount === 0) {
      cta = {
        headline: 'Build your first safety shield.',
        hook: "Your savings help with today, but a protection plan shields your tomorrow. Let's find beginner-friendly options.",
        buttonText: 'Find My Foundation Quick Wins',
        wizardHeadline: "Let's find your foundation quick wins.",
        icon: '🌱'
      };
    } else if (answers.priorities.includes('invest') && score < 60) {
      cta = {
        headline: 'Protect before you grow.',
        hook: 'Your investment goals are safer when your basic protection layer is solid. Let\'s review your balance.',
        buttonText: 'Find My Protection Quick Wins',
        wizardHeadline: "Let's find your protection quick wins.",
        icon: '📈'
      };
    } else {
      cta = {
        headline: 'Keep building your momentum.',
        hook: 'Let\'s review a personalized strategy to align your current setup with your future goals.',
        buttonText: 'Find My Easiest Quick Wins',
        wizardHeadline: "Let's find your easiest quick wins.",
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
        <CelebrationOverlay active={isFinalCelebrationActive} src={LOTTIE_URLS.roadmapCelebrate} className="bg-white/55 backdrop-blur-[2px] [&>div]:m-6 [&>div]:rounded-[2rem] [&>div]:bg-white/45 [&>div]:shadow-2xl [&>div]:ring-1 [&>div]:ring-white/70" />
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

  const renderQuoteForm = () => {
    const updateQuote = (field, value) => setQuoteData((prev) => ({ ...prev, [field]: value }));
    const clampAge = (value) => Math.max(18, Math.min(99, Number(value) || 30));
    const adjustAge = (delta) =>
      setQuoteData((prev) => ({
        ...prev,
        age: clampAge((prev.age ?? 30) + delta)
      }));
    const incrementAge = () => adjustAge(1);
    const decrementAge = () => adjustAge(-1);
    const stopAgeHold = () => {
      if (ageHoldTimerRef.current) {
        clearInterval(ageHoldTimerRef.current);
        ageHoldTimerRef.current = null;
      }
    };
    const startAgeHold = (direction) => {
      stopAgeHold();
      const updateAge = direction === 'increment' ? incrementAge : decrementAge;
      updateAge();
      ageHoldTimerRef.current = window.setInterval(updateAge, 120);
    };

    const submitLead = async () => {
      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      const normalizedAge = clampAge(quoteData.age);
      const birthYear = new Date().getFullYear() - normalizedAge;

      const payload = {
        submittedAt: new Date().toISOString(),
        currentScreen: screen,
        completedModules,
        activeModuleId,
        answers,
        quoteData: {
          ...quoteData,
          age: normalizedAge,
          birthYear
        },
        quoteIntent,
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

        let responseBody = null;

        try {
          responseBody = await response.json();
        } catch {
          responseBody = null;
        }

        if (!response.ok) {
          let message = 'Unable to submit your request right now.';
          message = responseBody?.error || message;

          throw new Error(message);
        }

        setContactCopySent(Boolean(responseBody?.contactCopy?.sent));
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
    const prevStep = () => (quoteStep > 1 ? setQuoteStep((prev) => prev - 1) : setScreen('dashboard'));

    const canProceed = () => {
      if (quoteStep === 1) {
        return quoteData.age;
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Calibration</span>
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
              <h2 className="text-xl font-extrabold text-slate-800 mb-6">Calibrate your age range</h2>
              <div className="bg-slate-100/80 p-3 rounded-xl mb-8 flex gap-3 items-start border border-slate-200/60">
                <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Age helps us calibrate your score and prepare a more realistic beginner-friendly roadmap. This is kept strictly private.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 text-center">Age</label>
                  <div className="flex items-center justify-center gap-4 rounded-[1.5rem] border-2 border-slate-100 bg-white p-4 shadow-sm">
                    <button
                      type="button"
                      aria-label="Decrease age"
                      onPointerDown={() => startAgeHold('decrement')}
                      onPointerUp={stopAgeHold}
                      onPointerLeave={stopAgeHold}
                      onPointerCancel={stopAgeHold}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl font-black text-slate-700 transition hover:bg-slate-200 active:scale-95"
                    >
                      −
                    </button>
                    <div className="min-w-[7rem] text-center">
                      <div className="text-5xl font-black tracking-tight text-slate-900">{quoteData.age}</div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">years old</div>
                    </div>
                    <button
                      type="button"
                      aria-label="Increase age"
                      onPointerDown={() => startAgeHold('increment')}
                      onPointerUp={stopAgeHold}
                      onPointerLeave={stopAgeHold}
                      onPointerCancel={stopAgeHold}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-3xl font-black text-white shadow-md transition hover:bg-slate-900 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[11px] font-medium text-slate-400">Hold a button to adjust faster.</p>
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
              <h2 className="text-xl font-extrabold text-slate-800 mb-2">Where should we send your final score?</h2>
              <p className="text-slate-500 text-sm mb-6 font-medium">
                Your profile is calibrated. Enter your details to unlock your exact Fortress Score and beginner-friendly roadmap.
              </p>
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
            {quoteStep < 4 ? 'Continue' : isSubmitting ? 'Revealing...' : 'Reveal My Score & Roadmap'}
          </Button>
        </div>
      </div>
    );
  };

  const renderQuoteTeaser = () => {
    const getGoalText = (id) => ({ family: 'Family Protection', health: 'Health & Illness', savings: 'Savings + Protection', invest: 'Investment Growth', explore: 'Exploring Options' }[id] || 'General Estimate');
    const getBudgetText = (id) =>
      ({
        '<1500': 'below ₱1,500/month',
        '1500-3000': '₱1,500-₱3,000/month',
        '3000-5000': '₱3,000-₱5,000/month',
        '5000+': '₱5,000+/month',
        unsure: 'a flexible starter range'
      }[id] || 'your selected range');
    const scoreData = calculateFortressData;
    const budgetText = getBudgetText(quoteData.budget);

    return (
      <div className="h-full flex flex-col bg-slate-50 overflow-y-auto hide-scrollbar relative overflow-hidden">
        <CelebrationOverlay active={quoteSuccessCelebration} src={LOTTIE_URLS.success} className="bg-white/30 backdrop-blur-[2px]" />
        <div className="bg-slate-800 px-6 pt-12 pb-20 text-center relative z-10 shrink-0 rounded-b-[2.5rem] shadow-md animate-slide-up">
          <div className="relative mx-auto w-40 h-40 mb-5">
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white shadow-lg">
              <ScoreRing score={scoreData.score} colorClass={scoreData.scoreColor} />
            </div>
            <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-2xl border-2 border-slate-50 z-20 transform translate-x-2 -translate-y-2">
              {scoreData.persona.emoji}
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Your Fortress Score is {scoreData.score}/100</h2>
          <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-[300px] mx-auto">
            Congratulations, {quoteData.name || 'your profile'} is calibrated. Your beginner-friendly roadmap for {budgetText}{' '}
            {contactCopySent ? 'has been sent to your email.' : 'has been shared with our team for email follow-up.'}
          </p>
        </div>

        <div className="px-5 -mt-12 relative z-20 space-y-4 pb-10">
          <div className="bg-white rounded-[1.5rem] p-6 shadow-md border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-5 block">Your Roadmap Summary</span>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                <span className="text-xs text-slate-500 font-medium">Score Type</span>
                <span className="font-bold text-slate-800 text-sm text-right">{scoreData.persona.title}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                <span className="text-xs text-slate-500 font-medium">Suggested Focus</span>
                <span className="font-bold text-slate-800 text-sm text-right">{getGoalText(quoteData.goal)}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-50 pb-3">
                <span className="text-xs text-slate-500 font-medium">Comfort Range</span>
                <span className="font-bold text-slate-800 text-sm text-right">{budgetText}</span>
              </div>
              <div className="flex justify-between items-end pb-1">
                <span className="text-xs text-slate-500 font-medium">Status</span>
                <span className="font-bold text-emerald-600 text-sm text-right flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Score Revealed
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-100/50 rounded-[1.5rem] p-6 border border-slate-200/50 text-center">
            <h3 className="font-bold text-slate-800 mb-2 text-sm">What happens next?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-0 font-medium">
              We&apos;ll send your detailed profile assessment by email and may follow up with guidance that matches your results and selected budget. Feel free to ask questions with absolutely zero commitment.
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
            onTransitionToQuote={handleTransitionToQuote}
            onResetJourney={restartJourney}
            celebrationActive={dashboardCelebration}
          />
        )}
        {screen === 'quote_form' && renderQuoteForm()}
        {screen === 'quote_teaser' && renderQuoteTeaser()}
      </div>
    </div>
  );
}

export default App;
