"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { wedding } from "@/content/wedding";
import { useIntro } from "./intro-context";
import { Countdown } from "./countdown";
import { LazyVideo, posterFor } from "./media";
import { Petals } from "./petals";
import { silk } from "./reveal";

function Name({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="inline-block" aria-hidden>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: "0.4em", rotateX: -70, filter: "blur(14px)" },
            show: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: "blur(0px)",
              transition: { duration: 1.5, delay: delay + i * 0.07, ease: silk },
            },
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

const fade = (delay: number, y = 16) => ({
  hidden: { opacity: 0, y, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.3, delay, ease: silk } },
});

export function Hero() {
  const { opened, explored } = useIntro();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const play = opened === true;
  const { partnerOne, partnerTwo } = wedding.couple;

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] bg-wine">
      {/* fetch the first frame right away so the hero is never blank */}
      <link rel="preload" as="image" href={posterFor(wedding.media.hero.portrait)} media="(max-width: 1023px)" />
      <link rel="preload" as="image" href={posterFor(wedding.media.hero.src)} media="(min-width: 1024px)" />
      <motion.div className="absolute inset-0 overflow-hidden" style={{ borderBottomLeftRadius: radius, borderBottomRightRadius: radius }}>
        <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
          <LazyVideo
            src={wedding.media.hero.src}
            portraitSrc={wedding.media.hero.portrait}
            portraitQuery="(max-width: 1023px)"
            eager
            hint={false}
            className="h-full w-full object-cover"
          />
        </motion.div>
        {/* rosy colour grade + vignette */}
        <div aria-hidden className="absolute inset-0 bg-[#e98aa5]/25 mix-blend-soft-light" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(47,21,32,0.55) 0%, rgba(47,21,32,0.15) 35%, rgba(47,21,32,0.25) 60%, rgba(47,21,32,0.8) 100%), radial-gradient(120% 90% at 50% 50%, transparent 50%, rgba(47,21,32,0.55) 100%)",
          }}
        />
        <div aria-hidden className="absolute top-1/2 left-1/2 h-[90vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(47,21,32,0.55),transparent)] sm:w-[70vw] lg:left-[28%] lg:w-[60vw]" />
        <Petals count={16} />
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-5 pt-16 text-center text-white [perspective:800px] lg:items-start lg:pr-[50%] lg:pl-[7vw] lg:text-left"
        initial="hidden"
        animate={play ? "show" : "hidden"}
      >
        <motion.p variants={fade(0.3)} className="text-[0.62rem] tracking-[0.42em] text-white/85 uppercase sm:text-[0.7rem]">
          Together with their families
        </motion.p>

        <h1 className="mt-5 font-display leading-[0.9] font-light [text-shadow:0_4px_40px_rgba(47,21,32,0.45)]">
          <span className="sr-only">
            {partnerOne} and {partnerTwo}
          </span>
          <span className="block text-[clamp(3.8rem,18vw,10rem)]">
            <Name text={partnerOne} delay={0.6} />
          </span>
          <motion.span
            aria-hidden
            variants={{
              hidden: { opacity: 0, scale: 0.5, rotate: -20 },
              show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.6, delay: 1.2, ease: silk } },
            }}
            className="-my-2 block font-script text-[clamp(3rem,12vw,6rem)] leading-none text-blush"
          >
            &amp;
          </motion.span>
          <span className="block text-[clamp(3.8rem,18vw,10rem)]">
            <Name text={partnerTwo} delay={1.4} />
          </span>
        </h1>

        <motion.div variants={fade(2.2)} className="mt-6 flex items-center gap-3 sm:gap-5 lg:flex-row-reverse lg:justify-end">
          <motion.span
            className="h-px w-8 origin-right bg-white/60 sm:w-16"
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.4, delay: 2.3, ease: silk } } }}
          />
          <p className="font-display text-base tracking-[0.18em] uppercase sm:text-xl">
            {wedding.date.short} <span className="text-blush">·</span> {wedding.date.city.split(",")[0]}
          </p>
          <motion.span
            className="h-px w-8 origin-left bg-white/60 sm:w-16"
            variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.4, delay: 2.3, ease: silk } } }}
          />
        </motion.div>

        <motion.div variants={fade(2.6)} className="mt-8 lg:[&>div]:justify-start">
          <Countdown />
        </motion.div>

        <motion.div variants={fade(2.9)} className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
          {explored ? (
            <>
              <a
                href="#rsvp"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-7 py-3.5 text-[0.68rem] tracking-[0.28em] text-ink uppercase shadow-[0_10px_40px_-10px_rgba(207,111,140,0.8)] sm:px-9 sm:py-4"
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-white">Kindly RSVP</span>
                <span className="absolute inset-0 translate-y-full rounded-full bg-berry transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-y-0" />
              </a>
              <a
                href="#film"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-[0.68rem] tracking-[0.28em] uppercase backdrop-blur-md transition-colors duration-500 hover:bg-white/20 sm:px-8 sm:py-4"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[0.5rem] text-berry">▶</span>
                Our film
              </a>
            </>
          ) : (
            <a
              href="#letter"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-7 py-3.5 text-[0.68rem] tracking-[0.28em] text-ink uppercase shadow-[0_10px_40px_-10px_rgba(207,111,140,0.8)] sm:px-9 sm:py-4"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-white">Begin our story</span>
              <span aria-hidden className="relative z-10 text-berry transition-colors duration-500 group-hover:text-white">↓</span>
              <span className="absolute inset-0 translate-y-full rounded-full bg-berry transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-y-0" />
            </a>
          )}
        </motion.div>
      </motion.div>

      <motion.a
        href="#letter"
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: play ? 1 : 0 }}
        transition={{ delay: 3.6, duration: 1.2 }}
      >
        <span className="text-[0.55rem] tracking-[0.35em] uppercase opacity-80">Scroll</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/25">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-white"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
