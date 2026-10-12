"use client";

import { AnimatePresence, motion } from "motion/react";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { submitRsvp } from "@/app/actions";
import { wedding } from "@/content/wedding";
import type { RsvpFormState } from "@/lib/rsvp-schema";
import { googleCalendarUrl } from "@/lib/calendar";
import { useIntro } from "./intro-context";
import { Photo } from "./media";
import { Divider } from "./ornaments";
import { Reveal, silk } from "./reveal";

const DONE_KEY = "rsvp-done";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = {
  attending: "" | "yes" | "no";
  fullName: string;
  email: string;
  phone: string;
  partySize: number;
  guestNames: string;
  dietary: string;
  song: string;
  message: string;
  shareNote: boolean;
};

const steps = ["Attendance", "Details", "Extras"];
const fieldStep: Record<string, number> = { attending: 0, fullName: 0, email: 1, phone: 1, partySize: 1, guestNames: 1 };

function Label({ htmlFor, children, optional }: { htmlFor?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="eyebrow block !text-[0.62rem]">
      {children}
      {optional && <span className="ml-2 tracking-normal normal-case italic opacity-70">optional</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          className="mt-2 font-display text-base text-berry italic"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="alert"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Burst() {
  const petals = Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * Math.PI * 2;
    const dist = 110 + (i % 4) * 45;
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 40, r: (i * 47) % 360, c: i % 4 };
  });
  const colors = ["#f6d3da", "#ecd0a7", "#e3a3b4", "#cf6f8c"];
  return (
    <div aria-hidden className="pointer-events-none absolute top-24 left-1/2">
      {petals.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block h-3 w-2.5 rounded-[80%_0_80%_0]"
          style={{ background: colors[p.c] }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 160], opacity: [1, 1, 0], scale: 1, rotate: p.r + 220 }}
          transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1], times: [0, 0.45, 1] }}
        />
      ))}
    </div>
  );
}

function Success({ state, onReset }: { state: Extract<RsvpFormState, { status: "success" }>; onReset: () => void }) {
  return (
    <motion.div
      key="success"
      className="relative py-6 text-center"
      initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: silk }}
    >
      {state.attending && <Burst />}
      <svg viewBox="0 0 80 80" className="mx-auto h-20 w-20" fill="none" aria-hidden>
        <motion.circle cx="40" cy="40" r="36" stroke="var(--color-rose)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
        <motion.path
          d="M40 56s-14-8.6-14-19a7.8 7.8 0 0 1 14-4.7A7.8 7.8 0 0 1 54 37c0 10.4-14 19-14 19z"
          stroke="var(--color-berry)"
          strokeWidth="1.3"
          fill="var(--color-rose)"
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: 0.7 }}
          transition={{ pathLength: { delay: 0.7, duration: 1.2 }, fillOpacity: { delay: 1.6, duration: 0.8 } }}
        />
      </svg>

      <p className="mt-6 font-script text-5xl text-ink sm:text-6xl">Thank you, {state.firstName}</p>
      <p className="mx-auto mt-5 max-w-md font-display text-[1.3rem] leading-relaxed text-ink-soft">
        {state.attending
          ? "Your seat is saved and our hearts are full. We can’t wait to hug you, dance with you, and make memories together."
          : "You’ll be dearly missed. Thank you for letting us know — we’ll be thinking of you on the day."}
      </p>
      {state.updated && <p className="mt-3 font-display text-base text-ink-faint italic">We’ve updated your previous response.</p>}

      {state.attending && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-berry px-6 py-3 text-[0.66rem] tracking-[0.24em] text-white uppercase transition-colors hover:bg-ink">
            Add to Google Calendar
          </a>
          <a href="/calendar" className="rounded-full border border-ink/25 px-6 py-3 text-[0.66rem] tracking-[0.24em] text-ink uppercase transition-colors hover:border-ink">
            Apple · Outlook
          </a>
        </div>
      )}

      <button type="button" onClick={onReset} className="mt-10 font-display text-base text-ink-faint italic underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink">
        Need to change something? Update your RSVP
      </button>
    </motion.div>
  );
}

export function Rsvp() {
  const { guest } = useIntro();
  const [state, formAction, pending] = useActionState<RsvpFormState, FormData>(submitRsvp, { status: "idle" });
  const max = wedding.rsvp.maxPartySize;
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [showForm, setShowForm] = useState(true);
  const [previous, setPrevious] = useState<string | null>(null);
  const [local, setLocal] = useState<Record<string, string>>({});
  const honeypot = useRef<HTMLInputElement>(null);
  const [v, setV] = useState<Values>({
    attending: "",
    fullName: "",
    email: "",
    phone: "",
    partySize: 1,
    guestNames: "",
    dietary: "",
    song: "",
    message: "",
    shareNote: true,
  });

  const set = <K extends keyof Values>(k: K, value: Values[K]) => {
    setV((s) => ({ ...s, [k]: value }));
    setLocal((e) => ({ ...e, [k]: "" }));
  };

  useEffect(() => {
    if (guest) setV((s) => (s.fullName ? s : { ...s, fullName: guest }));
  }, [guest]);

  useEffect(() => {
    try {
      setPrevious(localStorage.getItem(DONE_KEY));
    } catch {}
  }, []);

  const serverErrors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const errors: Record<string, string | undefined> = { ...serverErrors, ...Object.fromEntries(Object.entries(local).filter(([, m]) => m)) };

  useEffect(() => {
    if (state.status === "success") {
      setShowForm(false);
      try {
        localStorage.setItem(DONE_KEY, state.firstName);
      } catch {}
      document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (state.status === "error" && state.fieldErrors) {
      const first = Object.keys(state.fieldErrors).map((k) => fieldStep[k] ?? 2);
      if (first.length) setStep(Math.min(...first));
    }
  }, [state]);

  function validate(s: number) {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!v.attending) e.attending = "Will you be joining us?";
      if (v.fullName.trim().length < 2) e.fullName = "Please tell us your name.";
    }
    if (s === 1 && !EMAIL.test(v.email.trim())) e.email = "That email doesn’t look quite right.";
    setLocal(e);
    return Object.keys(e).length === 0;
  }

  const go = (to: number) => {
    if (to > step && !validate(step)) return;
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 2) return go(step + 1);
    if (!validate(0) || !validate(1)) return;
    const fd = new FormData();
    Object.entries(v).forEach(([k, val]) => {
      if (k === "shareNote") {
        if (val) fd.set(k, "on");
      } else fd.set(k, String(val));
    });
    fd.set("website", honeypot.current?.value ?? "");
    startTransition(() => formAction(fd));
  }

  const yes = v.attending === "yes";

  return (
    <section id="rsvp" className="relative overflow-hidden bg-wine px-4 py-24 text-white sm:px-5 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-25">
          <Photo src="/photos/hk1.a19af93f.jpg" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-wine via-wine/85 to-wine" />
        <div className="aurora absolute -top-1/4 left-1/2 h-[90vh] w-[90vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(207,111,140,0.35)_0%,transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="text-[0.66rem] tracking-[0.42em] text-blush uppercase">Répondez s’il vous plaît</p>
          <h2 className="mt-5 font-script text-[3.8rem] leading-none sm:text-[5.5rem]">Will you join us?</h2>
          <div className="mt-6 flex justify-center">
            <Divider tone="var(--color-rose-soft)" />
          </div>
          <p className="mt-5 font-display text-xl text-white/75 italic">
            Kindly respond by <span className="text-blush not-italic">{wedding.rsvp.deadline}</span>
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="relative mx-auto mt-14 max-w-2xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-card px-6 py-10 text-ink shadow-[0_50px_100px_-40px_rgba(0,0,0,0.7)] sm:px-14 sm:py-14">
          <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[1.6rem] border border-rose/25" />

          <AnimatePresence mode="wait" initial={false}>
            {showForm || state.status !== "success" ? (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                className="relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: silk }}
                noValidate
              >
                {previous && (
                  <p className="mb-6 text-center font-display text-base text-ink-soft italic">
                    Welcome back, {previous}! Submit again with the same email to update your RSVP.
                  </p>
                )}

                {/* progress */}
                <ol className="relative mb-10 flex justify-between" aria-label="RSVP steps">
                  <span aria-hidden className="absolute top-4 right-8 left-8 h-px bg-blush" />
                  <motion.span
                    aria-hidden
                    className="absolute top-4 left-8 h-px origin-left bg-berry"
                    style={{ right: "2rem" }}
                    animate={{ scaleX: step / (steps.length - 1) }}
                    transition={{ duration: 0.6, ease: silk }}
                  />
                  {steps.map((label, i) => (
                    <li key={label} className="relative flex w-16 flex-col items-center">
                      <motion.button
                        type="button"
                        onClick={() => (i < step ? go(i) : undefined)}
                        className="grid h-8 w-8 place-items-center rounded-full border font-display text-sm"
                        animate={{
                          backgroundColor: i <= step ? "#9b3a5c" : "#fffafa",
                          borderColor: i <= step ? "#9b3a5c" : "#f6d3da",
                          color: i <= step ? "#ffffff" : "#a98b95",
                          scale: i === step ? 1.12 : 1,
                        }}
                        aria-current={i === step ? "step" : undefined}
                        aria-label={`Step ${i + 1}: ${label}`}
                      >
                        {i < step ? "✓" : i + 1}
                      </motion.button>
                      <span className={`mt-2 text-[0.55rem] tracking-[0.2em] uppercase ${i === step ? "text-berry" : "text-ink-faint"}`}>{label}</span>
                    </li>
                  ))}
                </ol>

                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Website <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <AnimatePresence mode="wait" custom={dir} initial={false}>
                  <motion.div
                    key={step}
                    custom={dir}
                    className="space-y-8"
                    variants={{
                      enter: (d: number) => ({ opacity: 0, x: d * 40, filter: "blur(6px)" }),
                      center: { opacity: 1, x: 0, filter: "blur(0px)" },
                      exit: (d: number) => ({ opacity: 0, x: d * -40, filter: "blur(6px)" }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: silk }}
                  >
                    {step === 0 && (
                      <>
                        <fieldset>
                          <legend className="sr-only">Will you attend?</legend>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {(
                              [
                                { val: "yes", title: "Joyfully accepts", sub: "I wouldn’t miss it", icon: "♥" },
                                { val: "no", title: "Regretfully declines", sub: "Celebrating from afar", icon: "✉" },
                              ] as const
                            ).map((o) => {
                              const selected = v.attending === o.val;
                              return (
                                <label
                                  key={o.val}
                                  className={`relative cursor-pointer overflow-hidden rounded-2xl border px-5 py-6 text-center transition-colors duration-500 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rose ${
                                    selected ? "border-berry text-white" : "border-blush hover:border-rose"
                                  }`}
                                >
                                  <input type="radio" name="attending" value={o.val} checked={selected} onChange={() => set("attending", o.val)} className="sr-only" />
                                  {selected && (
                                    <motion.span layoutId="attending-bg" className="absolute inset-0 bg-gradient-to-br from-berry to-rose" transition={{ type: "spring", stiffness: 260, damping: 30 }} />
                                  )}
                                  <span className={`relative block text-2xl ${selected ? "text-white" : "text-rose"}`}>{o.icon}</span>
                                  <span className="relative mt-1 block font-display text-[1.45rem]">{o.title}</span>
                                  <span className={`relative mt-1 block font-display text-base italic ${selected ? "text-white/85" : "text-ink-soft"}`}>{o.sub}</span>
                                </label>
                              );
                            })}
                          </div>
                          <FieldError message={errors.attending} />
                        </fieldset>
                        <div>
                          <Label htmlFor="fullName">Your full name</Label>
                          <input
                            id="fullName"
                            className="field"
                            autoComplete="name"
                            value={v.fullName}
                            onChange={(e) => set("fullName", e.target.value)}
                            placeholder="Juan Dela Cruz"
                            aria-invalid={Boolean(errors.fullName)}
                          />
                          <FieldError message={errors.fullName} />
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <div className="grid gap-8 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <input
                              id="email"
                              type="email"
                              inputMode="email"
                              autoComplete="email"
                              className="field"
                              value={v.email}
                              onChange={(e) => set("email", e.target.value)}
                              placeholder="you@example.com"
                              aria-invalid={Boolean(errors.email)}
                            />
                            <FieldError message={errors.email} />
                          </div>
                          <div>
                            <Label htmlFor="phone" optional>
                              Mobile
                            </Label>
                            <input id="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" value={v.phone} onChange={(e) => set("phone", e.target.value)} placeholder="0917 123 4567" />
                          </div>
                        </div>

                        {yes && max > 1 && (
                          <fieldset>
                            <legend className="eyebrow !text-[0.62rem]">How many in your party, including you?</legend>
                            <div className="mt-4 flex gap-3">
                              {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                                <label
                                  key={n}
                                  className={`grid h-12 w-12 cursor-pointer place-items-center rounded-full border font-display text-xl transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rose ${
                                    v.partySize === n ? "border-berry bg-berry text-white" : "border-blush hover:border-rose"
                                  }`}
                                >
                                  <input type="radio" name="partySize" value={n} checked={v.partySize === n} onChange={() => set("partySize", n)} className="sr-only" />
                                  {n}
                                </label>
                              ))}
                            </div>
                            <p className="mt-3 font-display text-base text-ink-faint italic">We’ve lovingly reserved up to {max} seats per invitation.</p>
                          </fieldset>
                        )}

                        <AnimatePresence initial={false}>
                          {yes && v.partySize > 1 && (
                            <motion.div
                              className="overflow-hidden"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.5, ease: silk }}
                            >
                              <Label htmlFor="guestNames">Name of your guest{v.partySize > 2 ? "s" : ""}</Label>
                              <input id="guestNames" className="field" value={v.guestNames} onChange={(e) => set("guestNames", e.target.value)} placeholder="Maria Clara" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        {yes && (
                          <div className="grid gap-8 sm:grid-cols-2">
                            <div>
                              <Label htmlFor="dietary" optional>
                                Dietary needs
                              </Label>
                              <input id="dietary" className="field" value={v.dietary} onChange={(e) => set("dietary", e.target.value)} placeholder="Vegetarian, no shellfish…" />
                            </div>
                            <div>
                              <Label htmlFor="song" optional>
                                Song request
                              </Label>
                              <input id="song" className="field" value={v.song} onChange={(e) => set("song", e.target.value)} placeholder="September — EWF" />
                            </div>
                          </div>
                        )}
                        <div>
                          <Label htmlFor="message" optional>
                            A note for the couple
                          </Label>
                          <textarea
                            id="message"
                            rows={3}
                            className="field"
                            value={v.message}
                            onChange={(e) => set("message", e.target.value)}
                            placeholder="Words of love, advice, or a memory we share…"
                          />
                        </div>
                        <label className="flex cursor-pointer items-center gap-3">
                          <input type="checkbox" checked={v.shareNote} onChange={(e) => set("shareNote", e.target.checked)} className="peer sr-only" />
                          <span className="relative h-6 w-11 shrink-0 rounded-full bg-blush transition-colors peer-checked:bg-berry peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose">
                            <motion.span className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow" animate={{ x: v.shareNote ? 20 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} />
                          </span>
                          <span className="font-display text-base text-ink-soft">Share my note on the wishes wall</span>
                        </label>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                  {state.status === "error" && (
                    <motion.p className="mt-6 text-center font-display text-lg text-berry italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="alert">
                      {state.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="mt-10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => go(step - 1)}
                    className={`rounded-full px-5 py-3 text-[0.66rem] tracking-[0.24em] text-ink-soft uppercase transition-opacity hover:text-ink ${step === 0 ? "pointer-events-none opacity-0" : ""}`}
                  >
                    ← Back
                  </button>
                  <motion.button
                    type="submit"
                    disabled={pending}
                    className="relative inline-flex min-w-[12rem] items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-berry to-rose px-8 py-4 text-[0.7rem] tracking-[0.28em] text-white uppercase shadow-[0_14px_30px_-12px_rgba(155,58,92,0.7)] disabled:opacity-80"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={pending ? "p" : step}
                        className="inline-flex items-center gap-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        {pending && (
                          <motion.span
                            className="h-3.5 w-3.5 rounded-full border border-white/30 border-t-white"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        {pending ? "Sealing with love" : step < 2 ? "Continue →" : "Send my RSVP"}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <Success
                state={state}
                onReset={() => {
                  setShowForm(true);
                  setStep(0);
                  setPrevious(state.firstName);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
