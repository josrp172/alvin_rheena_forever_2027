"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { wedding } from "@/content/wedding";
import { useIntro } from "./intro-context";
import { silk } from "./reveal";

const links = [
  { href: "#story", label: "Our Story" },
  { href: "#film", label: "Film" },
  { href: "#gallery", label: "Gallery" },
  { href: "#details", label: "When & Where" },
  { href: "#schedule", label: "The Day" },
  { href: "#attire", label: "Attire" },
  { href: "#travel", label: "Travel" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const { opened } = useIntro();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [a, b] = wedding.couple.monogram;

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));
  const light = !scrolled && !menuOpen;

  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : -20 }}
        transition={{ duration: 1, delay: opened ? 2.4 : 0, ease: silk }}
      >
        <div
          className={`transition-all duration-700 ease-[var(--ease-silk)] ${
            scrolled
              ? "border-b border-line bg-paper/75 backdrop-blur-xl backdrop-saturate-150"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Main">
            <a href="#top" className={`font-display text-2xl italic transition-colors duration-500 ${light ? "text-white" : "text-ink"}`} aria-label="Back to top">
              {a}
              <span className={`mx-0.5 text-lg ${light ? "text-blush" : "text-rose"}`}>&amp;</span>
              {b}
            </a>

            <ul className="hidden items-center gap-6 xl:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`group relative text-[0.68rem] tracking-[0.24em] uppercase transition-colors duration-500 ${light ? "text-white/85 hover:text-white" : "text-ink-soft hover:text-ink"}`}
                  >
                    {l.label}
                    <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-rose transition-transform duration-500 group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#rsvp"
                  className={`rounded-full px-5 py-2 text-[0.68rem] tracking-[0.24em] uppercase transition-colors duration-500 ${light ? "bg-white text-ink hover:bg-blush" : "bg-berry text-white hover:bg-ink"}`}
                >
                  RSVP
                </a>
              </li>
            </ul>

            <button
              type="button"
              className="relative -mr-2 grid h-11 w-11 place-items-center xl:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <motion.span
                className={`absolute h-px w-6 transition-colors ${light ? "bg-white" : "bg-ink"}`}
                animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                transition={{ duration: 0.5, ease: silk }}
              />
              <motion.span
                className={`absolute h-px w-6 transition-colors ${light ? "bg-white" : "bg-ink"}`}
                animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                transition={{ duration: 0.5, ease: silk }}
              />
            </button>
          </nav>
          <motion.div className="h-[2px] origin-left bg-gradient-to-r from-rose via-berry to-gold" style={{ scaleX: progress }} />
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-30 flex flex-col justify-center bg-paper/95 px-8 backdrop-blur-xl xl:hidden"
            initial={{ opacity: 0, clipPath: "circle(0% at 92% 4%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 92% 4%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.8, ease: silk }}
          >
            <motion.ul
              className="space-y-2"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
            >
              {[...links, { href: "#rsvp", label: "RSVP" }].map((l, i) => (
                <motion.li
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
                    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: silk } },
                  }}
                >
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 py-1.5 font-display text-[2.4rem] leading-tight font-light text-ink"
                  >
                    <span className="font-sans text-[0.65rem] tracking-[0.2em] text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={l.href === "#rsvp" ? "italic text-berry" : ""}>{l.label}</span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <motion.p
              className="eyebrow mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              {wedding.date.short} · {wedding.date.city}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Floating RSVP pill for phones, hidden at the top, once the form is on screen, and on a guest's first walk through. */
export function FloatingRsvp() {
  const { opened, explored } = useIntro();
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setPastHero(v > window.innerHeight * 0.8));

  useEffect(() => {
    const el = document.getElementById("rsvp");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setAtForm(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = opened && explored && pastHero && !atForm;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#rsvp"
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[0.68rem] tracking-[0.28em] text-paper uppercase shadow-[0_12px_30px_-10px_rgba(46,56,47,0.6)] lg:hidden"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ duration: 0.6, ease: silk }}
        >
          <span className="text-gold-soft">♡</span> RSVP
        </motion.a>
      )}
    </AnimatePresence>
  );
}
