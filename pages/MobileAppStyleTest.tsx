import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Code2,
  Cpu,
  Flame,
  Home,
  Menu,
  MessageCircle,
  Printer,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import { SEO } from '../components/SEO';

type Screen = {
  id: string;
  appTitle: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  theme: string;
  dark?: boolean;
  art: React.ReactNode;
};

const images = {
  hero: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200',
  robotics: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=900',
  coding: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=900',
  maker: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=900',
  detail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
};

const palette = [
  { name: 'Orange', value: 'bg-brand-orange' },
  { name: 'Blue', value: 'bg-brand-blue' },
  { name: 'Green', value: 'bg-brand-green' },
  { name: 'Red', value: 'bg-brand-red' },
  { name: 'Yellow', value: 'bg-[#ffc938]' },
];

const programs = [
  {
    title: 'Smart City Rover',
    category: 'Robotique',
    age: '10-14',
    duration: '3h',
    price: '400 DHS',
    image: images.robotics,
    icon: Bot,
    color: 'bg-brand-orange',
    accent: 'text-brand-orange',
    outcome: 'Working rover',
  },
  {
    title: 'Game Creator',
    category: 'Coding & IA',
    age: '11-17',
    duration: '3h',
    price: '400 DHS',
    image: images.coding,
    icon: Code2,
    color: 'bg-brand-blue',
    accent: 'text-brand-blue',
    outcome: 'Playable game',
  },
  {
    title: '3D Product Lab',
    category: 'Design 3D',
    age: '8-16',
    duration: '3h',
    price: '400 DHS',
    image: images.maker,
    icon: Printer,
    color: 'bg-brand-green',
    accent: 'text-brand-green',
    outcome: 'Printed object',
  },
];

const PhoneTop: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <div className={`flex items-center justify-between text-[10px] font-black ${dark ? 'text-white' : 'text-[#111]'}`}>
    <span>12:30</span>
    <div className={`h-5 w-16 rounded-full ${dark ? 'bg-white' : 'bg-black'}`} />
    <div className="flex items-center gap-1">
      <span className={`h-2 w-3 rounded-sm ${dark ? 'bg-white' : 'bg-black'}`} />
      <span className={`h-2 w-2 rounded-full ${dark ? 'bg-white' : 'bg-black'}`} />
    </div>
  </div>
);

const BrandMark: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <div className="flex items-center gap-2">
    <img src="/logo-icon.png" alt="MakerLab" className="h-7 w-7 object-contain" />
    <div className="leading-none">
      <p className={`font-display text-sm font-black ${dark ? 'text-white' : 'text-[#111]'}`}>
        MAKER<span className="text-brand-orange">LAB</span>
      </p>
      <p className={`text-[8px] font-bold tracking-[0.28em] ${dark ? 'text-white/60' : 'text-[#111]/45'}`}>
        ACADEMY
      </p>
    </div>
  </div>
);

const AppHeader: React.FC<{ title: string; dark?: boolean }> = ({ title, dark = false }) => (
  <div className="mt-7 flex items-center justify-between">
    <BrandMark dark={dark} />
    <div className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] ${dark ? 'bg-white/15 text-white' : 'bg-black/5 text-[#111]'}`}>
      {title}
    </div>
    <button className={`flex h-10 w-10 items-center justify-center rounded-full ${dark ? 'bg-white/15 text-white' : 'bg-black/5 text-[#111]'}`} aria-label="Menu">
      <Menu size={19} />
    </button>
  </div>
);

const BottomNav: React.FC<{ active: 'home' | 'programs' | 'detail' | 'book' }> = ({ active }) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'programs', label: 'Programs', icon: Cpu },
    { id: 'detail', label: 'Details', icon: Sparkles },
    { id: 'book', label: 'Book', icon: CalendarDays },
  ] as const;

  return (
    <div className="mt-5 grid grid-cols-4 rounded-3xl bg-white/95 p-2 text-[10px] font-black shadow-lg">
      {items.map(item => (
        <div key={item.id} className={`flex flex-col items-center gap-1 rounded-2xl py-2 ${active === item.id ? 'bg-[#111] text-white' : 'text-slate-400'}`}>
          <item.icon size={16} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const screens: Screen[] = [
  {
    id: 'home',
    appTitle: 'Home',
    eyebrow: 'Mobile homepage',
    title: 'Build real tech. Not just watch demos.',
    text: 'A parent-friendly first screen with real workshop imagery, strong brand colors, and one clear mission CTA.',
    cta: 'Find a mission',
    theme: 'bg-[#111] text-white',
    dark: true,
    art: (
      <div className="mt-7">
        <div className="relative h-[300px] overflow-hidden rounded-[2rem] bg-brand-orange shadow-2xl">
          <img src={images.hero} alt="Student building technology" className="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/20 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black text-[#111]">Casablanca</div>
          <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg">
            <Flame size={20} fill="currentColor" />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="mb-3 flex gap-2">
              {palette.slice(0, 4).map(color => <span key={color.name} className={`h-3 w-8 rounded-full ${color.value}`} />)}
            </div>
            <p className="text-3xl font-black leading-none">3 hours. 1 mission. Real project.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ['500+', 'makers'],
            ['10', 'max/group'],
            ['4.9', 'parent rating'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-white/10 p-3 text-center">
              <p className="text-lg font-black leading-none">{value}</p>
              <p className="mt-1 text-[10px] font-bold text-white/55">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-3xl bg-white p-3 text-[#111] shadow-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green text-white">
            <ShieldCheck size={21} />
          </div>
          <div>
            <p className="font-black leading-tight">Materials included</p>
            <p className="text-xs font-semibold text-slate-500">No setup. Just arrive and build.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'programs',
    appTitle: 'Programs',
    eyebrow: 'Program page',
    title: 'A swipeable catalog parents understand fast.',
    text: 'Real images, color-coded topics, age, duration and price are visible without opening every card.',
    cta: 'View program',
    theme: 'bg-[#f7f7f4] text-[#111]',
    art: (
      <div className="mt-7">
        <div className="mb-4 flex gap-2 overflow-hidden">
          {['All', 'Robotique', 'Coding', '3D'].map((chip, index) => (
            <span key={chip} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${index === 0 ? 'bg-[#111] text-white' : 'bg-white text-slate-500'}`}>
              {chip}
            </span>
          ))}
        </div>
        <div className="space-y-3">
          {programs.map(program => (
            <article key={program.title} className="overflow-hidden rounded-[1.75rem] bg-white shadow-lg">
              <div className="relative h-32">
                <img src={program.image} alt={program.title} className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-[#111]">{program.category}</div>
                <div className="absolute bottom-3 right-3 rounded-full bg-[#111] px-3 py-1 text-[10px] font-black text-white">{program.price}</div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-black leading-tight">{program.title}</p>
                    <p className="mt-1 text-xs font-bold text-slate-400">Ages {program.age} - {program.duration} - {program.price}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${program.color} text-white`}>
                    <program.icon size={18} />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-black">
                  <div className="rounded-2xl bg-slate-100 px-2 py-2">Age {program.age}</div>
                  <div className="rounded-2xl bg-slate-100 px-2 py-2">{program.duration}</div>
                  <div className={`rounded-2xl bg-slate-100 px-2 py-2 ${program.accent}`}>{program.outcome}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'detail',
    appTitle: 'Details',
    eyebrow: 'Program detail page',
    title: 'Details feel like an app card, not a brochure.',
    text: 'The parent sees the project, what the child builds, what is included, and the booking CTA in one focused flow.',
    cta: 'Book trial workshop',
    theme: 'bg-white text-[#111]',
    art: (
      <div className="mt-7 overflow-hidden rounded-[2rem] bg-[#111] shadow-2xl">
        <div className="relative h-64">
          <img src={images.detail} alt="Electronics and robotics project" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
          <button className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111]">
            <ArrowLeft size={18} />
          </button>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="mb-2 flex items-center gap-1 text-brand-orange">
              {[0, 1, 2, 3, 4].map(item => <Star key={item} size={14} fill="currentColor" />)}
            </div>
            <p className="text-3xl font-black leading-none">Smart City Rover</p>
            <p className="mt-2 text-sm font-semibold text-white/70">Build a rover, connect sensors, test it on a city challenge.</p>
          </div>
        </div>
        <div className="space-y-3 bg-[#111] p-4 text-white">
          <div className="flex gap-2 text-xs font-black">
            {['Overview', 'Outcome', 'Schedule'].map((tab, index) => (
              <span key={tab} className={`rounded-full px-3 py-2 ${index === 0 ? 'bg-brand-orange text-white' : 'bg-white/10 text-white/60'}`}>{tab}</span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {['10-14 ans', '3h', '400 DHS'].map(item => (
              <div key={item} className="rounded-2xl bg-white/10 px-2 py-3 font-black">{item}</div>
            ))}
          </div>
          <div className="rounded-3xl bg-white p-4 text-[#111]">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.12em] text-brand-orange">What they build</p>
            {['A working rover', 'Micro:bit logic', 'Certificate + photos'].map(item => (
              <div key={item} className="mb-2 flex items-center gap-2 text-sm font-bold">
                <CheckCircle2 size={16} className="text-brand-green" /> {item}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-brand-blue p-4">
              <p className="text-2xl font-black">80%</p>
              <p className="text-xs font-bold text-white/70">hands-on practice</p>
            </div>
            <div className="rounded-3xl bg-brand-green p-4">
              <p className="text-2xl font-black">1</p>
              <p className="text-xs font-bold text-white/70">take-home project</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'booking',
    appTitle: 'Booking',
    eyebrow: 'Booking flow',
    title: 'Reserve with confidence.',
    text: 'A calm checkout step: date, group size, materials and WhatsApp support stay clear before commitment.',
    cta: 'Reserve now',
    theme: 'bg-brand-blue text-white',
    dark: true,
    art: (
      <div className="mt-7 space-y-3">
        {[
          { icon: CalendarDays, label: 'Next session', value: 'Saturday 10:00', color: 'bg-brand-orange' },
          { icon: Users, label: 'Small group', value: '10 kids maximum', color: 'bg-brand-green' },
          { icon: ShieldCheck, label: 'Materials', value: 'All included', color: 'bg-[#ffc938] text-[#111]' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-4 rounded-3xl bg-white p-4 text-[#111] shadow-xl">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} text-white`}>
              <item.icon size={22} />
            </div>
            <div>
              <p className="font-black">{item.label}</p>
              <p className="text-sm font-semibold text-slate-500">{item.value}</p>
            </div>
          </div>
        ))}
        <div className="rounded-3xl bg-[#111] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-green">
              <MessageCircle size={21} />
            </div>
            <div>
              <p className="font-black">Need help?</p>
              <p className="text-sm font-semibold text-white/60">Talk to us on WhatsApp.</p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] bg-white p-4 text-[#111] shadow-xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-black">Booking summary</p>
            <span className="rounded-full bg-brand-orange px-3 py-1 text-[10px] font-black text-white">Trial</span>
          </div>
          <div className="space-y-2 text-sm font-bold text-slate-600">
            <div className="flex justify-between"><span>Workshop</span><span className="text-[#111]">Smart City Rover</span></div>
            <div className="flex justify-between"><span>Total</span><span className="text-[#111]">400 DHS</span></div>
          </div>
        </div>
      </div>
    ),
  },
];

const PhoneScreen: React.FC<{ screen: Screen; compact?: boolean }> = ({ screen, compact = false }) => (
  <article className={`mx-auto flex min-h-[710px] w-full max-w-[360px] flex-col rounded-[2.5rem] p-5 shadow-2xl shadow-black/15 ring-8 ring-white/70 ${screen.theme}`}>
    <PhoneTop dark={screen.dark} />
    <AppHeader title={screen.appTitle} dark={screen.dark} />

    <div className="flex flex-1 flex-col">
      {screen.art}
      <div className={`${compact ? 'mt-7' : 'mt-auto'} pt-8`}>
        <p className={`mb-2 text-xs font-black uppercase tracking-[0.18em] ${screen.dark ? 'text-white/65' : 'text-brand-orange'}`}>
          {screen.eyebrow}
        </p>
        <h2 className="font-display text-[2.05rem] font-black leading-[0.98] tracking-tight">
          {screen.title}
        </h2>
        <p className={`mt-4 text-sm font-semibold leading-6 ${screen.dark ? 'text-white/75' : 'text-slate-500'}`}>
          {screen.text}
        </p>
      </div>
    </div>

    <div className="mt-6">
      <button className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black transition active:scale-[0.98] ${screen.dark ? 'bg-white text-[#111]' : 'bg-[#111] text-white'}`}>
        {screen.cta} <ArrowRight size={17} />
      </button>
      <BottomNav active={screen.id === 'home' ? 'home' : screen.id === 'programs' ? 'programs' : screen.id === 'detail' ? 'detail' : 'book'} />
    </div>
  </article>
);

export const MobileAppStyleTest: React.FC = () => {
  const [active, setActive] = React.useState(0);
  const screen = screens[active];

  const next = () => setActive(value => (value + 1) % screens.length);
  const prev = () => setActive(value => (value - 1 + screens.length) % screens.length);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#ededeb] text-[#111]">
      <SEO
        title="MakerLab Mobile App Style Test"
        description="Prototype mobile-first MakerLab with real images, program catalog and detail page."
      />

      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center justify-between rounded-[1.75rem] bg-white/80 px-4 py-3 shadow-sm backdrop-blur md:px-5">
          <BrandMark />
          <div className="hidden items-center gap-2 sm:flex">
            {palette.map(color => <span key={color.name} className={`h-4 w-4 rounded-full ${color.value}`} />)}
          </div>
          <Link to="/" className="rounded-full bg-[#111] px-4 py-2 text-xs font-black text-white">
            Website
          </Link>
        </header>

        <section className="grid flex-1 gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.15em] text-brand-orange">
                <Zap size={16} /> Mobile app website
              </p>
              <h1 className="font-display text-6xl font-black leading-[0.95] tracking-tight">
                Programs and details as an app journey.
              </h1>
              <p className="mt-6 text-xl font-semibold leading-9 text-slate-600">
                This version uses real images for parent trust, MakerLab orange/black plus blue,
                green, red and yellow accents, and shows how the programs list and detail page can feel mobile-native.
              </p>
              <div className="mt-8 flex gap-3">
                <Link to="/quiz" className="rounded-2xl bg-brand-orange px-6 py-4 font-black text-white">
                  Try quiz
                </Link>
                <Link to="/programs" className="rounded-2xl bg-white px-6 py-4 font-black text-[#111]">
                  Current programs
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-3">
                {[
                  ['Programs', 'Swipeable cards with real images'],
                  ['Details', 'Outcome-first program page'],
                  ['Booking', 'Trust and WhatsApp support'],
                  ['Brand', 'Orange, blue, green, red, yellow'],
                ].map(([label, text]) => (
                  <div key={label} className="rounded-3xl bg-white/80 p-4 shadow-sm">
                    <p className="font-black">{label}</p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-slate-500">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <PhoneScreen screen={screen} />
            <div className="mx-auto mt-5 flex max-w-[360px] items-center justify-between">
              <button onClick={prev} className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm" aria-label="Previous screen">
                <ArrowLeft size={19} />
              </button>
              <div className="flex items-center gap-2">
                {screens.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActive(index)}
                    className={`h-2.5 rounded-full transition-all ${index === active ? 'w-8 bg-brand-orange' : 'w-2.5 bg-slate-300'}`}
                    aria-label={`Show ${item.eyebrow}`}
                  />
                ))}
              </div>
              <button onClick={next} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#111] text-white shadow-sm" aria-label="Next screen">
                <ArrowRight size={19} />
              </button>
            </div>
          </div>

          <div className="hidden grid-cols-2 gap-5 lg:grid">
            {screens.map(item => (
              <PhoneScreen key={item.id} screen={item} compact />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-3 pb-4 md:grid-cols-4">
          {[
            { icon: Sparkles, label: 'Real images', text: 'Parents see children, projects and tools.' },
            { icon: ShieldCheck, label: 'Trusted', text: 'Clear facts before booking.' },
            { icon: CheckCircle2, label: 'App flow', text: 'Home, programs, details, booking.' },
            { icon: Cpu, label: 'MakerLab colors', text: 'Orange, blue, green, red and yellow.' },
          ].map(item => (
            <div key={item.label} className="rounded-3xl bg-white p-4 shadow-sm">
              <item.icon className="mb-3 text-brand-orange" size={22} />
              <p className="font-black">{item.label}</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-slate-500">{item.text}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
};
