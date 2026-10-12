"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Illustrated Alvin & Rheena in their Hong Kong proposal outfits, holding the
 * invitation between them. Drawn in a 600×620 scene; the envelope sits at
 * x 150–450, y 260–460 (see ENVELOPE_BOX). `phase`: 0 waiting · 1 opening ·
 * 2 letter out (celebrate) · 3 goodbye.
 */

export const SCENE = { w: 600, h: 620 };
export const ENVELOPE_BOX = { x: 150, y: 260, w: 300, h: 200 };

const SKIN_A = "#e0ad86";
const SKIN_A_SHADE = "#c98f6a";
const SKIN_R = "#e9bb98";
const SKIN_R_SHADE = "#d49d7b";
const HAIR = "#1d1719";
const HAIR_HI = "#3a2c30";
const WHITE = "#fbfaf7";
const WHITE_SHADE = "#e7e2da";

type Look = { x: number; y: number };

/** Pupils (and heads, a little) follow the guest's pointer. */
function usePointerLook(enabled: boolean): Look {
  const [look, setLook] = useState<Look>({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setLook({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);
  return look;
}

/** Joint position as a fraction of the part's own bounding box (how Motion pivots SVG). */
const pivot = (originX: number, originY: number) => ({ originX, originY });

function Eye({ cx, cy, gaze, delay, lash }: { cx: number; cy: number; gaze: Look; delay: number; lash?: boolean }) {
  return (
    <motion.g
      style={pivot(0.5, 0.6)}
      animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
      transition={{ duration: 4.2, times: [0, 0.9, 0.93, 0.96, 1], repeat: Infinity, delay }}
    >
      <motion.g animate={{ x: gaze.x * 2.2, y: gaze.y * 1.6 }} transition={{ type: "spring", stiffness: 120, damping: 14 }}>
        <ellipse cx={cx} cy={cy} rx={3.3} ry={4.1} fill="#241b1e" />
        <circle cx={cx + 1.1} cy={cy - 1.4} r={1.1} fill="#fff" opacity={0.9} />
      </motion.g>
      {lash && <path d={`M${cx - 5} ${cy - 3.5} q5 -4.5 10 -1`} stroke="#241b1e" strokeWidth={1.6} fill="none" strokeLinecap="round" />}
    </motion.g>
  );
}

function Alvin({ phase, gaze }: { phase: number; gaze: Look }) {
  const headTilt = phase === 1 ? 7 : phase === 2 ? -4 : phase === 3 ? 9 : gaze.x * 3;
  const armUp = phase === 2;
  const eyes = phase === 1 ? { x: 0.8, y: 1 } : phase === 2 ? { x: 0.6, y: -1 } : phase === 3 ? { x: 1, y: 0 } : gaze;
  return (
    <motion.g animate={{ y: [0, -1.6, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}>
      {/* legs: black trousers, white sneakers */}
      <path d="M106 398 L102 586 L127 586 L135 452 L141 586 L166 586 L164 398 Z" fill="#26222a" />
      <path d="M135 452 L135 560" stroke="#3a343f" strokeWidth={1.2} />
      <ellipse cx={114} cy={589} rx={17} ry={6.5} fill={WHITE} stroke="#d9d4cc" />
      <ellipse cx={154} cy={589} rx={17} ry={6.5} fill={WHITE} stroke="#d9d4cc" />

      {/* inner arm reaching to the envelope's left edge (mostly hidden behind it) */}
      <path d="M176 226 Q196 268 170 334 L156 344 L148 332 Q170 276 166 232 Z" fill={SKIN_A} />

      {/* neck, tucked under the collar */}
      <path d="M125 138 L145 138 L148 180 L122 180 Z" fill={SKIN_A_SHADE} />

      {/* white polo */}
      <path d="M92 180 Q135 163 178 180 L184 302 Q186 362 176 406 L94 406 Q84 362 86 302 Z" fill={WHITE} />
      <path d="M92 180 Q135 163 178 180 L184 302 Q186 362 176 406 L94 406 Q84 362 86 302 Z" fill="url(#fabric)" />
      <path d="M178 180 Q198 190 202 232 L176 238 Z" fill={WHITE} stroke={WHITE_SHADE} />
      <path d="M135 168 L135 222" stroke={WHITE_SHADE} strokeWidth={2} />
      <circle cx={135} cy={192} r={1.8} fill="#cfc8bd" />
      <circle cx={135} cy={208} r={1.8} fill="#cfc8bd" />
      <path d="M118 166 L135 186 L126 194 L112 176 Z M152 166 L135 186 L144 194 L158 176 Z" fill={WHITE} stroke={WHITE_SHADE} strokeWidth={1.2} />

      {/* outer arm: hangs, then cheers when the letter comes out */}
      <motion.g style={pivot(0.85, 0.03)} animate={{ rotate: armUp ? 156 : 4 }} transition={{ type: "spring", stiffness: 110, damping: 12 }}>
        <path d="M92 180 Q72 190 68 232 L94 238 Z" fill={WHITE} stroke={WHITE_SHADE} />
        <path d="M72 230 Q68 282 73 326 L89 326 Q93 282 93 236 Z" fill={SKIN_A} />
        <rect x={71} y={306} width={19} height={8} rx={2} fill="#2b2b2f" />
        <ellipse cx={81} cy={334} rx={10} ry={11} fill={SKIN_A} />
      </motion.g>

      {/* head */}
      <motion.g style={pivot(0.5, 0.95)} animate={{ rotate: headTilt }} transition={{ type: "spring", stiffness: 80, damping: 12 }}>
        <ellipse cx={100} cy={110} rx={6} ry={9} fill={SKIN_A} />
        <ellipse cx={170} cy={110} rx={6} ry={9} fill={SKIN_A} />
        <path d="M101 100 Q101 60 135 58 Q169 60 169 100 Q170 138 135 156 Q100 138 101 100 Z" fill={SKIN_A} />
        {/* swept-up black hair */}
        <path d="M98 106 Q92 60 120 44 Q148 30 172 50 Q184 70 172 100 Q168 80 158 72 Q138 82 112 76 Q104 88 102 106 Z" fill={HAIR} />
        <path d="M112 50 Q138 22 172 38 Q156 38 146 50 Q128 42 112 50 Z" fill={HAIR} />
        <path d="M122 46 Q140 34 160 40" stroke={HAIR_HI} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M113 95 q8 -4 16 -1 M141 94 q8 -3 16 1" stroke={HAIR} strokeWidth={3.2} fill="none" strokeLinecap="round" />
        <Eye cx={122} cy={108} gaze={eyes} delay={0.3} />
        <Eye cx={148} cy={108} gaze={eyes} delay={0.3} />
        <path d="M135 110 q-4 9 1 13" stroke={SKIN_A_SHADE} strokeWidth={2} fill="none" strokeLinecap="round" />
        <ellipse cx={116} cy={124} rx={7} ry={4} fill="#e98e8e" opacity={0.35} />
        <ellipse cx={154} cy={124} rx={7} ry={4} fill="#e98e8e" opacity={0.35} />
        {phase >= 2 ? (
          <path d="M123 129 Q135 145 147 129 Q135 134 123 129 Z" fill="#8c3b3f" stroke="#7a2f34" strokeWidth={1} />
        ) : (
          <path d="M124 131 Q135 140 146 131" stroke="#8c3b3f" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        )}
      </motion.g>
    </motion.g>
  );
}

function Rheena({ phase, gaze }: { phase: number; gaze: Look }) {
  const headTilt = phase === 1 ? -7 : phase === 2 ? 4 : phase === 3 ? -9 : gaze.x * 3;
  const cheek = phase === 2 || phase === 3;
  const eyes = phase === 1 ? { x: -0.8, y: 1 } : phase === 2 ? { x: -0.6, y: -1 } : phase === 3 ? { x: -1, y: 0 } : gaze;
  return (
    <motion.g animate={{ y: [0, -1.4, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}>
      {/* long hair behind */}
      <motion.path
        d="M430 112 Q428 76 465 72 Q502 76 500 114 L512 292 Q492 304 480 282 L470 182 L460 182 L450 282 Q438 304 418 292 Z"
        fill={HAIR}
        style={pivot(0.5, 0.1)}
        animate={{ skewX: [-1.2, 1.2, -1.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* long flowy skirt */}
      <path d="M440 330 Q465 322 490 330 Q522 452 542 590 Q465 606 388 590 Q408 452 440 330 Z" fill="#f2f4fa" />
      <path d="M440 330 Q465 322 490 330 Q522 452 542 590 Q465 606 388 590 Q408 452 440 330 Z" fill="url(#fabric)" />
      <path d="M452 338 Q438 470 420 594 M466 336 Q466 470 466 600 M480 338 Q496 470 514 594" stroke="#dfe4ee" strokeWidth={1.6} fill="none" />
      <ellipse cx={450} cy={600} rx={13} ry={5} fill={WHITE} stroke="#d9d4cc" />
      <ellipse cx={482} cy={600} rx={13} ry={5} fill={WHITE} stroke="#d9d4cc" />

      {/* inner arm to the envelope's right edge */}
      <path d="M434 236 Q422 276 440 334 L452 344 L458 330 Q440 276 446 238 Z" fill={SKIN_R} />

      {/* neck */}
      <path d="M457 158 L473 158 L476 212 L454 212 Z" fill={SKIN_R_SHADE} />

      {/* off-shoulder ruffle top */}
      <path d="M428 230 Q440 206 465 205 Q490 206 502 230 Z" fill={SKIN_R} />
      <path d="M442 232 L488 232 L492 334 Q465 340 438 334 Z" fill={WHITE} />
      <path d="M442 232 L488 232 L492 334 Q465 340 438 334 Z" fill="url(#fabric)" />
      <path d="M438 330 q7 9 14 0 q7 9 14 0 q7 9 14 0 q7 9 14 0 L492 336 Q465 344 438 336 Z" fill={WHITE} stroke={WHITE_SHADE} />
      <path d="M424 228 q8 11 16 0 q8 11 16 0 q8 11 16 0 q8 11 16 0 q8 11 16 0 L506 242 q-8 12 -16 2 q-8 12 -16 2 q-8 12 -16 2 q-8 12 -16 2 q-8 12 -16 2 Z" fill={WHITE} stroke={WHITE_SHADE} />
      <path d="M452 206 L448 228 M478 206 L482 228" stroke={WHITE_SHADE} strokeWidth={1.2} />

      {/* head */}
      <motion.g style={pivot(0.5, 0.6)} animate={{ rotate: headTilt }} transition={{ type: "spring", stiffness: 80, damping: 12 }}>
        <path d="M435 122 Q435 88 465 86 Q495 88 495 122 Q496 158 465 170 Q434 158 435 122 Z" fill={SKIN_R} />
        {/* side-parted front hair framing her face */}
        <path d="M433 126 Q430 82 466 78 Q502 80 498 124 Q494 96 474 90 Q454 102 442 130 Z" fill={HAIR} />
        <path d="M434 120 Q426 172 432 236 L443 232 Q440 172 444 132 Z" fill={HAIR} />
        <path d="M497 116 Q505 172 499 238 L488 234 Q491 172 487 126 Z" fill={HAIR} />
        <path d="M452 84 Q472 80 488 92" stroke={HAIR_HI} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d="M445 119 q7 -3 13 0 M472 119 q7 -3 13 0" stroke={HAIR} strokeWidth={2} fill="none" strokeLinecap="round" />
        <Eye cx={452} cy={130} gaze={eyes} delay={1.1} lash />
        <Eye cx={478} cy={130} gaze={eyes} delay={1.1} lash />
        <path d="M465 132 q-3 8 1 11" stroke={SKIN_R_SHADE} strokeWidth={1.8} fill="none" strokeLinecap="round" />
        <ellipse cx={446} cy={145} rx={7} ry={4} fill="#ef8d9a" opacity={cheek ? 0.65 : 0.4} />
        <ellipse cx={484} cy={145} rx={7} ry={4} fill="#ef8d9a" opacity={cheek ? 0.65 : 0.4} />
        {phase >= 2 ? (
          <path d="M455 151 Q465 165 475 151 Q465 156 455 151 Z" fill="#b8505f" stroke="#a3404f" strokeWidth={1} />
        ) : (
          <path d="M456 153 Q465 160 474 153" stroke="#b8505f" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        )}
      </motion.g>

      {/* outer arm with the ring: hangs, then hand to cheek — kilig */}
      <motion.g style={pivot(0.2, 0.02)} animate={{ rotate: cheek ? 172 : -4 }} transition={{ type: "spring", stiffness: 90, damping: 13 }}>
        <path d="M494 236 Q512 282 507 326 L521 326 Q524 282 508 234 Z" fill={SKIN_R} />
        <rect x={505} y={306} width={15} height={7} rx={2} fill="#d4a26a" />
        <ellipse cx={514} cy={334} rx={9} ry={10} fill={SKIN_R} />
        <circle cx={509} cy={340} r={2.6} fill="none" stroke="#e8e2d0" strokeWidth={1.4} />
        <AnimatePresence>
          {cheek && (
            <motion.path
              d="M509 331 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 Z"
              fill="#fff"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.6, 1], opacity: [0, 1, 0.9], rotate: 45 }}
              exit={{ opacity: 0 }}
              style={pivot(0.5, 0.5)}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          )}
        </AnimatePresence>
      </motion.g>
    </motion.g>
  );
}

/** The couple, drawn behind the envelope. */
export function CoupleBack({ phase }: { phase: number }) {
  const reduce = useReducedMotion();
  const gaze = usePointerLook(phase === 0 && !reduce);
  return (
    <svg viewBox={`0 0 ${SCENE.w} ${SCENE.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="fabric" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.05" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.09" />
        </linearGradient>
      </defs>
      <ellipse cx={135} cy={596} rx={70} ry={9} fill="#3e1f2c" opacity={0.1} />
      <ellipse cx={465} cy={604} rx={84} ry={9} fill="#3e1f2c" opacity={0.1} />
      <Alvin phase={phase} gaze={gaze} />
      <Rheena phase={phase} gaze={gaze} />
    </svg>
  );
}

/** Their hands, drawn on top of the envelope's edges, plus the hearts. */
export function CoupleFront({ phase }: { phase: number }) {
  return (
    <svg viewBox={`0 0 ${SCENE.w} ${SCENE.h}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      {/* Alvin's hand on the left edge */}
      <motion.g animate={{ y: [0, -1.6, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}>
        <rect x={142} y={332} width={20} height={26} rx={9} fill={SKIN_A} />
        <path d="M160 338 q7 1 7 7 q0 5 -7 5" fill={SKIN_A} stroke={SKIN_A_SHADE} strokeWidth={1} />
      </motion.g>
      {/* Rheena's hand on the right edge */}
      <motion.g animate={{ y: [0, -1.4, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}>
        <rect x={439} y={332} width={18} height={24} rx={8} fill={SKIN_R} />
        <path d="M441 338 q-7 1 -7 7 q0 5 7 5" fill={SKIN_R} stroke={SKIN_R_SHADE} strokeWidth={1} />
      </motion.g>

      <AnimatePresence>
        {phase >= 2 &&
          [0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.path
              key={i}
              d="M0 4 C0 -1 7 -2 7 3 C7 -2 14 -1 14 4 C14 9 7 13 7 13 C7 13 0 9 0 4 Z"
              fill={i % 2 ? "#cf6f8c" : "#f6b6c4"}
              initial={{ x: 293, y: 210, opacity: 0, scale: 0.4 }}
              animate={{ x: 293 + (i - 3) * 26, y: 60 - (i % 3) * 22, opacity: [0, 1, 0], scale: 1 + (i % 3) * 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
      </AnimatePresence>
    </svg>
  );
}

/** Little speech bubble that pops in above one of them. */
export function Bubble({ show, side, children }: { show: boolean; side: "left" | "right"; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`absolute top-[-2%] z-30 rounded-2xl bg-white px-3.5 py-2 font-display text-[clamp(0.85rem,3.4vw,1.1rem)] text-ink italic shadow-[0_10px_30px_-12px_rgba(62,31,44,0.45)] ${
            side === "left" ? "left-[4%] rounded-bl-sm" : "right-[2%] rounded-br-sm"
          }`}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.9 }}
          transition={{ y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }, default: { duration: 0.5 } }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
