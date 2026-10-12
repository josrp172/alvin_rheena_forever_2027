"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/content/wedding";
import { Bubble, CoupleBack, CoupleFront, ENVELOPE_BOX, SCENE } from "./couple";
import { useIntro } from "./intro-context";
import { kickVideos } from "./media";
import { useMusic } from "./music";
import { Petals } from "./petals";
import { silk } from "./reveal";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function SealBurst() {
  const bits = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    const d = 70 + (i % 3) * 35;
    return { x: Math.cos(a) * d, y: Math.sin(a) * d, heart: i % 3 === 0 };
  });
  return (
    <div aria-hidden className="pointer-events-none absolute top-[60%] left-1/2 z-[6]">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className={`absolute -mt-1.5 -ml-1.5 block ${b.heart ? "text-[13px] text-rose" : "h-1.5 w-1.5 rounded-full bg-gold-soft"}`}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.3 }}
          animate={{ x: b.x, y: b.y, opacity: 0, scale: 1.2, rotate: 90 }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {b.heart ? "♥" : null}
        </motion.span>
      ))}
    </div>
  );
}

export function Envelope() {
  const { opened, open, guest } = useIntro();
  const music = useMusic();
  const [scope, animate] = useAnimate();
  const busy = useRef(false);
  const [burst, setBurst] = useState(false);
  const [phase, setPhase] = useState(0);
  const [greet, setGreet] = useState(false);
  const [a, b] = wedding.couple.monogram;

  useEffect(() => {
    const id = setTimeout(() => setGreet(true), 1800);
    return () => clearTimeout(id);
  }, []);

  async function handleOpen() {
    if (busy.current) return;
    busy.current = true;
    music.start(); // must happen inside the tap for browsers to allow audio
    kickVideos(); // same tap lets in-app browsers start the hero video

    const finish = () => {
      window.scrollTo({ top: 0 });
      open();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    // Failsafe: whatever happens to the animation, the invitation always opens.
    const failsafe = setTimeout(finish, 8000);
    // Each step waits for its animation, but never longer than it should take.
    const step = (animation: { then: (done: () => void) => unknown }, ms: number) =>
      Promise.race([new Promise<void>((done) => void animation.then(done)), wait(ms + 250)]);

    try {
      setPhase(1); // they look down at the seal
      animate("[data-hint]", { opacity: 0, y: 10 }, { duration: 0.5 });
      setBurst(true);
      await step(animate("[data-seal]", { scale: [1, 1.15, 0.2], opacity: [1, 1, 0], rotate: [0, -10, 15] }, { duration: 0.7, ease: silk }), 700);
      await step(animate("[data-flap]", { rotateX: 180 }, { duration: 0.9, ease: [0.65, 0, 0.35, 1] }), 900);
      animate("[data-flap]", { zIndex: 1 }, { duration: 0 });
      setPhase(2); // the letter comes out: he cheers, she melts
      await step(animate("[data-letter]", { y: "-58%" }, { duration: 1.4, ease: silk }), 1400);
      await step(animate("[data-letter-text]", { opacity: 1, filter: "blur(0px)" }, { duration: 0.8 }), 800);
      await wait(700);
      setPhase(3); // they look at each other
      await wait(1500);
    } finally {
      clearTimeout(failsafe);
      finish();
    }
  }

  return (
    <AnimatePresence>
      {opened !== true && (
        <motion.div
          key="envelope"
          ref={scope}
          className="envelope-overlay fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-3"
          style={{
            background:
              "radial-gradient(90% 60% at 50% 0%, #f9d9df 0%, transparent 70%), radial-gradient(70% 50% at 100% 100%, #f3dcd0 0%, transparent 70%), var(--color-paper)",
          }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(14px)" }}
          transition={{ duration: 1.3, ease: silk }}
          role="dialog"
          aria-modal="true"
          aria-label="Wedding invitation"
        >
          <Petals count={10} />

          {/* the scene: Alvin & Rheena holding the invitation */}
          <motion.div
            className="relative mt-6 aspect-[600/620] w-[min(96vw,600px,calc(62svh*0.968))]"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, ease: silk, delay: 0.2 }}
          >
            <CoupleBack phase={phase} />

            <div
              className="absolute z-10 [perspective:1400px]"
              style={{
                left: `${(ENVELOPE_BOX.x / SCENE.w) * 100}%`,
                top: `${(ENVELOPE_BOX.y / SCENE.h) * 100}%`,
                width: `${(ENVELOPE_BOX.w / SCENE.w) * 100}%`,
              }}
            >
              <div className="@container relative aspect-[3/2] w-full">
                <div className="absolute inset-0 rounded-[5px] bg-[#efc6cf] shadow-[0_30px_50px_-24px_rgba(110,40,65,0.5),0_8px_18px_-10px_rgba(110,40,65,0.3)]" />

                <div data-letter className="absolute inset-x-[6%] top-[5%] bottom-[5%] z-[2] overflow-hidden rounded-[3px] bg-card shadow-sm">
                  <div className="absolute inset-[3cqw] border border-gold/40" />
                  <div
                    data-letter-text
                    className="relative flex flex-col items-center pt-[7%] text-center"
                    style={{ opacity: 0.25, filter: "blur(2px)" }}
                  >
                    <p className="font-sans text-[2.8cqw] tracking-[0.3em] text-ink-soft uppercase">The wedding of</p>
                    <p className="mt-[1cqw] font-script text-[9.5cqw] leading-tight text-ink">
                      {wedding.couple.partnerOne} <span className="text-rose">&amp;</span> {wedding.couple.partnerTwo}
                    </p>
                    <p className="mt-[0.5cqw] font-display text-[3.6cqw] tracking-[0.3em] text-ink-soft">{wedding.date.short}</p>
                  </div>
                </div>

                <svg className="absolute inset-0 z-[3] h-full w-full" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden>
                  <defs>
                    <linearGradient id="pocket" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#f8dde2" />
                      <stop offset="1" stopColor="#f3cfd6" />
                    </linearGradient>
                  </defs>
                  <path d="M0 0 L150 112 L0 200 Z" fill="#f4d3da" />
                  <path d="M300 0 L150 112 L300 200 Z" fill="#f2cdd5" />
                  <path d="M0 200 L150 96 L300 200 Z" fill="url(#pocket)" />
                  <path d="M0 200 L150 96 L300 200" fill="none" stroke="rgba(150,60,90,0.12)" strokeWidth="0.8" />
                  {[40, 260].map((x) => (
                    <g key={x} transform={`translate(${x} 178)`} opacity="0.5">
                      {[0, 72, 144, 216, 288].map((r) => (
                        <ellipse key={r} rx="3" ry="6" cy="-5" fill="#e7a9b8" transform={`rotate(${r})`} />
                      ))}
                      <circle r="2.2" fill="#d4a26a" />
                    </g>
                  ))}
                </svg>

                <motion.div data-flap className="absolute inset-x-0 top-0 z-[4] h-[60%] origin-top [transform-style:preserve-3d]" style={{ rotateX: 0 }}>
                  <svg className="h-full w-full drop-shadow-[0_6px_6px_rgba(110,40,65,0.15)]" viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden>
                    <defs>
                      <linearGradient id="flap" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#ecbcc7" />
                        <stop offset="1" stopColor="#f2cad3" />
                      </linearGradient>
                    </defs>
                    <path d="M0 0 L300 0 L150 120 Z" fill="url(#flap)" />
                    <path d="M10 4 L290 4 L150 114 Z" fill="none" stroke="rgba(185,138,88,0.5)" strokeWidth="0.8" />
                  </svg>
                </motion.div>

                {burst && <SealBurst />}

                <motion.button
                  data-seal
                  type="button"
                  onClick={handleOpen}
                  className="absolute top-[60%] left-1/2 z-[5] grid h-[25cqw] w-[25cqw] cursor-pointer place-items-center rounded-full transition-[scale] duration-300 hover:scale-[1.07] active:scale-95"
                  style={{
                    x: "-50%",
                    y: "-50%",
                    background: "radial-gradient(circle at 35% 30%, #c75a7d 0%, #9b3a5c 45%, #6e2340 100%)",
                    boxShadow:
                      "inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -4px 8px rgba(0,0,0,0.28), 0 8px 18px -4px rgba(110,35,64,0.55)",
                    borderRadius: "52% 48% 50% 50% / 50% 52% 48% 50%",
                  }}
                  aria-label="Open the invitation"
                >
                  <span className="absolute inset-[7%] rounded-full border border-white/25" />
                  <span className="font-display text-[7.5cqw] text-[#fbe3ea] italic [text-shadow:0_1px_1px_rgba(0,0,0,0.35)]">
                    {a}
                    <span className="mx-[1px] text-[4.8cqw]">&amp;</span>
                    {b}
                  </span>
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-rose/60"
                    animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                  />
                </motion.button>
              </div>
            </div>

            <CoupleFront phase={phase} />

            <Bubble show={greet && phase === 0} side="right">
              Tara, buksan na natin!
            </Bubble>
            <Bubble show={phase === 3} side="left">
              Kita-kits sa kasal!
            </Bubble>
          </motion.div>

          <motion.div
            data-hint
            className="relative mt-4 text-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: silk }}
          >
            <p className="font-script text-[2.2rem] leading-tight text-ink sm:text-[2.6rem]">{guest ? `Dear ${guest},` : "You are invited"}</p>
            <p className="mt-1 font-display text-base text-ink-soft italic sm:text-lg">
              {guest ? "you’re invited to the wedding of" : "to the wedding of"} {wedding.couple.partnerOne} &amp;{" "}
              {wedding.couple.partnerTwo}
            </p>
            <button
              type="button"
              onClick={handleOpen}
              className="eyebrow mt-5 inline-flex items-center gap-3 !text-[0.65rem] text-ink-faint transition-colors hover:text-ink"
            >
              <span className="h-px w-8 bg-current opacity-50" />
              Tap the seal to open
              <span className="h-px w-8 bg-current opacity-50" />
            </button>
            <p className="mt-2 text-[0.62rem] tracking-[0.2em] text-ink-faint/80 uppercase">♪ best with sound on</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
