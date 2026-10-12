"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { wedding } from "@/content/wedding";

const highlight = new Set(["home"]);

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  const special = highlight.has(word.toLowerCase());
  return (
    <motion.span
      style={{ opacity, y }}
      className={`mr-[0.25em] inline-block ${special ? "font-script text-[1.25em] leading-none text-rose" : ""}`}
    >
      {word}
    </motion.span>
  );
}

/** A line of text that writes itself in as you scroll through it. */
export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = wedding.manifesto.split(" ");
  const bylineOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);

  return (
    <section className="relative overflow-x-clip px-5 py-28 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#f8cfd8_0%,transparent_60%)] opacity-70"
      />
      <div ref={ref} className="relative mx-auto max-w-5xl">
        <p className="text-center font-display text-[2.1rem] leading-[1.25] font-light text-ink sm:text-[3.6rem] lg:text-[4.2rem]">
          <span className="sr-only">{wedding.manifesto}</span>
          <span aria-hidden>
            {words.map((w, i) => (
              <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
            ))}
          </span>
        </p>
        <motion.p
          className="mt-8 text-center text-[0.65rem] tracking-[0.35em] text-ink-soft uppercase"
          style={{ opacity: bylineOpacity }}
        >
          {wedding.manifestoBy}
        </motion.p>
      </div>
    </section>
  );
}
