"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { wedding } from "@/content/wedding";
import { Photo } from "./media";
import { Monogram } from "./ornaments";
import { Reveal, WordReveal } from "./reveal";

export function Footer() {
  const [copied, setCopied] = useState(false);
  const { couple, footer, date } = wedding;

  async function copyHashtag() {
    try {
      await navigator.clipboard.writeText(couple.hashtag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <footer className="relative overflow-hidden bg-wine px-5 pt-28 pb-[max(3rem,env(safe-area-inset-bottom))] text-center text-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Photo src="/photos/hk4.b8e94677.jpg" alt="" sizes="100vw" className="h-full w-full object-cover object-[50%_30%] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-wine via-wine/70 to-wine" />
      </div>
      <Reveal className="relative flex justify-center">
        <div className="rounded-full bg-paper p-1">
          <Monogram size={88} />
        </div>
      </Reveal>

      <p className="relative mx-auto mt-10 max-w-xl font-display text-[2rem] leading-snug font-light text-paper sm:text-[2.6rem]">
        <WordReveal text={footer.closing} />
      </p>

      <Reveal delay={0.2} className="relative mt-10">
        <p className="eyebrow !text-paper/50">Share your moments</p>
        <button
          type="button"
          onClick={copyHashtag}
          className="group relative mt-3 inline-flex items-center gap-3 font-display text-2xl text-gold-soft italic sm:text-3xl"
          aria-label={`Copy hashtag ${couple.hashtag}`}
        >
          {couple.hashtag}
          <span className="relative inline-block w-14 text-left font-sans text-[0.6rem] tracking-[0.2em] text-paper/50 not-italic uppercase">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "copied" : "copy"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="block"
              >
                {copied ? "Copied" : "Copy"}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>
      </Reveal>

      <Reveal delay={0.3} className="relative mt-14">
        <p className="bg-gradient-to-r from-blush via-white to-gold-soft bg-clip-text font-script text-6xl text-transparent sm:text-8xl">
          {couple.partnerOne} <span className="text-gold-soft">&amp;</span> {couple.partnerTwo}
        </p>
        <p className="eyebrow mt-4 !text-paper/55">
          {date.short} · {date.city}
        </p>
        <p className="mt-8 font-display text-base text-paper/55 italic">{footer.contact}</p>
      </Reveal>

      <a
        href="#top"
        className="eyebrow relative mt-14 inline-flex items-center gap-3 !text-[0.6rem] !text-paper/45 transition-colors hover:!text-gold-soft"
      >
        <span aria-hidden>↑</span> Back to the beginning
      </a>

      <p className="relative mx-auto mt-12 max-w-xs border-t border-paper/10 pt-6 font-display text-sm text-paper/40 italic">
        Made with <span className="text-gold-soft not-italic" aria-label="love">♥</span> by {footer.madeBy}
      </p>
    </footer>
  );
}
