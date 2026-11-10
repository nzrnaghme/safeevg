/** @jsxImportSource @/lib/site-jsx */
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Building2,
  Bus,
  Car,
  ChevronDown,
  Home as HomeIcon,
  MapPin,
  Menu,
  ShoppingBag,
  Sun,
  Truck,
  Warehouse,
  X,
  Zap,
} from "lucide-react";
import heroPhoto from "../assets/solar-home-hero.webp";
import { heroSlides, homepageAssets } from "../assets/heroSlides";

const heroCategories = [
  { title: "Residential Homes", description: "Single-family homes, garages, and driveways.", photo: "residential", path: "home", icon: HomeIcon },
  { title: "Condos & Apartments", description: "Multifamily buildings, HOAs, and shared parking.", photo: "apartments", path: "apartments", icon: Building2 },
  { title: "Commercial & Retail", description: "Shopping centers, offices, hotels, and business properties.", photo: "commercial", path: "commercial", icon: ShoppingBag },
  { title: "Electric Buses & Transit", description: "School buses, public transit, and shuttle fleets.", photo: "transit", path: "fleets", icon: Bus },
  { title: "Heavy-Duty Trucks & Fleets", description: "Logistics centers, delivery fleets, and electric truck operations.", photo: "trucks", path: "fleets", icon: Truck },
];

const footerLinks: Record<string, string> = {
  'EV charging': '/ev-charging',
  'Solar energy': '/solar',
  'Apartments & HOAs': '/solutions/apartments',
  'Fleets & depots': '/solutions/fleets',
  'Explore equipment': '/equipment',
  'Funding & incentives': '/funding',
  'Our approach': '/approach',
  'Request an assessment': '/contact',
  'About EVG': '/about',
  'Guides & documents': '/resources',
  'Common questions': '/faq',
  'Project economics': '/economics',
  'How we can help': '/how-we-help',
  'Property owners & developers': '/property-owners',
  'Ownership & financing': '/ownership-financing',
  'Operations & maintenance': '/operations-maintenance',
};

const solutionPaths = ["home", "apartments", "commercial", "public-dc", "fleets"];
const ORANGE = "#f26b2a";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="Safeevg home">
      <img src="/brand-logo.webp" alt="" width={36} height={36} className="h-9 w-9 shrink-0 object-contain" />
      <span className={compact ? "hidden sm:block" : "block"}>
        <span className="block text-[11px] font-extrabold leading-[.9] tracking-[.02em] text-white">Safeevg</span>
      </span>
    </a>
  );
}

const ArrowLink = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <span className={
    "inline-flex items-center gap-2 text-xs font-semibold transition-all group-hover:gap-3 " +
    (dark ? "text-white" : "text-[#1f2d35]")
  }>
    {children}<ArrowUpRight size={14} aria-hidden="true" />
  </span>
);

const properties = [
  ["01", "Homes", "Overnight convenience, sized to your drive.", HomeIcon],
  ["02", "Apartments & HOAs", "Resident access, shared capacity and room to grow.", Building2],
  ["03", "Workplaces & businesses", "Charging while customers and employees park.", Warehouse],
  ["04", "Public fast charging", "Planned around site activity and an operating plan.", MapPin],
  ["05", "Fleets & depots", "Energy for the next route, within your schedule.", Car],
] as const;

const steps = [
  ["01", "Understand your site", "Your goals, vehicles, parking and electricity use."],
  ["02", "Shape the plan", "Equipment options, capacity, costs and possible funding."],
  ["03", "Coordinate the details", "Design, utility coordination and required approvals."],
  ["04", "Get ready to charge", "Installation, testing, handover and support planning."],
];

const equipment = [
  ["TESLA", "Universal Wall Connector", "Up to 11.5 kW at 240 V", homepageAssets.teslaWall],
  ["ABB", "Terra AC Wallbox 40A", "9.6 kW at 240 V", homepageAssets.abbTerra],
  ["ABB", "A200 / A300 / A400", "200 / 300 / 400 kW", homepageAssets.abbA400],
] as const;

const faqs = [
  ["How do I know which EV charger fits my property?", "We start with your vehicles, daily mileage, parking layout, electrical capacity and future plans—then recommend the right charging speed and equipment."],
  ["Will I need an electrical upgrade?", "Not always. A site assessment confirms available capacity and whether load management or an upgrade is the better path."],
  ["Are incentives available for my project?", "Programs vary by utility, location and project type. We identify relevant opportunities early so they can inform the plan."],
  ["Can solar and EV charging be planned together?", "Yes. Coordinating them can create a clearer long-term energy plan and make future expansion easier."],
] as const;

export default function Home() {
  useEffect(() => {
    const section = window.location.hash.slice(1);
    if (section) document.getElementById(section)?.scrollIntoView();
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".spw-reveal").forEach(el => observer.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || sliderPaused) return;

    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % heroSlides.length),
      6000,
    );

    return () => window.clearInterval(timer);
  }, [sliderPaused]);

  return (
    <main id="top" className="min-h-screen overflow-x-hidden bg-[#f5f1e9] text-[#1f2d35]">
      <style>{'.spw-reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1)}.spw-reveal.is-visible{opacity:1;transform:none}@media(prefers-reduced-motion:reduce){.spw-reveal{opacity:1;transform:none;transition:none}}'}</style>

      <header className="fixed inset-x-0 top-0 z-40 lg:absolute border-b border-white/10 bg-[#15242c]/85 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-7 text-[12px] font-medium text-white/75 lg:flex" aria-label="Main navigation">
<a href="/how-we-help" className="hover:text-white">How we can help</a>

            <a href="#solutions" className="hover:text-white">Solutions</a>
            <a href="/equipment" className="hover:text-white">Equipment</a>
            <a href="/funding" className="hover:text-white">Funding & incentives</a>
            <a href="/approach" className="hover:text-white">Our approach</a>
            <a href="/resources" className="hover:text-white">Resources</a>
          </nav>
          <a href="/contact" className="hidden min-h-11 items-center gap-3 rounded-sm bg-[#f26b2a] text-[#15242c] px-5 text-xs font-bold text-[#15242c] transition hover:bg-[#dd581a] lg:inline-flex">
            Plan your project <ArrowUpRight size={15} />
          </a>
          <button onClick={() => setMenuOpen(!menuOpen)} className="grid h-11 w-11 place-items-center rounded-md border border-white/25 text-white lg:hidden" aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="max-h-[calc(100dvh-76px)] overflow-y-auto overscroll-contain border-t border-white/10 bg-[#17262e] px-5 py-5 text-sm text-white lg:hidden">
            <div className="mx-auto grid max-w-[1240px] gap-1">
              {["Solutions", "Equipment", "Funding & incentives", "Our approach", "Resources"].map(item => (
                <a key={item} href={item === "Solutions" ? "#solutions" : item === "Equipment" ? "/equipment" : item.startsWith("Funding") ? "/funding" : item === "Our approach" ? "/approach" : "#resources"} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center border-b border-white/10">{item}</a>
              ))}
              <a href="/contact" onClick={() => setMenuOpen(false)} className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 bg-[#f26b2a] text-[#15242c] font-bold">Plan your project <ArrowUpRight size={15} /></a>
            </div>
          
<a href="/how-we-help" className="block py-2" onClick={() => setMenuOpen(false)}>How we can help</a>
</nav>
        )}
      </header>

      <section
        className="relative flex min-h-[760px] flex-col items-center justify-center bg-[#13242d] pt-[76px] text-white lg:min-h-[720px]"
        onMouseEnter={() => setSliderPaused(true)}
        onMouseLeave={() => setSliderPaused(false)}
        onFocusCapture={() => setSliderPaused(true)}
        onBlurCapture={() => setSliderPaused(false)}
      >
        <div className="absolute inset-0" role="region" aria-roledescription="carousel" aria-label="EVG energy projects">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.alt}
              src={slide.src}
              alt={slide.alt}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
              width={1672}
              height={941}
              aria-hidden={index !== activeSlide}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 motion-reduce:transition-none ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,29,37,.93)_0%,rgba(13,29,37,.68)_45%,rgba(13,29,37,.2)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1240px] px-5 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-6 text-[11px] font-bold uppercase tracking-[.23em] text-[#f7a071]">Southern California · EV charging & solar energy</p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[.98] tracking-[-.05em] sm:text-6xl lg:text-[82px]">
              EV charging, solar<br /><span className="text-[#f26b2a]">& battery storage.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-white/72">Plan the right system for your property or fleet. Get help with site assessment, equipment selection, utility and permit coordination, installation planning, incentives and ongoing operations.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/contact" className="inline-flex min-h-13 items-center justify-center gap-3 bg-[#f26b2a] text-[#15242c] px-6 text-sm font-bold transition hover:bg-[#dd581a]">Plan your project <ArrowUpRight size={16} /></a>
              <a href="/how-we-help" className="inline-flex min-h-13 items-center justify-center gap-3 border border-white/35 bg-white/5 px-6 text-sm font-bold backdrop-blur transition hover:bg-white/10">See how we can help <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-5 right-6 hidden items-center gap-2 text-[9px] uppercase tracking-[.16em] text-white/55 md:flex"><span className="h-px w-12 bg-[#f26b2a]" /> Practical energy · Thoughtfully done</div>
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 sm:bottom-4 sm:left-6 lg:left-10" role="group" aria-label="Choose hero image">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.alt}
              type="button"
              onClick={() => setActiveSlide(index)}
              className="grid h-11 w-11 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={`Show slide ${index + 1}: ${slide.alt}`}
              aria-current={index === activeSlide ? "true" : undefined}
            >
              <span
                className={`block h-1.5 rounded-full transition-all motion-reduce:transition-none ${
                  index === activeSlide ? "w-6 bg-[#f26b2a]" : "w-2 bg-white/60 hover:bg-white"
                }`}
              />
            </button>
          ))}
        </div>
        <nav aria-label="EV charging categories" className="relative z-10 mx-auto grid w-full min-w-0 max-w-[1240px] auto-cols-[min(75vw,240px)] grid-flow-col gap-2.5 overflow-x-auto px-5 pb-6 pt-2 lg:grid-flow-row lg:grid-cols-5 lg:overflow-visible lg:px-8">
          {heroCategories.map(({ title, description, photo, path, icon: Icon }) => (
            <a
              key={title}
              href={"/solutions/" + path}
              className="group flex min-w-0 flex-col overflow-hidden rounded-md border border-[#f26b2a]/40 border-b-[#f26b2a] bg-[#202f3a] text-white transition-colors hover:border-[#f26b2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff9b55]"
            >
              <img src={"/hero-categories/" + photo + ".webp"} alt={title + " EV charging"} loading="lazy" decoding="async" width={340} height={114} className="aspect-[3/1] w-full object-cover" />
              <div className="relative -mt-2 flex flex-1 flex-col px-3.5 pb-4 pt-1">
                <Icon size={23} className="mb-1.5 text-[#ff873e]" aria-hidden="true" />
                <span className="flex items-start justify-between gap-1 text-base font-semibold leading-tight">
                  {title}<ArrowUpRight size={15} className="mt-0.5 shrink-0 text-[#ff873e] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
                <span className="mt-1.5 text-sm leading-snug text-slate-200">{description}</span>
              </div>
            </a>
          ))}
        </nav>
      </section>


      <section id="solutions" className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px] spw-reveal">
          <div className="mb-10 grid gap-5 lg:grid-cols-[1fr_.4fr] lg:items-end">
            <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d35a24]">One property. More possibility.</p><h2 className="mt-4 max-w-xl text-4xl font-medium leading-[1.02] tracking-[-.045em] sm:text-5xl">Better energy starts<br />with a better plan.</h2></div>
            <p className="max-w-sm text-sm leading-6 text-[#6d756f]">Choose a starting point. We’ll help bring the details, equipment and next steps into focus.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
            <a href="/ev-charging" className="group relative min-h-[430px] overflow-hidden rounded-lg bg-[#23353c] text-white">
              <img src={homepageAssets.evStation.src} alt={homepageAssets.evStation.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.025]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10232d]/90 via-[#10232d]/35 to-[#10232d]/10" />
              <div className="absolute inset-x-7 bottom-7"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/65">01 / Charge</p><h3 className="mt-3 text-4xl tracking-[-.04em]">EV charging</h3><p className="mt-2 text-sm text-white/70">From an overnight charge at home to a depot ready for tomorrow.</p><span className="mt-7 inline-block"><ArrowLink dark>Explore EV charging</ArrowLink></span></div>
            </a>
            <a href="/solar" className="group relative min-h-[430px] overflow-hidden rounded-lg bg-[#18272e] text-white">
              <img src={heroPhoto} alt="Solar panels on a modern home" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[#11242d]/62" />
              <div className="absolute inset-x-7 bottom-7"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/65">02 / Generate</p><h3 className="mt-3 text-4xl tracking-[-.04em]">Solar energy</h3><p className="mt-2 text-sm text-white/70">Your roof. Your energy. A more considered possibility.</p><span className="mt-7 inline-block"><ArrowLink dark>Explore solar</ArrowLink></span></div>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-6 grid max-w-[1240px] gap-3 sm:grid-cols-3">
          <a className="rounded-md border border-[#dedbd2] bg-white p-4 font-semibold" href="/property-owners">Property owners & developers <span aria-hidden="true">↗</span></a>
          <a className="rounded-md border border-[#dedbd2] bg-white p-4 font-semibold" href="/ownership-financing">Ownership & financing <span aria-hidden="true">↗</span></a>
          <a className="rounded-md border border-[#dedbd2] bg-white p-4 font-semibold" href="/operations-maintenance">Operations & maintenance <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section id="fit" className="px-5 pb-28 lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-12 border-t border-[#d8d3c9] pt-16 lg:grid-cols-[.95fr_1.05fr] lg:gap-24 spw-reveal">
          <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d35a24]">Built around the way you park</p><h2 className="mt-4 text-4xl font-medium leading-[1.03] tracking-[-.045em] sm:text-5xl">Different properties.<br />The right fit for each.</h2><p className="mt-6 max-w-md text-sm leading-6 text-[#68716c]">A home and a public charging site need different plans. Start with the people, vehicles and time available to charge.</p><p className="mt-10 text-[9px] leading-4 text-[#8b8f89]">Start with: Equipment basics<br />Capacity, access and operating needs guide the choice.</p></div>
          <div className="divide-y divide-[#d8d3c9]">
            {properties.map(([n, title, text, Icon]) => (
              <a key={title} href={"/solutions/" + solutionPaths[Number(n) - 1]} className="group grid min-h-[92px] grid-cols-[42px_1fr_auto] items-center gap-3 py-4">
                <span className="text-[10px] font-bold text-[#d35a24]">{n}</span><span><span className="flex items-center gap-2 text-base font-semibold"><Icon size={17} aria-hidden="true" />{title}</span><span className="mt-1 block text-xs text-[#7a817c]">{text}</span></span><ArrowUpRight size={15} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="approach" className="bg-[#183a32] px-5 py-24 text-white lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1240px] spw-reveal">
          <div className="flex flex-col justify-between gap-5 border-b border-white/15 pb-8 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#f2a174]">A clear way forward</p><h2 className="mt-4 text-4xl font-medium tracking-[-.04em] sm:text-5xl">Considered at every step.</h2></div><a href="/approach" className="group"><ArrowLink dark>See our approach</ArrowLink></a></div>
          <div className="grid gap-9 pt-10 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(([n, title, text]) => <div key={n} className="border-t border-white/15 pt-5"><p className="text-[10px] font-bold text-[#f2a174]">{n} /</p><h3 className="mt-8 text-lg font-semibold">{title}</h3><p className="mt-3 text-xs leading-5 text-white/55">{text}</p><p className="mt-6 text-[9px] text-white/70">Assessment & proposal</p></div>)}
          </div>
        </div>
      </section>

      <section id="equipment" className="px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1240px] spw-reveal">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_.45fr]"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d35a24]">The equipment behind the plan</p><h2 className="mt-4 text-4xl font-medium leading-[1.03] tracking-[-.045em] sm:text-5xl">Right-sized.<br />Ready for your site.</h2></div><div className="self-end"><p className="text-sm leading-6 text-[#6d756f]">Explore manufacturer specifications. The final selection follows your site assessment.</p><a href="/equipment" className="group mt-4 inline-block"><ArrowLink>Browse equipment</ArrowLink></a></div></div>
          <div className="grid gap-5 md:grid-cols-3">
            {equipment.map(([brand, name, power, image]) => <article key={name} className="overflow-hidden border border-[#dedbd3] bg-white"><div className="flex h-64 items-center justify-center overflow-hidden bg-[#f7f7f4] p-5"><img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="h-full w-full object-contain transition-transform duration-500 motion-reduce:transition-none hover:scale-[1.025]" /></div><div className="p-5"><p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#9a9f99]">{brand}</p><h3 className="mt-4 text-lg font-semibold">{name}</h3><p className="mt-1 text-xs text-[#68716c]">{power}</p><p className="mt-3 text-[9px] uppercase tracking-[.1em] text-[#9a9f99]">Apartments · Workplace · Commercial</p><a href={"/equipment/" + (name === "Universal Wall Connector" ? "universal" : name === "Terra AC Wallbox 40A" ? "ac40" : "a400")} className="group mt-6 inline-block"><ArrowLink>View specifications</ArrowLink></a></div></article>)}
          </div>
          <p className="mt-6 text-[9px] leading-4 text-[#979b96]">Terms and utility requirements are based on supplied documents. Availability, configuration and compatibility require confirmation.</p>
        </div>
      </section>

      <section id="funding" className="bg-[#e7eee6] px-5 py-24 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center spw-reveal">
          <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d35a24]">Funding & utility planning</p><h2 className="mt-4 text-4xl font-medium leading-[1.03] tracking-[-.045em] sm:text-5xl">Find the opportunities.<br />Understand the conditions.</h2><p className="mt-6 max-w-md text-sm leading-6 text-[#68716c]">Location, utility service and project type shape the options. Make a sound plan with confirmed costs and clearly identified funding.</p><a href="/funding" className="group mt-7 inline-flex min-h-11 items-center border border-[#bdc8be] px-4"><ArrowLink>Explore funding resources</ArrowLink></a></div>
          <div className="space-y-3">{[["01","Start with the property","Address, use and electrical needs."],["02","Confirm the utility","Connection scope, rates and capacity."],["03","Check the program","Eligibility, timing and verified terms."]].map(([n,t,d]) => <div key={n} className="grid grid-cols-[54px_1fr] items-center bg-white px-5 py-5 shadow-sm"><span className="text-3xl font-light text-[#a7b2a9]">{n}</span><span><span className="block text-sm font-semibold">{t}</span><span className="mt-1 block text-xs text-[#8a918b]">{d}</span></span></div>)}</div>
        </div>
      </section>

      <section id="resources" className="px-5 py-24 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.75fr_1.25fr] spw-reveal">
          <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d35a24]">A few good questions</p><h2 className="mt-4 text-4xl font-medium leading-[1.03] tracking-[-.045em] sm:text-5xl">Let’s make<br />the details clearer.</h2><a href="/faq" className="group mt-7 inline-block"><ArrowLink>Read all FAQs</ArrowLink></a></div>
          <div className="divide-y divide-[#d8d3c9] border-t border-[#d8d3c9]">{faqs.map(([q,a], i) => <div key={q}><button onClick={() => setFaqOpen(faqOpen === i ? -1 : i)} className="flex min-h-16 w-full items-center justify-between gap-5 py-4 text-left text-sm font-semibold" aria-expanded={faqOpen === i}><span>{q}</span><ChevronDown size={17} className={"shrink-0 transition " + (faqOpen === i ? "rotate-180 text-[#f26b2a]" : "text-[#f26b2a]")} /></button>{faqOpen === i && <p className="max-w-2xl pb-6 pr-8 text-sm leading-6 text-[#6d756f]">{a}</p>}</div>)}</div>
        </div>
      </section>

      <section id="contact" className="px-5 pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-8 rounded-lg bg-[#172630] px-7 py-12 text-white sm:px-12 lg:flex-row lg:items-center lg:py-16 spw-reveal"><div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#f2a174]">Good work starts with a conversation</p><h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-.04em] sm:text-5xl">Your property.<br />A clear way forward.</h2><p className="mt-5 max-w-xl text-sm leading-6 text-white/55">Tell us about your site and what you have in mind. Start with an assessment shaped around your project.</p></div><a href="mailto:hello@safepublicworks.com?subject=Plan%20my%20project" className="inline-flex min-h-13 shrink-0 items-center justify-center gap-3 bg-[#f26b2a] text-[#15242c] px-7 text-sm font-bold transition hover:bg-[#dd581a]">Plan your project <ArrowUpRight size={16} /></a></div>
      </section>

      <footer className="bg-[#172630] px-5 py-12 text-white lg:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.3fr_repeat(3,1fr)]"><div><Logo /><p className="mt-6 max-w-xs text-xs leading-5 text-white/70">Practical energy.<br />Thoughtfully planned for your property.</p></div>{[["SOLUTIONS","EV charging","Solar energy","Apartments & HOAs","Fleets & depots"],["PLAN YOUR PROJECT","Explore equipment","Funding & incentives","Our approach","Request an assessment"],["COMPANY & RESOURCES","About EVG","Guides & documents","Common questions","Project economics", "How we can help", "Property owners & developers", "Ownership & financing", "Operations & maintenance"]].map(group => <div key={group[0]}><p className="text-[9px] font-bold tracking-[.15em] text-white/70">{group[0]}</p><div className="mt-5 grid gap-3 text-xs text-white/70">{group.slice(1).map(item => <a key={item} href={footerLinks[item]} className="hover:text-white">{item}</a>)}</div></div>)}</div>
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-3 pt-6 text-[9px] text-white/70 sm:flex-row"><span>© {new Date().getFullYear()} EVG. All rights reserved.</span><span>Southern California · <a href="/privacy">Privacy information</a></span></div>
      </footer>

      {showTop && <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-5 right-5 z-50 grid h-12 w-12 place-items-center rounded-full bg-[#f26b2a] text-white shadow-xl transition hover:-translate-y-1" aria-label="Back to top"><ArrowUp size={20} /></button>}
    </main>
  );
}
