import { useEffect, useRef, useState } from "react";
import StarSwipe from "./StarSwipe.jsx";
import DotGrid from "./DotGrid.jsx";
import UserCursor from "./UserCursor.jsx";
import { prefersReducedMotion, useReveal, useScrollFill } from "./hooks.js";

/*
 * Section copy is final (provided by client). The contact email
 * (hello@talvren.ie) is still a PLACEHOLDER — replace when confirmed.
 */

const CONTACT_EMAIL = "hello@talvren.ie";

function CornerDots({ light = false }) {
  return (
    <>
      <span className={`dot dot-tl${light ? " dot-light" : ""}`} aria-hidden="true" />
      <span className={`dot dot-tr${light ? " dot-light" : ""}`} aria-hidden="true" />
      <span className={`dot dot-bl${light ? " dot-light" : ""}`} aria-hidden="true" />
      <span className={`dot dot-br${light ? " dot-light" : ""}`} aria-hidden="true" />
    </>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const close = () => setOpen(false);

  // Close the mobile menu on Escape or a tap/click outside the nav.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Main navigation" ref={navRef}>
        <a href="#top" className="nav-brand" onClick={close}>
          TALVREN
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
          <span className="nav-toggle-bar" aria-hidden="true" />
        </button>
        <div className={`nav-menu${open ? " is-open" : ""}`} id="nav-menu">
          <div className="nav-links">
            <a href="#services" onClick={close}>
              Services
            </a>
            <a href="#why" onClick={close}>
              Why Us
            </a>
            <a href="#process" onClick={close}>
              Process
            </a>
            <a href="#faq" onClick={close}>
              FAQs
            </a>
          </div>
          <a href="#contact" className="btn btn-secondary nav-cta" onClick={close}>
            <span className="btn-label">Contact Us</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

/* 1. HERO — StarSwipe flowing warped bands (blue/purple on light), text above */
function Hero() {
  const [reduce] = useState(() => prefersReducedMotion());
  return (
    <section className="hero" id="top">
      {!reduce && (
        <div className="hero-waves" aria-hidden="true">
          <StarSwipe
            colorA="#7EACF2"
            colorB="#AB84E6"
            background="#F4F4F4"
            intensity={0.58}
            warpStrength={1.3}
          />
        </div>
      )}
      <div className="hero-scrim" aria-hidden="true" />
      <div className="container hero-inner">
        <h1 className="display hero-title">
          <span className="line-mask">
            <span className="line-rise">Build the systems</span>
          </span>
          <span className="line-mask">
            <span className="line-rise line-rise-2">behind your growth.</span>
          </span>
        </h1>
        <p className="body-copy hero-copy hero-in hero-in-2">
          We create modern websites and automated workflows that help your
          business attract customers, reduce repetitive work, and operate more
          efficiently.
        </p>
        <div className="hero-in hero-in-3">
          <a href="#contact" className="btn btn-primary btn-lg">
            <span className="btn-label">Start a project</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* 2. WHO WE HELP — blue panel, signature scroll-scrubbed headline fill */
function WhoWeHelp() {
  const fillRef = useScrollFill();
  return (
    <section className="panel panel-white section section-gap" id="who">
      <div className="container who-inner">
        <p className="section-label">Who we help</p>
        <h2 className="display section-title who-title scrub-fill" ref={fillRef}>
          <span className="scrub-line">We work with small businesses</span>
          <span className="scrub-line">that need a stronger online</span>
          <span className="scrub-line">presence and simpler ways</span>
          <span className="scrub-line">to get work done.</span>
        </h2>
      </div>
    </section>
  );
}

/* 3. SERVICES — orange panel */
const SERVICES = [
  {
    accent: "badge-blue",
    badge: "Websites",
    title: "Website Design & Development",
    copy: "Modern, responsive websites that make your business easy to understand, trust, and contact.",
  },
  {
    accent: "badge-orange",
    badge: "Redesign",
    title: "Website Redesign",
    copy: "A better version of the website you already have, with clearer structure, stronger usability, and a more modern experience.",
  },
  {
    accent: "badge-purple",
    badge: "Automation",
    title: "Automated Workflows",
    copy: "Useful automations that reduce repetitive tasks, connect everyday processes, and save you time behind the scenes.",
  },
];

function Services() {
  const gridRef = useReveal();
  const headRef = useReveal();
  return (
    <section className="panel panel-blue section section-gap" id="services">
      <div className="container">
        <div className="reveal" ref={headRef}>
          <p className="section-label">Services</p>
          <h2 className="display section-title">
            What we can
            <br />
            build for you.
          </h2>
          <p className="section-intro">
            Practical digital solutions built around what your business actually
            needs.
          </p>
        </div>
        <div className="grid grid-3 reveal-stagger" ref={gridRef}>
          {SERVICES.map((s, i) => (
            <article className="card reveal" style={{ transitionDelay: `${i * 90}ms` }} key={s.title}>
              <span className={`badge ${s.accent}`}>{s.badge}</span>
              <h3 className="card-title">{s.title}</h3>
              <p className="card-copy">{s.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4. WHY WORK WITH US — dark panel, two-column intro + numbered list */
const REASONS = [
  {
    num: "01",
    accent: "var(--blue)",
    title: "Clear from the start",
    copy: "We keep the process straightforward, so you always understand what we are doing and what comes next.",
  },
  {
    num: "02",
    accent: "var(--orange)",
    title: "Built for real needs",
    copy: "Every website or workflow starts with the problem you are trying to solve, not with a one-size-fits-all solution.",
  },
  {
    num: "03",
    accent: "var(--purple)",
    title: "Easy to use",
    copy: "What we build should make life easier for the people using it, whether that is your customers or your team.",
  },
  {
    num: "04",
    accent: "var(--blue)",
    title: "Modern without the complexity",
    copy: "We use current tools and technology to build efficient solutions without adding unnecessary complexity to your business.",
  },
];

function WhyUs() {
  const introRef = useReveal();
  const listRef = useReveal();
  return (
    <section className="section section-plain section-gap why2" id="why">
      <div className="container why2-grid">
        <div className="why2-intro reveal" ref={introRef}>
          <p className="section-label">Why work with us</p>
          <h2 className="display section-title why2-title">
            Built around your business, not a template.
          </h2>
          <p className="section-intro why2-copy">
            We focus on what your business needs to work better, communicate
            clearly, and create a stronger experience for your customers.
          </p>
        </div>
        <div className="why2-list reveal-stagger" ref={listRef}>
          {REASONS.map((r, i) => (
            <div
              className="why-item reveal"
              style={{ transitionDelay: `${i * 80}ms`, "--accent": r.accent }}
              key={r.num}
            >
              <div className="why-item-head">
                <h3 className="why-item-title">{r.title}</h3>
                <span className="why-item-num">{r.num}</span>
              </div>
              <p className="why-item-copy">{r.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 5. HOW IT WORKS — off-white (nav label: "Process") — icon cards */
/* Duotone icons: a low-opacity accent fill layered under a solid accent line.
   Both layers use currentColor (the deepened accent set on .step-icon). */
const STEP_ICONS = {
  // speech bubble — tell us
  message: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor" opacity="0.18" />
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" />
      <circle cx="8.5" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <circle cx="15.5" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
  // compass — plan the right direction
  compass: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.18" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" />
      <path d="M16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88Z" fill="currentColor" />
    </svg>
  ),
  // pen tool — design and build
  pen: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" fill="currentColor" opacity="0.18" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="currentColor" />
      <path d="M12 19l7-7 3 3-7 7-3-3z" fill="currentColor" opacity="0.18" />
      <path d="M12 19l7-7 3 3-7 7-3-3z" stroke="currentColor" />
      <path d="M2 2l7.586 7.586" stroke="currentColor" />
      <circle cx="11" cy="11" r="1.6" fill="currentColor" />
    </svg>
  ),
  // rocket — review and launch
  rocket: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" fill="currentColor" opacity="0.18" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" stroke="currentColor" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" stroke="currentColor" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="currentColor" />
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" fill="currentColor" opacity="0.4" />
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" stroke="currentColor" />
      <circle cx="15" cy="9" r="1.3" fill="currentColor" />
    </svg>
  ),
};

const STEPS = [
  {
    icon: "message",
    color: "var(--blue)",
    title: "Tell us what you need",
    copy: "Share what you do, what is not working, and what you would like to improve.",
  },
  {
    icon: "compass",
    color: "var(--orange)",
    title: "We plan the right solution",
    copy: "We look at your goals and recommend the approach that makes the most sense for your business.",
  },
  {
    icon: "pen",
    color: "var(--purple)",
    title: "We design and build",
    copy: "We turn the plan into a polished website or workflow built around your needs.",
  },
  {
    icon: "rocket",
    color: "var(--blue)",
    title: "Review and launch",
    copy: "You review the work, we refine the agreed details, and once everything is ready, we put it to work.",
  },
];

function HowItWorks() {
  const ref = useReveal();
  const headRef = useReveal();
  return (
    <section className="section section-plain" id="process">
      <div className="container">
        <div className="reveal" ref={headRef}>
          <p className="section-label">How we work</p>
          <h2 className="display section-title">
            A simple process
            <br />
            from start to launch.
          </h2>
          <p className="section-intro">
            We keep every project focused, collaborative, and easy to follow.
          </p>
        </div>
        <ol className="grid grid-4 steps reveal-stagger" ref={ref}>
          {STEPS.map((s, i) => (
            <li
              className="step-card reveal"
              style={{ transitionDelay: `${i * 90}ms`, "--accent": s.color }}
              key={s.title}
            >
              <span className="step-icon" aria-hidden="true">
                {STEP_ICONS[s.icon]}
              </span>
              <h3 className="reason-title">{s.title}</h3>
              <p className="reason-copy step-copy">{s.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 6. FAQ — off-white, five questions */
const FAQS = [
  {
    q: "Can you build a website from scratch?",
    a: "Yes. If you do not have a website yet, we can take you from the initial idea through design, build, and launch.",
  },
  {
    q: "Can you redesign my existing website?",
    a: "Yes. We can improve an outdated or difficult-to-use website and turn it into something clearer, more modern, and better suited to your business.",
  },
  {
    q: "What can automated workflows help with?",
    a: "They can reduce repetitive tasks such as moving information between tools, organising enquiries, sending follow-ups, updating records, and handling other routine processes.",
  },
  {
    q: "What do I need to get started?",
    a: "Start by telling us about your business, what you want to improve, and what you already have. We will guide you through anything else we need.",
  },
  {
    q: "How does pricing work?",
    a: "Every project is different, so pricing depends on the scope and complexity of what you need. Once we understand the project, we will give you a clear quote before work begins.",
  },
];

function FaqItem({ q, a, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`faq-item reveal${open ? " is-open" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button
        type="button"
        className="faq-summary"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{q}</span>
        <span className="faq-marker" aria-hidden="true" />
      </button>
      <div className="faq-answer-wrap">
        <div className="faq-answer-inner">
          <p className="faq-answer">{a}</p>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  const ref = useReveal();
  const headRef = useReveal();
  return (
    <section className="section section-plain" id="faq">
      <div className="container container-narrow">
        <div className="reveal" ref={headRef}>
          <p className="section-label">FAQs</p>
          <h2 className="display section-title">
            A few things you
            <br />
            might want to know.
          </h2>
        </div>
        <div className="faq-list reveal-stagger" ref={ref}>
          {FAQS.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* 7. FINAL CTA — dark panel, corner dots */
function FinalCta() {
  const ref = useReveal();
  const [reduce] = useState(() => prefersReducedMotion());
  return (
    <section className="panel panel-dark section section-cta" id="contact">
      {!reduce && (
        <div className="cta-dots" aria-hidden="true">
          <DotGrid
            dotSize={4}
            gap={16}
            baseColor="#3A3A3A"
            activeColor="#98C1FF"
            proximity={120}
            shockRadius={220}
            shockStrength={4}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
      )}
      <div className="container cta-inner reveal" ref={ref}>
        <h2 className="display section-title cta-title">
          Ready to build what your
          <br />
          business needs next?
        </h2>
        <p className="body-copy cta-copy">
          Tell us what you are trying to improve, and we will help you figure
          out the right way forward.
        </p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-light btn-lg">
          <span className="btn-label">Start a project</span>
        </a>
      </div>
    </section>
  );
}

function Footer() {
  const ref = useReveal();
  return (
    <footer className="footer">
      <div className="container footer-inner reveal" ref={ref}>
        <span className="display footer-brand">TALVREN</span>
        <div className="footer-meta">
          <a href={`mailto:${CONTACT_EMAIL}`} className="footer-link">
            {CONTACT_EMAIL}
          </a>
          <span className="footer-copy">© 2026 TALVREN — Based in Ireland</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <UserCursor />
      <Nav />
      <main>
        <Hero />
        <WhoWeHelp />
        <Services />
        <WhyUs />
        <HowItWorks />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
