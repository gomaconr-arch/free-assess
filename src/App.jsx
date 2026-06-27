import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Compass,
  HeartPulse,
  Home,
  Info,
  KeyRound,
  Landmark,
  Lock,
  MessageCircle,
  Shield,
  SlidersHorizontal,
  Sprout,
  UserRoundCog,
  UsersRound,
  WalletCards
} from 'lucide-react';

const Lottie = lazy(() => import('lottie-react'));

const LOTTIE_URLS = {
  checkmark: 'checkmark',
  microCelebrate: 'microCelebrate',
  foundationReveal: 'foundationReveal',
  success: 'checkmark'
};

const animationLoaders = {
  checkmark: () => import('./assets/lottie/checkmark.json'),
  microCelebrate: () => import('./assets/lottie/microCelebrate.json'),
  foundationReveal: () => import('./assets/lottie/foundationReveal.json')
};

const DEFAULT_AGENT_CONFIG = {
  slug: '',
  agentName: '',
  toolName: 'Financial Foundation Check',
  headline: 'Map My Future',
  subheadline: "Let's look at where you stand today. Tap through a few quick steps to see how prepared you are for tomorrow.",
  status: 'active'
};

const RESERVED_ROUTE_SEGMENTS = new Set([
  'api',
  'assets',
  'documentation.html',
  'financial_foundation_check.html',
  'favicon.svg',
  'thumbnail.jpg',
  'social-preview.jpeg'
]);

const getInitialAgentSlug = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  const basePath = import.meta.env.BASE_URL || '/';
  let path = window.location.pathname || '/';

  if (basePath !== '/' && path.startsWith(basePath)) {
    path = path.slice(basePath.length - 1) || '/';
  }

  const slug = path.split('/').filter(Boolean)[0] || '';
  return RESERVED_ROUTE_SEGMENTS.has(slug) ? '' : slug;
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
    helper: 'This helps us understand your core responsibilities and what kind of starting point fits you best.',
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
    title: 'Emergency Fund',
    icon: '🏦',
    time: '1 min',
    desc: 'Your first cushion for surprises.',
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
    title: 'Protection Review',
    icon: '🛡️',
    time: '1 min',
    desc: 'Checking your current protection setup.',
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
      <RemoteLottie src={src} loop={false} className="h-full w-full max-w-none" />
    </div>
  );
};

const SlideToSubmit = ({ disabled, isSubmitting, onSubmit }) => {
  const trackRef = useRef(null);
  const dragRef = useRef(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const thumbSize = 56;

  const getMaxDrag = () => {
    const trackWidth = trackRef.current?.getBoundingClientRect().width || 0;
    return Math.max(0, trackWidth - thumbSize - 8);
  };

  const updateDrag = (clientX) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const nextX = Math.max(0, Math.min(getMaxDrag(), clientX - rect.left - thumbSize / 2));
    dragRef.current = nextX;
    setDragX(nextX);
  };

  const resetDrag = () => {
    setIsDragging(false);
    dragRef.current = 0;
    setDragX(0);
  };

  const completeDrag = () => {
    const maxDrag = getMaxDrag();
    const didComplete = maxDrag > 0 && dragRef.current >= maxDrag * 0.86;

    setIsDragging(false);

    if (didComplete && !disabled && !isSubmitting) {
      dragRef.current = maxDrag;
      setDragX(maxDrag);
      onSubmit();
      return;
    }

    dragRef.current = 0;
    setDragX(0);
  };

  useEffect(() => {
    if (disabled || isSubmitting) {
      dragRef.current = 0;
      setDragX(0);
      setIsDragging(false);
    }
  }, [disabled, isSubmitting]);

  return (
    <div
      ref={trackRef}
      className={`relative h-16 overflow-hidden rounded-full p-1 shadow-lg transition-all ${
        disabled
          ? 'bg-slate-200 text-slate-400 shadow-none'
          : 'bg-slate-900 text-white shadow-emerald-500/20'
      }`}
      onPointerMove={(event) => {
        if (isDragging && !disabled && !isSubmitting) {
          updateDrag(event.clientX);
        }
      }}
      onPointerUp={completeDrag}
      onPointerCancel={resetDrag}
      aria-disabled={disabled || isSubmitting}
    >
      <div
        className="absolute inset-y-1 left-1 rounded-full bg-emerald-500 transition-[width] duration-100"
        style={{ width: `${dragX + thumbSize}px`, opacity: disabled ? 0 : 1 }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center px-16 text-sm font-extrabold">
        {isSubmitting ? 'Preparing your analysis...' : disabled ? 'Enter a valid number and email' : 'Agree and Reveal Score'}
      </div>
      <button
        type="button"
        disabled={disabled || isSubmitting}
        aria-label="Slide to submit"
        className="absolute left-1 top-1 flex h-14 w-14 touch-none items-center justify-center rounded-full bg-white text-slate-900 shadow-md transition-transform disabled:cursor-not-allowed disabled:text-slate-300"
        style={{ transform: `translateX(${dragX}px)` }}
        onPointerDown={(event) => {
          if (disabled || isSubmitting) return;

          event.currentTarget.setPointerCapture(event.pointerId);
          setIsDragging(true);
          updateDrag(event.clientX);
        }}
      >
        {isSubmitting ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" aria-hidden="true" />
        ) : (
          <ArrowRight className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
        )}
      </button>
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

const InitialEstimateScorePlaceholder = () => (
  <div className="relative w-32 h-32 mx-auto flex items-center justify-center" aria-label="Overall score will be personalized after the final review step">
    <svg className="w-full h-full drop-shadow-sm" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="38" className="stroke-slate-100" strokeWidth="7" fill="none" />
      <circle cx="50" cy="50" r="38" className="stroke-slate-300" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="5 8" />
    </svg>
    <div className="absolute inset-4 rounded-full bg-white shadow-inner" />
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-4xl font-extrabold text-slate-300 tracking-tight">??</span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-indigo-500">Personalize</span>
    </div>
  </div>
);

const STATUS_TONES = {
  rose: {
    iconWrap: 'bg-white/20 text-white ring-white/25 shadow-rose-950/20',
    badge: 'bg-red-800 text-white shadow-lg shadow-red-950/25',
    accent: 'border-white/20',
    slide: 'bg-gradient-to-br from-red-950 via-red-900 to-rose-950',
    text: 'text-white',
    muted: 'text-rose-50/90',
    softPanel: 'bg-white/10 ring-white/15'
  },
  amber: {
    iconWrap: 'bg-white/20 text-white ring-white/25 shadow-amber-950/20',
    badge: 'bg-orange-800 text-white shadow-lg shadow-orange-950/25',
    accent: 'border-white/20',
    slide: 'bg-gradient-to-br from-orange-950 via-orange-800 to-amber-950',
    text: 'text-white',
    muted: 'text-amber-50/90',
    softPanel: 'bg-white/15 ring-white/15'
  },
  indigo: {
    iconWrap: 'bg-white/20 text-white ring-white/25 shadow-indigo-950/20',
    badge: 'bg-indigo-800 text-white shadow-lg shadow-indigo-950/25',
    accent: 'border-white/20',
    slide: 'bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-950',
    text: 'text-white',
    muted: 'text-indigo-50/90',
    softPanel: 'bg-white/10 ring-white/15'
  },
  emerald: {
    iconWrap: 'bg-white/20 text-white ring-white/25 shadow-emerald-950/20',
    badge: 'bg-emerald-800 text-white shadow-lg shadow-emerald-950/25',
    accent: 'border-white/20',
    slide: 'bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950',
    text: 'text-white',
    muted: 'text-emerald-50/90',
    softPanel: 'bg-white/10 ring-white/15'
  },
  purple: {
    iconWrap: 'bg-white/20 text-white ring-white/25 shadow-purple-950/20',
    badge: 'bg-purple-800 text-white shadow-lg shadow-purple-950/25',
    accent: 'border-white/20',
    slide: 'bg-gradient-to-br from-purple-950 via-violet-900 to-fuchsia-950',
    text: 'text-white',
    muted: 'text-purple-50/90',
    softPanel: 'bg-white/10 ring-white/15'
  },
  brown: {
    iconWrap: 'bg-white/20 text-white ring-white/25 shadow-stone-950/20',
    badge: 'bg-stone-800 text-white shadow-lg shadow-stone-950/25',
    accent: 'border-white/20',
    slide: 'bg-gradient-to-br from-stone-950 via-amber-950 to-neutral-950',
    text: 'text-white',
    muted: 'text-stone-100/90',
    softPanel: 'bg-white/10 ring-white/15'
  },
  slate: {
    iconWrap: 'bg-white/20 text-white ring-white/25 shadow-slate-950/20',
    badge: 'bg-slate-700 text-white shadow-lg shadow-slate-950/25',
    accent: 'border-white/20',
    slide: 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-950',
    text: 'text-white',
    muted: 'text-slate-100/90',
    softPanel: 'bg-white/10 ring-white/15'
  },
  navy: {
    iconWrap: 'bg-emerald-400/20 text-emerald-100 ring-emerald-300/25 shadow-emerald-950/20',
    badge: 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/25',
    accent: 'border-white/10',
    slide: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950',
    text: 'text-white',
    muted: 'text-slate-200/90',
    softPanel: 'bg-white/10 ring-white/15'
  }
};

const getPreviewTone = (status, title = '') => {
  if (title.includes('Emergency Fund')) return 'rose';
  if (title.includes('Health Costs')) return 'emerald';
  if (title.includes('Family Support')) return 'purple';
  if (title.includes('Cash Flow')) return 'indigo';
  if (title.includes('Debt')) return 'brown';
  if (['Needs Attention', 'Missing Layer', 'Needs Review'].includes(status)) return 'rose';
  if (['Room to Grow', 'Watch Area', 'Getting There'].includes(status)) return 'amber';
  if (['Has Some Cover', 'Moderate'].includes(status)) return 'indigo';
  if (['Well Protected', 'Stable'].includes(status)) return 'emerald';
  return 'slate';
};

const getPreviewIcon = (title) => {
  if (title.includes('Health')) return HeartPulse;
  if (title.includes('Family')) return UserRoundCog;
  if (title.includes('Unexpected') || title.includes('Emergency')) return Landmark;
  if (title.includes('Cash')) return Banknote;
  if (title.includes('Debt')) return WalletCards;
  return UserRoundCog;
};

const mapPreviewToCarouselCard = (item) => {
  const title = item.title === 'Unexpected Expenses' ? 'Emergency Fund' : item.title;
  const tone = getPreviewTone(item.status, title);

  return {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    title,
    status: item.status,
    statusTone: tone,
    icon: getPreviewIcon(title),
    shortText: item.shortText || item.desc,
    answerPreview: item.answerPreview,
    answerTopic: item.answerTopic || title.toLowerCase(),
    detail: item.detail || item.desc,
    whyItMatters:
      item.whyItMatters ||
      (title === 'Major Health Event'
        ? 'Medical costs can affect savings, monthly cash flow, and family plans.'
        : title === 'Family Backup Plan'
          ? 'A backup plan helps protect the people who rely on your income.'
          : 'A stronger cash buffer can make unexpected costs easier to absorb.'),
    nextStepHint: item.nextStepHint || 'The final review step helps make your result and options more personal.'
  };
};

const buildPreviewCards = (data, includePersonalizationCard = true) => {
  const cards = data.pressurePoints.map(mapPreviewToCarouselCard);

  if (!includePersonalizationCard) {
    return cards;
  }

  return [...cards, {
    id: 'personalize-options',
    title: 'Ready to Make It Personal?',
    status: 'Final step',
    statusTone: 'navy',
    icon: Sprout,
    shortText: 'Complete the last part to turn this preview into your full result.',
    detail: 'This final part helps turn your preview into a more personal result. It is not an application, and no payment is required.',
    whyItMatters:
      'Age helps estimate possible ranges more realistically. Focus helps match your main goal. Budget comfort helps avoid options that do not fit your monthly comfort level.',
    nextStepHint: 'Age · Focus · Budget',
    isCta: true
  }];
};

const PreviewCarouselCard = ({ card, isActive, isFlipped, onToggle, onPersonalize, className = 'h-[23.5rem]' }) => {
  const Icon = card.icon;
  const tone = STATUS_TONES[card.statusTone] || STATUS_TONES.slate;
  const handleFaceKeyDown = (event) => {
    if (card.isCta) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
  };
  const handleBackClick = (event) => {
    if (card.isCta) return;

    if (event.target.closest('button')) return;

    onToggle();
  };

  return (
    <div className={`preview-card-shell ${className}`}>
      <div className={`preview-card-inner h-full ${isFlipped ? 'is-flipped' : ''}`}>
        <div
          role={card.isCta ? undefined : 'button'}
          className={`preview-card-face preview-card-slide flex h-full w-full flex-col rounded-3xl border ${tone.accent} ${tone.slide} p-5 text-left shadow-xl transition ${card.isCta ? '' : 'cursor-pointer'} ${
            isActive ? 'shadow-slate-900/20' : 'opacity-80'
          }`}
          onClick={card.isCta ? undefined : onToggle}
          onKeyDown={handleFaceKeyDown}
          aria-label={card.isCta ? undefined : `${card.title}. ${isFlipped ? 'Show preview' : 'View details'}`}
          aria-expanded={card.isCta ? undefined : isFlipped}
          tabIndex={card.isCta || isFlipped ? -1 : 0}
        >
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className={`preview-card-icon flex h-20 w-20 items-center justify-center rounded-3xl shadow-2xl ring-1 ${tone.iconWrap}`}>
              <Icon className="h-10 w-10" strokeWidth={2.2} aria-hidden="true" />
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ring-1 ${tone.badge}`}>{card.status}</span>
          </div>
          <div className="relative z-10 mt-9 flex-1">
            <h4 className={`text-3xl font-black leading-[1.02] tracking-tight ${tone.text}`}>{card.title}</h4>
            <p className={`mt-4 max-w-[16rem] text-sm font-semibold leading-relaxed ${tone.muted}`}>{card.shortText}</p>
            {card.answerPreview && (
              <div className={`mt-4 rounded-2xl p-3 ring-1 ${tone.softPanel}`}>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/60">Your answer on {card.answerTopic}</p>
                <p className={`mt-1 text-sm font-extrabold leading-snug ${tone.text}`}>{card.answerPreview}</p>
              </div>
            )}
          </div>
          <div className="relative z-10 mt-5 border-t border-white/15 pt-4">
            {card.isCta ? (
              <div className="space-y-3">
                <div className={`rounded-2xl px-4 py-3 text-center text-xs font-extrabold uppercase tracking-[0.18em] ring-1 ${tone.softPanel} ${tone.muted}`}>
                  {card.nextStepHint}
                </div>
                <button
                  type="button"
                  onClick={onPersonalize}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                >
                  Complete My Review
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <span className={`flex items-center justify-between text-xs font-extrabold ${tone.muted}`}>
                <span className="flex items-center gap-1.5">
                  <Info className="h-4 w-4" aria-hidden="true" />
                  Tap to reveal details
                </span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>

        <div
          role={card.isCta ? undefined : 'button'}
          className={`preview-card-face preview-card-back preview-card-slide flex h-full w-full flex-col rounded-3xl border ${tone.accent} ${tone.slide} p-5 text-left shadow-xl shadow-slate-900/20 ${card.isCta ? '' : 'cursor-pointer'}`}
          onClick={handleBackClick}
          onKeyDown={handleFaceKeyDown}
          tabIndex={!card.isCta && isFlipped ? 0 : -1}
          aria-label={card.isCta ? undefined : `Back to ${card.title} preview`}
          aria-hidden={!isFlipped}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className={`text-lg font-extrabold leading-tight ${tone.text}`}>{card.title}</h4>
              <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ring-1 ${tone.badge}`}>{card.status}</span>
            </div>
            <button
              type="button"
              onClick={onToggle}
              onKeyDown={(event) => event.stopPropagation()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              aria-label={`Back to ${card.title} preview`}
              tabIndex={isFlipped ? 0 : -1}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 space-y-4 overflow-y-auto pr-1">
            <p className={`text-sm font-semibold leading-relaxed ${tone.muted}`}>{card.detail}</p>
            <div className={`rounded-2xl p-4 ring-1 ${tone.softPanel}`}>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/60">Why it matters</p>
              <p className={`mt-1 text-sm font-semibold leading-relaxed ${tone.muted}`}>{card.whyItMatters}</p>
            </div>
            <div className={`rounded-xl p-3 ring-1 ${tone.softPanel}`}>
              <p className={`text-xs font-extrabold leading-relaxed ${tone.muted}`}>{card.nextStepHint}</p>
            </div>
          </div>

          {card.isCta && (
            <button
              type="button"
              onClick={onPersonalize}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              tabIndex={isFlipped ? 0 : -1}
            >
              Complete My Review
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const CopyIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <rect x="8" y="8" width="11" height="11" rx="2" strokeWidth={2.2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
  </svg>
);

const QuestionPulseIcon = () => (
  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-indigo-600 shadow-sm animate-pulse">
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9.5 9a2.5 2.5 0 1 1 4.2 1.84c-.98.83-1.7 1.39-1.7 2.66" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 17h.01" />
      <circle cx="12" cy="12" r="9" strokeWidth={2.2} />
    </svg>
  </div>
);

const AnalyzingScreen = ({ onComplete }) => {
  const [text, setText] = useState('Checking your cash flow layer...');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setText('Reviewing your foundation...'), 1000);
    const t2 = setTimeout(() => setText('Matching goals with next steps...'), 2200);
    const t3 = setTimeout(() => {
      setText('Your profile is ready.');
      setIsExiting(true);
    }, 3500);
    const t4 = setTimeout(() => onComplete(), 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div className={`h-full min-h-[100dvh] md:min-h-full flex flex-col justify-center items-center p-8 bg-slate-800 text-white text-center animate-fade-in relative overflow-hidden transition-opacity duration-300 ease-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
      <div className="relative z-10 mb-8">
        <div className="welcome-logo">
          <Compass className="h-10 w-10 text-white" strokeWidth={2.2} />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-3 tracking-tight">Preparing Your Foundation Map</h2>
      <p className="text-slate-300 font-medium animate-pulse-soft">{text}</p>
    </div>
  );
};

const DashboardScreen = ({ data, onTransitionToQuote, onResetJourney, onViewSubmitted, celebrationActive, scoreRevealed }) => {
  const [isNaturalCtaVisible, setIsNaturalCtaVisible] = useState(false);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [flippedCardId, setFlippedCardId] = useState(null);
  const dashboardScrollRef = useRef(null);
  const naturalCtaRef = useRef(null);
  const carouselRef = useRef(null);
  const previewCards = useMemo(() => buildPreviewCards(data, !scoreRevealed), [data, scoreRevealed]);
  const activeCard = previewCards[activeCarouselIndex] || previewCards[0];
  const transitionToPersonalization = () => onTransitionToQuote(data.cta);

  const scrollToCard = (index) => {
    const scrollElement = carouselRef.current;
    const cardCount = previewCards.length;
    const nextIndex = Math.max(0, Math.min(cardCount - 1, index));

    if (!scrollElement) {
      setActiveCarouselIndex(nextIndex);
      return;
    }

    const target = scrollElement.children[nextIndex];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    setActiveCarouselIndex(nextIndex);
    setFlippedCardId(null);
  };

  const handleCarouselScroll = () => {
    const scrollElement = carouselRef.current;

    if (!scrollElement) return;

    const cardWidth = scrollElement.firstElementChild?.getBoundingClientRect().width || 1;
    const gap = 12;
    const nextIndex = Math.round(scrollElement.scrollLeft / (cardWidth + gap));
    const boundedIndex = Math.max(0, Math.min(previewCards.length - 1, nextIndex));

    setActiveCarouselIndex((currentIndex) => {
      if (currentIndex !== boundedIndex) {
        setFlippedCardId(null);
      }

      return boundedIndex;
    });
  };

  const toggleCard = (card) => {
    if (activeCard?.id !== card.id) {
      return;
    }

    setFlippedCardId((currentId) => (currentId === card.id ? null : card.id));
  };

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

  useEffect(() => {
    setActiveCarouselIndex(0);
    setFlippedCardId(null);
  }, [previewCards.length]);

  if (!scoreRevealed) {
    const storyProgress = previewCards.length > 0 ? ((activeCarouselIndex + 1) / previewCards.length) * 100 : 0;

    return (
      <div className="h-full bg-slate-950 relative overflow-hidden text-white">
        <CelebrationOverlay
          active={celebrationActive}
          src={LOTTIE_URLS.foundationReveal}
          className="bg-slate-950/70 backdrop-blur-xl [&>div]:scale-125 [&>div]:opacity-100 [&>div]:drop-shadow-[0_28px_60px_rgba(255,255,255,0.28)]"
        />

        <div className="absolute inset-x-0 top-0 z-20 px-5 pt-[calc(env(safe-area-inset-top)+1rem)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/55">What We Noticed</p>
              <h1 className="mt-1 text-lg font-extrabold tracking-tight text-white">Your Profile Is Ready</h1>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold text-white/75 ring-1 ring-white/15">
              {activeCarouselIndex + 1} of {previewCards.length}
            </span>
          </div>

          <div className="mt-4 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${previewCards.length}, minmax(0, 1fr))` }}>
            {previewCards.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                onClick={() => scrollToCard(idx)}
                className="h-1.5 overflow-hidden rounded-full bg-white/18"
                aria-label={`Show preview card ${idx + 1} of ${previewCards.length}`}
                aria-current={idx === activeCarouselIndex ? 'true' : undefined}
              >
                <span
                  className={`block h-full rounded-full transition-all duration-300 ${idx === activeCarouselIndex ? 'bg-white' : idx < activeCarouselIndex ? 'bg-white/65' : 'bg-transparent'}`}
                  style={{ width: idx === activeCarouselIndex ? `${storyProgress > 0 ? 100 : 0}%` : '100%' }}
                />
              </button>
            ))}
          </div>
        </div>

        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="story-carousel hide-scrollbar flex h-full snap-x snap-mandatory gap-0 overflow-x-auto"
          role="region"
          aria-label="Initial analysis story carousel"
        >
          {previewCards.map((card, idx) => (
            <div key={card.id} className="flex h-full w-full shrink-0 snap-center px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-[calc(env(safe-area-inset-top)+6.6rem)]">
              <PreviewCarouselCard
                card={card}
                isActive={activeCarouselIndex === idx}
                isFlipped={flippedCardId === card.id}
                onToggle={() => toggleCard(card)}
                onPersonalize={transitionToPersonalization}
                className="h-full min-h-[31rem] w-full"
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between px-3">
          <button
            type="button"
            onClick={() => scrollToCard(activeCarouselIndex - 1)}
            disabled={activeCarouselIndex === 0}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15 disabled:opacity-30"
            aria-label="Show previous preview card"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollToCard(activeCarouselIndex + 1)}
            disabled={activeCarouselIndex === previewCards.length - 1}
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15 disabled:opacity-30"
            aria-label="Show next preview card"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 h-full relative overflow-hidden">
      <CelebrationOverlay active={celebrationActive} src={LOTTIE_URLS.foundationReveal} className="bg-white/30 backdrop-blur-[2px]" />
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
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-6">
            {scoreRevealed ? 'Your Financial Foundation Map' : 'What We Noticed'}
          </h2>

        <div className="relative mx-auto w-40 h-40 mb-6">
          <div className="absolute inset-0 flex items-center justify-center">
            {scoreRevealed ? <ScoreRing score={data.score} colorClass={data.scoreColor} /> : <InitialEstimateScorePlaceholder />}
          </div>
          <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-slate-50 z-20 transform translate-x-2 -translate-y-2">
            {scoreRevealed ? <span className="text-2xl">{data.persona.emoji}</span> : <UserRoundCog className="h-6 w-6 text-indigo-600" strokeWidth={2.2} aria-hidden="true" />}
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">
          {scoreRevealed ? data.persona.title : 'Your Profile Is Ready'}
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-[300px] mx-auto font-medium">
          {scoreRevealed
            ? data.persona.subtitle
            : 'We’ve reviewed your answers and found a few areas worth looking at.'}
        </p>
      </div>

        <div className="px-5 mt-6 mb-8 pb-[calc(env(safe-area-inset-bottom)+7.5rem)] space-y-4">
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Quick Preview</h3>
            {!scoreRevealed && <p className="mt-1 text-xs font-medium text-slate-400">Swipe to preview. Tap a card for details.</p>}
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            {activeCarouselIndex + 1} of {previewCards.length}
          </span>
        </div>

        <div className="-mx-5">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="preview-carousel hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 pt-2"
            role="region"
            aria-label="Quick layer preview carousel"
          >
            {previewCards.map((card, idx) => (
              <div key={card.id} className="w-[84%] max-w-[22rem] shrink-0 snap-center">
                <PreviewCarouselCard
                  card={card}
                  isActive={activeCarouselIndex === idx}
                  isFlipped={flippedCardId === card.id}
                  onToggle={() => toggleCard(card)}
                  onPersonalize={transitionToPersonalization}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => scrollToCard(activeCarouselIndex - 1)}
            disabled={activeCarouselIndex === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:opacity-35"
            aria-label="Show previous preview card"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-1.5" aria-label="Carousel position">
            {previewCards.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                onClick={() => scrollToCard(idx)}
                className={`h-2 rounded-full transition-all ${idx === activeCarouselIndex ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-300'}`}
                aria-label={`Show preview card ${idx + 1} of ${previewCards.length}`}
                aria-current={idx === activeCarouselIndex ? 'true' : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollToCard(activeCarouselIndex + 1)}
            disabled={activeCarouselIndex === previewCards.length - 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:opacity-35"
            aria-label="Show next preview card"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

          <div ref={naturalCtaRef} className="bg-slate-800 rounded-[1.5rem] p-6 shadow-md text-white mt-8 relative overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
              {scoreRevealed ? '📩' : <SlidersHorizontal className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />}
            </span>
            <h3 className="text-lg font-bold mb-2 tracking-tight">
              {scoreRevealed ? 'Your personalized roadmap is ready.' : 'Ready to make it personal?'}
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed font-medium">
              {scoreRevealed
                ? 'You can revisit the submitted roadmap summary anytime from here.'
                : 'Complete the last part to turn this preview into your full result.'}
            </p>

            <Button
              onClick={() => (scoreRevealed ? onViewSubmitted() : transitionToPersonalization())}
              variant="emerald"
              className="mb-3 !rounded-xl border border-emerald-200/70 !bg-emerald-500 text-white !shadow-lg !shadow-emerald-500/20 hover:!bg-emerald-600"
            >
                {scoreRevealed ? 'View Sent Roadmap' : (
                  <>
                    <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                    Complete My Review
                  </>
                )}
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
            <Button
              onClick={() => (scoreRevealed ? onViewSubmitted() : transitionToPersonalization())}
              variant="emerald"
              className="!rounded-xl border border-emerald-200/70 !bg-emerald-500 text-white !shadow-lg !shadow-emerald-500/20 hover:!bg-emerald-600"
            >
              {scoreRevealed ? 'View Sent Roadmap' : (
                <>
                  <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                  Complete My Review
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [agentSlug] = useState(getInitialAgentSlug);
  const [agentConfig, setAgentConfig] = useState(DEFAULT_AGENT_CONFIG);
  const [agentStatus, setAgentStatus] = useState('loading');
  const [agentError, setAgentError] = useState('');
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
  const [hasSubmittedLead, setHasSubmittedLead] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
    let isMounted = true;

    const loadAgentConfig = async () => {
      try {
        const endpoint = agentSlug ? `/api/agents/${encodeURIComponent(agentSlug)}` : '/api/default-agent';
        const response = await fetch(endpoint);
        const body = await response.json().catch(() => null);

        if (!agentSlug && response.status === 404 && body?.defaultConfigured === false) {
          if (isMounted) {
            setAgentConfig(DEFAULT_AGENT_CONFIG);
            setAgentStatus('ready');
            setAgentError('');
          }
          return;
        }

        if (!response.ok || !body?.agent) {
          throw new Error(body?.error || 'This assessment link is unavailable.');
        }

        if (isMounted) {
          setAgentConfig({ ...DEFAULT_AGENT_CONFIG, ...body.agent });
          setAgentStatus('ready');
          setAgentError('');
        }
      } catch (error) {
        if (isMounted) {
          setAgentStatus('unavailable');
          setAgentError(error.message || 'This assessment link is unavailable.');
        }
      }
    };

    loadAgentConfig();

    return () => {
      isMounted = false;
    };
  }, [agentSlug]);

  useEffect(() => {
    document.title = agentConfig.toolName || DEFAULT_AGENT_CONFIG.toolName;
  }, [agentConfig.toolName]);

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
    setHasSubmittedLead(false);
    setIsCopied(false);
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

  const calculateFoundationData = useMemo(() => {
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
      title: 'Building Your Starting Point',
      emoji: '🧱',
      subtitle: 'You have a starting point, with a few areas that could be stronger.'
    };

    let scoreColor = 'stroke-amber-400';

    if (score >= 80) {
      persona = {
        title: 'Looking Stable',
        emoji: '🏰',
        subtitle: 'Looking good. Your foundation looks well-rounded and stable.'
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
    const pressurePoints = [];
    const emergencyAnswerText =
      {
        1: 'Less than 1 month',
        2: '1 to 3 months',
        3: '3 to 6 months',
        4: 'More than 6 months'
      }[answers.emergencyFund] || 'Not provided';
    const protectionLabels = {
      hmo: 'Company HMO / Health Card',
      health_ins: 'Personal Health Insurance',
      life_ins: 'Life Insurance',
      critical: 'Critical Illness Coverage',
      none: 'None yet'
    };
    const dependentLabels = {
      kids: 'Children',
      spouse: 'Spouse/Partner',
      parents: 'Parents/Siblings',
      none: 'No one right now'
    };
    const selectedProtectionText = answers.protection.length
      ? answers.protection.map((item) => protectionLabels[item] || item).join(', ')
      : 'Not provided';
    const selectedDependentsText = answers.dependents.length
      ? answers.dependents.map((item) => dependentLabels[item] || item).join(', ')
      : 'Not provided';

    if (answers.emergencyFund < 3) {
      pressurePoints.push({
        title: 'Emergency Fund',
        status: 'Getting There',
        desc: 'Your savings are starting to build, but a surprise expense could affect your current cash flow.',
        shortText: 'Your cash buffer may need more room for surprise expenses.',
        answerPreview: emergencyAnswerText,
        answerTopic: 'emergency savings',
        detail:
          'Your answers suggest your emergency fund may still be in progress. This does not mean you are behind; it simply means this area may be worth reviewing before building your options.',
        whyItMatters: 'A cash buffer can protect monthly bills, savings goals, and everyday routines when unexpected costs show up.'
      });
    } else {
      pressurePoints.push({
        title: 'Emergency Fund',
        status: 'Looking Stable',
        desc: 'Your rainy day fund is strong enough to handle short-term income pauses gracefully.',
        shortText: 'Your emergency fund looks like a helpful first layer.',
        answerPreview: emergencyAnswerText,
        answerTopic: 'emergency savings',
        detail:
          'Your answers suggest you have a practical cash buffer in place. The next step is making sure the rest of your foundation fits around it.',
        whyItMatters: 'A stable emergency fund can reduce the need to borrow or interrupt long-term plans.'
      });
    }

    if (!answers.protection.includes('health_ins') && !answers.protection.includes('critical') && !answers.protection.includes('hmo')) {
      pressurePoints.push({
        title: 'Health Costs',
        status: 'Worth Reviewing',
        desc: 'A major medical expense could affect savings meant for other goals. A health plan can add a useful layer.',
        shortText: 'This area may have a high impact on your finances.',
        answerPreview: selectedProtectionText,
        answerTopic: 'health and protection coverage',
        detail:
          'Your answers suggest limited protection for health-related costs. This does not mean something is wrong; it simply means this area may need a closer look before building your options.',
        whyItMatters: 'Medical costs can affect savings, monthly cash flow, and family plans.'
      });
    } else {
      pressurePoints.push({
        title: 'Health Costs',
        status: 'Getting There',
        desc: 'You have health coverage in place to help support your savings if medical costs come up.',
        shortText: 'You already have a health-related protection layer.',
        answerPreview: selectedProtectionText,
        answerTopic: 'health and protection coverage',
        detail:
          'Your answers show some health coverage is already in place. The final review step helps check whether your options should focus on strengthening, balancing, or maintaining this layer.',
        whyItMatters: 'Health protection can help preserve savings and keep family plans steadier during medical events.'
      });
    }

    if (hasDeps && !answers.protection.includes('life_ins')) {
      pressurePoints.push({
        title: 'Family Support',
        status: 'Worth Reviewing',
        desc: 'People may rely on your income. A backup plan can help support them if income is interrupted.',
        shortText: 'Your income may support people beyond yourself.',
        answerPreview: selectedDependentsText,
        answerTopic: 'family support',
        detail:
          'Your answers suggest others may rely on your income, while a family backup layer may still need review. This is simply a planning signal, not a judgment.',
        whyItMatters: 'A backup plan helps protect family expenses, education plans, and essential bills if income is interrupted.'
      });
    }

    let cta = {};

    if (hasDeps && !answers.protection.includes('life_ins')) {
      cta = {
        headline: 'Your family support plan is worth reviewing.',
        hook: 'You work hard for your family. Reviewing a backup plan can help keep their needs in view.',
        buttonText: 'Complete My Review',
        wizardHeadline: "Let's complete your review.",
        icon: '🧭'
      };
    } else if (protCount === 0) {
      cta = {
        headline: 'Build your first foundation layer.',
        hook: "Your savings help with today, and a basic protection plan may help support your next step. Let's review beginner-friendly options.",
        buttonText: 'Complete My Review',
        wizardHeadline: "Let's complete your review.",
        icon: '🌱'
      };
    } else if (answers.priorities.includes('invest') && score < 60) {
      cta = {
        headline: 'Review your foundation before you grow.',
        hook: 'Your investment goals may feel easier to plan when your basic foundation is clear. Let\'s review your balance.',
        buttonText: 'Complete My Review',
        wizardHeadline: "Let's complete your review.",
        icon: '📈'
      };
    } else {
      cta = {
        headline: 'Keep building your momentum.',
        hook: 'Let\'s review a personalized starting point that connects your current setup with your future goals.',
        buttonText: 'Complete My Review',
        wizardHeadline: "Let's complete your review.",
        icon: '🧭'
      };
    }

    return { score, breakdown, persona, scoreColor, pressurePoints, cta };
  }, [answers]);

  const renderWelcome = () => (
    <div className="screen-mesh h-full flex flex-col justify-center items-center p-8 text-center animate-fade-in relative z-10 overflow-hidden">
      <WelcomeMapGraphic />
      <div className="welcome-logo mb-8">
        <Compass className="h-10 w-10 text-white" strokeWidth={2.2} />
      </div>
      <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-600">{agentConfig.toolName}</p>
      <h1 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight leading-tight">
        {agentConfig.headline}
      </h1>
      <p className="text-slate-500 mb-10 leading-relaxed max-w-xs mx-auto font-medium">
        {agentConfig.subheadline}
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

    return (
      <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
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
                Good start! Your profile shows you&apos;re already thinking ahead. Complete the remaining sections to view your full Financial Foundation.
              </p>
            </div>
          )}

          {JOURNEY_MODULES.map((mod, idx) => {
            const isComplete = completedModules.includes(mod.id);
            const isNext = !isComplete && (idx === 0 || completedModules.includes(JOURNEY_MODULES[idx - 1].id));
            const isUnavailable = !isComplete && !isNext;
            const isRecentCompletion = completionFx.active && completionFx.moduleId === mod.id;
            const shouldPlayCheckAnimation = isComplete && !playedCheckAnimation[mod.id];

            return (
              <div
                key={mod.id}
                ref={isNext ? nextModuleRef : null}
                onClick={() => {
                  if (!isUnavailable && !isComplete) {
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
                {isUnavailable && (
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
                See Where I Stand
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
    const lifeStageCards = [
      {
        id: '20s-30s',
        title: 'Building Foundations',
        subLabel: '20s to 30s',
        accentClass: 'text-emerald-500',
        titleClass: 'text-emerald-700',
        iconWrapClass: 'bg-emerald-50 ring-1 ring-emerald-100',
        animationClass: 'age-stage-float',
        Icon: KeyRound
      },
      {
        id: '30s-40s',
        title: 'Growth & Family',
        subLabel: '30s to 40s',
        accentClass: 'text-indigo-500',
        titleClass: 'text-indigo-700',
        iconWrapClass: 'bg-indigo-50 ring-1 ring-indigo-100',
        animationClass: 'age-stage-pulse',
        Icon: Home,
        SupportIcon: UsersRound
      },
      {
        id: '50s-above',
        title: 'Stability & Legacy',
        subLabel: '50s +',
        accentClass: 'text-rose-500',
        titleClass: 'text-rose-700',
        iconWrapClass: 'bg-rose-50 ring-1 ring-rose-100',
        animationClass: 'age-stage-tilt',
        Icon: Shield
      }
    ];
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
    const currentAge = clampAge(quoteData.age);
    const ageDigitColorClass = currentAge >= 50 ? 'text-rose-500' : currentAge >= 40 ? 'text-indigo-500' : 'text-emerald-500';
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quoteData.email.trim());

    const submitLead = async (consentGranted = quoteData.consent) => {
      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      const normalizedAge = clampAge(quoteData.age);
      const birthYear = new Date().getFullYear() - normalizedAge;

      const payload = {
        agentSlug: agentConfig.slug || agentSlug || null,
        submittedAt: new Date().toISOString(),
        currentScreen: screen,
        completedModules,
        activeModuleId,
        answers,
        quoteData: {
          ...quoteData,
          consent: consentGranted,
          age: normalizedAge,
          birthYear
        },
        quoteIntent,
        scoreData: calculateFoundationData,
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

        setHasSubmittedLead(true);
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
        return isEmailValid;
      }

      return false;
    };
    const handleSlideSubmit = () => {
      if (!isEmailValid || isSubmitting) {
        return;
      }

      setQuoteData((prev) => ({ ...prev, consent: true }));
      submitLead(true);
    };

    return (
      <div className="h-full flex flex-col bg-slate-50 animate-slide-up relative">
        <div className="pt-8 px-6 pb-6 shrink-0 bg-white rounded-b-[2rem] shadow-sm relative z-10 border-b border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <button onClick={prevStep} className="text-slate-400 hover:text-slate-600 font-medium text-sm flex items-center gap-1">
              ← Back
            </button>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Personalization</span>
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
              <style>
                {`
                  @keyframes age-stage-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-7px); }
                  }

                  @keyframes age-stage-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                  }

                  @keyframes age-stage-tilt {
                    0%, 100% { transform: perspective(420px) rotateY(-12deg); }
                    50% { transform: perspective(420px) rotateY(12deg); }
                  }

                  .age-stage-float {
                    animation: age-stage-float 3s ease-in-out infinite;
                  }

                  .age-stage-pulse {
                    animation: age-stage-pulse 4s ease-in-out infinite;
                  }

                  .age-stage-tilt {
                    animation: age-stage-tilt 4.5s ease-in-out infinite;
                    transform-style: preserve-3d;
                  }
                `}
              </style>
              <h2 className="text-slate-900 font-extrabold text-2xl mb-2">What chapter of life are you in?</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Protection plans look a lot different in your 20s versus your 40s. Knowing your age helps us pull together a roadmap that makes sense for where you are right now.
              </p>
              <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-sm">
                <label className="mb-4 block text-center text-xs font-bold uppercase tracking-wider text-slate-400">Your Age</label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    aria-label="Decrease age"
                    onPointerDown={() => startAgeHold('decrement')}
                    onPointerUp={stopAgeHold}
                    onPointerLeave={stopAgeHold}
                    onPointerCancel={stopAgeHold}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-3xl font-black text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95 focus:outline-none"
                  >
                    -
                  </button>
                  <div className="min-w-[7rem] rounded-[1.25rem] bg-slate-50 px-5 py-3 text-center ring-1 ring-slate-100">
                    <div className={`text-5xl font-black tracking-tight transition-colors duration-200 ${ageDigitColorClass}`}>{quoteData.age}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">years old</div>
                  </div>
                  <button
                    type="button"
                    aria-label="Increase age"
                    onPointerDown={() => startAgeHold('increment')}
                    onPointerUp={stopAgeHold}
                    onPointerLeave={stopAgeHold}
                    onPointerCancel={stopAgeHold}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-3xl font-black text-white shadow-md shadow-slate-300/70 transition hover:bg-slate-800 active:scale-95 focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 mt-3 mb-7">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                Kept safe and completely private.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {lifeStageCards.map(({ id, title, subLabel, accentClass, titleClass, iconWrapClass, animationClass, Icon, SupportIcon }) => (
                  <div key={id} className="bg-white/90 border border-slate-100 rounded-xl p-5 flex flex-col items-center text-center shadow-sm opacity-95">
                    <div className={`relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${iconWrapClass}`}>
                      <Icon className={`h-8 w-8 ${accentClass} ${animationClass}`} aria-hidden="true" />
                      {SupportIcon && (
                        <span className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-50 shadow-sm">
                          <SupportIcon className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                        </span>
                      )}
                    </div>
                    <h3 className={`text-sm font-extrabold leading-tight ${titleClass}`}>{title}</h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{subLabel}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {quoteStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-extrabold text-slate-800 mb-2">What matters most right now?</h2>
              <p className="text-slate-500 text-sm mb-6 font-medium">You don't have to tackle everything at once. Focus on what feels most important to you.</p>
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
              <h2 className="text-xl font-extrabold text-slate-800 mb-2">What feels doable right now?</h2>
              <p className="text-slate-500 text-sm mb-6 font-medium">
                If you decided to start setting aside some cash each month just for this, what amount wouldn't hurt your daily budget?
              </p>
              <div className="space-y-4">
                {[
                  {
                    id: '<1500',
                    title: 'Simple Start',
                    label: 'Below ₱1,500 / month',
                    daily: '~₱50/day',
                    dailyBadgeColor: 'bg-gray-100 text-light-gray-800',
                    desc: 'Perfect if you want to start building a safety net without feeling it in your wallet.',
                    support: 'Usually covers basic health emergencies or simple peace-of-mind protection.',
                    badge: null
                  },
                  {
                    id: '1500-3000',
                    title: 'The Sweet Spot',
                    label: '₱1,500 – ₱3,000 / month',
                    daily: '~₱50-₱100/day',
                    dailyBadgeColor: 'bg-indigo-100 text-indigo-800',
                    desc: 'A comfortable middle ground. Solid coverage that still leaves room for daily life.',
                    support: 'Great for a mix of health cover, family protection, and starting a little nest egg.',
                    badge: 'Most practical starting point',
                    badgeColor: 'bg-indigo-100 text-indigo-700'
                  },
                  {
                    id: '3000-5000',
                    title: 'Stronger Shield',
                    label: '₱3,000 – ₱5,000 / month',
                    daily: '~₱100-₱160/day',
                    dailyBadgeColor: 'bg-emerald-100 text-emerald-800',
                    desc: 'For when you have more people relying on you and want fewer things to worry about.',
                    support: 'Unlocks better health benefits, stronger family protection, and faster savings growth.',
                    badge: 'More flexibility',
                    badgeColor: 'bg-emerald-100 text-emerald-700'
                  },
                  {
                    id: '5000+',
                    title: 'Wealth Builder',
                    label: '₱5,000+ / month',
                    daily: '₱160+/day',
                    dailyBadgeColor: 'bg-amber-100 text-amber-800',
                    desc: 'For serious long-term goals. Protects you now while actively growing your money for later.',
                    support: "Ideal for things like your kids’ college fund, retirement, or major life upgrades.",
                    badge: 'Long-term focused',
                    badgeColor: 'bg-amber-100 text-amber-700'
                  },
                  {
                    id: 'unsure',
                    title: "I’m Not Sure Yet",
                    label: 'Help me decide',
                    daily: null,
                    desc: "No worries. Let’s look at your answers and suggest a number that won’t stress you out.",
                    support: "We’ll do the math together. Zero pressure.",
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
                        {opt.daily && <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${opt.dailyBadgeColor}`}>{opt.daily}</span>}
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
              <p className="mt-3 text-xs text-red-800 text-slate-400 font-bold text-center">Zero payment required. No commitment.</p>
            </div>
          )}

          {quoteStep === 4 && (
            <div className="animate-fade-in">
              <div className="mb-5 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-indigo-500 shadow-sm">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3.75 6.75h16.5v10.5H3.75z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="m4.5 7.5 7.5 5.25 7.5-5.25" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15.75 12.75 20.25 17.25M8.25 12.75 3.75 17.25" />
                  </svg>
                </div>
              </div>
              <h2 className="text-slate-900 font-extrabold text-2xl mb-2">Where to send your results?</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
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
                  <p className="mt-2 flex items-center gap-2 text-slate-500 text-sm leading-relaxed mb-8">
                    <MessageCircle className="h-4 w-4 shrink-0 text-indigo-500" aria-hidden="true" />
                    We will send SMS confirming the result has arrived.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="juandelacruz@gmail.com"
                    value={quoteData.email}
                    onChange={(e) => updateQuote('email', e.target.value)}
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-slate-800 focus:outline-none font-medium text-slate-700 shadow-sm"
                  />
                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-700 font-medium leading-relaxed">
                    <Shield className="h-4 w-4 fill-emerald-100 text-emerald-500" aria-hidden="true" />
                    Your details are kept strictly private and secure.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-6">Transparency First</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    By sliding to unlock, you grant us permission to send a detailed, customized assessment based directly on your inputs.
                  </p>
                </div>
                <SlideToSubmit disabled={!isEmailValid} isSubmitting={isSubmitting} onSubmit={handleSlideSubmit} />
              </div>
            </div>
          )}
        </div>

        {quoteStep < 4 && (
          <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-20">
            <Button disabled={!canProceed() || isSubmitting} onClick={nextStep} variant="emerald">
              Continue
            </Button>
          </div>
        )}
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
    const scoreData = calculateFoundationData;
    const budgetText = getBudgetText(quoteData.budget);
    const breakdownItems = [
      { label: 'Cash Flow & Income', value: scoreData.breakdown.cashflow, max: 25 },
      { label: 'Emergency Safety Net', value: scoreData.breakdown.emergency, max: 20 },
      { label: 'Protection Coverage', value: scoreData.breakdown.protection, max: 30 },
      { label: 'Goals & Direction', value: scoreData.breakdown.goals, max: 25 }
    ];
    const handleCopyShare = async () => {
      const shareText =
        "Just used this free tool to check my financial starting point. It takes a few minutes and doesn't ask for exact income: https://assess.lablibre.com";

      try {
        await navigator.clipboard.writeText(shareText);
        setIsCopied(true);
        const copyTimerId = window.setTimeout(() => {
          timersRef.current = timersRef.current.filter((timerId) => timerId !== copyTimerId);
          setIsCopied(false);
        }, 2000);
        timersRef.current.push(copyTimerId);
      } catch {
        alert('Unable to copy the share text right now. Please try again.');
      }
    };

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
          <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Your score is {scoreData.score}/100</h2>
          <p className="text-slate-300 text-sm font-medium leading-relaxed max-w-[300px] mx-auto">
            Personalization complete. Your roadmap for {budgetText} is being prepared, and we will send the next steps directly to your email.
          </p>
          <p className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-xs font-bold leading-relaxed text-emerald-100">
            Please note: Reviewing your options requires absolutely no commitment or payment.
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

          <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-5 block">How it was calculated</span>
            <div className="space-y-3">
              {breakdownItems.map((item) => {
                const percent = (item.value / item.max) * 100;

                return (
                  <div key={item.label}>
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
          </div>

          <div className="bg-slate-100/50 rounded-[1.5rem] p-6 border border-slate-200/50 text-center">
            <QuestionPulseIcon />
            <h3 className="font-bold text-slate-800 mb-2 text-sm">What happens next?</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-0 font-medium">
              We&apos;ll send your detailed profile assessment by email and may follow up with guidance that matches your results and selected budget. Feel free to ask questions with absolutely zero commitment.
            </p>
          </div>

          <div className="pt-2 space-y-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button onClick={() => setScreen('dashboard')} variant="primary" className="py-3.5">
              Back to My Foundation Map
            </Button>
            <button
              type="button"
              onClick={handleCopyShare}
              className={`w-full py-3.5 px-6 rounded-2xl border-2 font-bold transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
                isCopied
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-white border-slate-300 text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              {isCopied ? (
                'Link Copied! ✅'
              ) : (
                <>
                  <CopyIcon />
                  <span>Share the Tool</span>
                </>
              )}
            </button>
            <Button onClick={restartJourney} variant="secondary" className="py-3.5">
              Start Over
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderAgentStatusScreen = ({ title, message }) => (
    <div className="screen-mesh h-full flex flex-col justify-center items-center p-8 text-center animate-fade-in relative z-10 overflow-hidden">
      <div className="welcome-logo mb-8">
        <Lock className="h-10 w-10 text-white" strokeWidth={2.2} />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-800 mb-4 tracking-tight leading-tight">{title}</h1>
      <p className="text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">{message}</p>
    </div>
  );

  if (agentStatus === 'loading') {
    return (
      <div className="app-shell w-full md:max-w-md md:h-[850px] md:min-h-0 md:max-h-[95vh] relative md:rounded-[2.5rem] md:shadow-2xl overflow-hidden flex flex-col md:border-[8px] md:border-slate-800 bg-white">
        {renderAgentStatusScreen({
          title: 'Loading Assessment',
          message: 'Preparing this advisor link now.'
        })}
      </div>
    );
  }

  if (agentStatus === 'unavailable') {
    return (
      <div className="app-shell w-full md:max-w-md md:h-[850px] md:min-h-0 md:max-h-[95vh] relative md:rounded-[2.5rem] md:shadow-2xl overflow-hidden flex flex-col md:border-[8px] md:border-slate-800 bg-white">
        {renderAgentStatusScreen({
          title: 'Assessment Link Unavailable',
          message: agentError || 'This advisor link is not active right now.'
        })}
      </div>
    );
  }

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
            data={calculateFoundationData}
            onTransitionToQuote={handleTransitionToQuote}
            onResetJourney={restartJourney}
            onViewSubmitted={() => setScreen('quote_teaser')}
            celebrationActive={dashboardCelebration}
            scoreRevealed={hasSubmittedLead}
          />
        )}
        {screen === 'quote_form' && renderQuoteForm()}
        {screen === 'quote_teaser' && renderQuoteTeaser()}
      </div>
    </div>
  );
}

export default App;
