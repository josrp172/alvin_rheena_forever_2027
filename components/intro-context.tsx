"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig } from "motion/react";

const OPENED_KEY = "invitation-opened";
const GUEST_KEY = "invitation-guest";
/** Set once a guest has scrolled all the way to the RSVP form; kept across visits. */
const EXPLORED_KEY = "invitation-explored";

type IntroState = {
  /** null until we know on the client whether the envelope should show. */
  opened: boolean | null;
  open: () => void;
  /** Name from a personalised link, e.g. /?to=Tita%20Rosa */
  guest: string | null;
  /** Whether this guest has already been through the whole invitation (null until known). */
  explored: boolean | null;
};

const IntroContext = createContext<IntroState>({ opened: null, open: () => {}, guest: null, explored: null });

export const useIntro = () => useContext(IntroContext);

function cleanName(value: string | null) {
  const v = value?.replace(/\s+/g, " ").trim().slice(0, 60);
  return v ? v : null;
}

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState<boolean | null>(null);
  const [guest, setGuest] = useState<string | null>(null);
  const [explored, setExplored] = useState<boolean | null>(null);

  useEffect(() => {
    let alreadyOpened = false;
    let name: string | null = null;
    let seen = false;
    try {
      seen = Boolean(localStorage.getItem(EXPLORED_KEY) || localStorage.getItem("rsvp-done"));
      alreadyOpened = Boolean(sessionStorage.getItem(OPENED_KEY));
      name = cleanName(new URLSearchParams(location.search).get("to"));
      if (name) sessionStorage.setItem(GUEST_KEY, name);
      else name = cleanName(sessionStorage.getItem(GUEST_KEY));
    } catch {}
    setGuest(name);
    setOpened(alreadyOpened);
    setExplored(seen);
  }, []);

  // First-time guests get the whole story before any shortcuts; reaching the RSVP form unlocks them for next time.
  useEffect(() => {
    if (explored !== false) return;
    const el = document.getElementById("rsvp");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      try {
        localStorage.setItem(EXPLORED_KEY, "1");
      } catch {}
      io.disconnect();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [explored]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = opened === false ? "hidden" : "";
    return () => {
      root.style.overflow = "";
    };
  }, [opened]);

  const open = () => {
    try {
      sessionStorage.setItem(OPENED_KEY, "1");
    } catch {}
    setOpened(true);
  };

  return (
    <IntroContext.Provider value={{ opened, open, guest, explored }}>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </MotionConfig>
    </IntroContext.Provider>
  );
}
