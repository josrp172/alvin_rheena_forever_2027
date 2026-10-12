"use client";

import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition, type Transition } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Chibi Alvin & Rheena in their Hong Kong proposal outfits, holding the
 * invitation between them. Drawn in a 600×620 scene; the envelope sits in
 * ENVELOPE_BOX. `phase`: 0 waiting · 1 opening · 2 letter out (celebrate) · 3 goodbye.
 */

export const SCENE = { w: 600, h: 620 };
export const ENVELOPE_BOX = { x: 150, y: 330, w: 300, h: 200 };

const C = {
  skinA: "#f0c09d",
  skinALine: "#cc9070",
  skinR: "#f6cdb0",
  skinRLine: "#d69a7e",
  hair: "#251b21",
  hairLine: "#120b0f",
  hairHi: "#5e4955",
  white: "#fffdf9",
  whiteLine: "#dcd2c6",
  pants: "#2a2530",
  pantsLine: "#141218",
  skirt: "#f2f5fc",
  skirtLine: "#d6dcea",
  eye: "#2d1f24",
  blush: "#f4919d",
};

const line = { strokeWidth: 2.2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

type Look = { x: number; y: number };

/** Pupils follow the guest's pointer. */
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

/**
 * A rotatable part. Motion pivots SVG around the centre of the element's box,
 * so an invisible circle centred on the joint makes that centre the joint.
 */
function Joint({
  x,
  y,
  r,
  animate,
  transition,
  children,
}: {
  x: number;
  y: number;
  r: number;
  animate?: TargetAndTransition;
  transition?: Transition;
  children: React.ReactNode;
}) {
  return (
    <motion.g style={{ originX: 0.5, originY: 0.5 }} animate={animate} transition={transition}>
      <circle cx={x} cy={y} r={r} fill="transparent" pointerEvents="none" />
      {children}
    </motion.g>
  );
}

function Eye({ cx, cy, gaze, happy, lash, delay }: { cx: number; cy: number; gaze: Look; happy: boolean; lash?: boolean; delay: number }) {
  if (happy) {
    return <path d={`M${cx - 12} ${cy + 3} Q${cx} ${cy - 13} ${cx + 12} ${cy + 3}`} stroke={C.eye} strokeWidth={4.5} fill="none" strokeLinecap="round" />;
  }
  return (
    <Joint x={cx} y={cy} r={18} animate={{ scaleY: [1, 1, 0.08, 1, 1] }} transition={{ duration: 4.4, times: [0, 0.9, 0.93, 0.96, 1], repeat: Infinity, delay }}>
      <ellipse cx={cx} cy={cy} rx={11.5} ry={14.5} fill={C.eye} />
      <motion.g animate={{ x: gaze.x * 3.2, y: gaze.y * 2.6 }} transition={{ type: "spring", stiffness: 120, damping: 14 }}>
        <ellipse cx={cx} cy={cy + 2} rx={8} ry={10} fill="#5a3640" opacity={0.85} />
        <circle cx={cx + 4} cy={cy - 5} r={4.4} fill="#fff" />
        <circle cx={cx - 4} cy={cy + 6} r={2} fill="#fff" opacity={0.85} />
      </motion.g>
      {lash && (
        <path d={`M${cx + 8} ${cy - 11} l6 -6 M${cx + 11} ${cy - 5} l7 -2 M${cx - 9} ${cy - 13} q9 -6 18 0`} stroke={C.eye} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      )}
    </Joint>
  );
}

function Alvin({ phase, gaze }: { phase: number; gaze: Look }) {
  const lean = phase === 1 ? 3 : phase === 2 ? -2 : phase === 3 ? 4 : 0;
  const tilt = phase === 1 ? 6 : phase === 2 ? -8 : phase === 3 ? 7 : gaze.x * 4;
  const eyes = phase === 1 ? { x: 0.8, y: 0.9 } : phase === 3 ? { x: 1, y: 0.1 } : gaze;
  const happy = phase === 2;
  return (
    <Joint x={110} y={596} r={600} animate={{ rotate: lean }} transition={{ type: "spring", stiffness: 70, damping: 11 }}>
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}>
        {/* legs & sneakers */}
        <path d="M80 462 L80 566 Q80 576 92 576 L100 576 Q108 576 108 566 L108 470 Z" fill={C.pants} stroke={C.pantsLine} {...line} />
        <path d="M112 470 L112 566 Q112 576 120 576 L128 576 Q140 576 140 566 L140 462 Z" fill={C.pants} stroke={C.pantsLine} {...line} />
        <path d="M68 584 Q68 566 92 566 Q112 566 113 580 Q113 593 92 593 Q68 593 68 584 Z" fill={C.white} stroke={C.whiteLine} {...line} />
        <path d="M107 580 Q108 566 128 566 Q152 566 152 584 Q152 593 128 593 Q107 593 107 580 Z" fill={C.white} stroke={C.whiteLine} {...line} />
        <path d="M70 586 L111 586 M109 586 L150 586" stroke="#e6ddd2" strokeWidth={2} />

        {/* inner arm & sleeve, mostly hidden behind the envelope */}
        <path d="M156 318 Q182 326 186 360 L172 364 Q166 400 158 424 L144 420 Q150 394 152 362 Z" fill={C.skinA} stroke={C.skinALine} {...line} />
        <path d="M156 312 Q182 318 188 354 L156 364 Q150 336 148 318 Z" fill={C.white} stroke={C.whiteLine} {...line} />

        {/* white polo */}
        <path d="M58 336 Q60 300 110 296 Q160 300 162 336 L168 462 Q110 480 52 462 Z" fill={C.white} stroke={C.whiteLine} {...line} />
        <path d="M58 336 Q60 300 110 296 Q160 300 162 336 L168 462 Q110 480 52 462 Z" fill="url(#fabric)" />
        <path d="M110 314 L110 356" stroke={C.whiteLine} strokeWidth={2} />
        <circle cx={110} cy={330} r={2.6} fill="#cfc4b7" />
        <circle cx={110} cy={345} r={2.6} fill="#cfc4b7" />
        <path d="M86 298 Q100 300 110 314 L97 328 Q84 317 82 302 Z" fill={C.white} stroke={C.whiteLine} {...line} />
        <path d="M134 298 Q120 300 110 314 L123 328 Q136 317 138 302 Z" fill={C.white} stroke={C.whiteLine} {...line} />
        <path d="M58 452 Q110 470 162 452" stroke={C.whiteLine} strokeWidth={2} fill="none" />

        {/* head */}
        <Joint x={110} y={292} r={250} animate={{ rotate: tilt }} transition={{ type: "spring", stiffness: 80, damping: 12 }}>
          <Joint x={110} y={292} r={250} animate={{ rotate: [-1.5, 1.5, -1.5] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <ellipse cx={24} cy={208} rx={14} ry={18} fill={C.skinA} stroke={C.skinALine} {...line} />
            <ellipse cx={196} cy={208} rx={14} ry={18} fill={C.skinA} stroke={C.skinALine} {...line} />
            <path d="M26 196 Q26 112 110 110 Q194 112 194 196 Q194 262 152 282 Q110 296 68 282 Q26 262 26 196 Z" fill={C.skinA} stroke={C.skinALine} {...line} />
            {/* short sides, swept-up top with spiky front locks */}
            <path
              d="M20 204 Q8 104 110 86 Q212 104 200 204 Q196 172 180 152 Q154 162 128 152 Q98 168 68 158 Q44 172 20 204 Z"
              fill={C.hair}
              stroke={C.hairLine}
              {...line}
            />
            <motion.g
              style={{ originX: 0.5, originY: 1 }}
              animate={{ rotate: [-1.2, 1.2, -1.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M30 140 Q36 76 104 62 Q164 52 194 86 Q208 104 204 136 Q190 110 164 102 Q172 88 154 82 Q128 96 96 98 Q60 104 30 140 Z"
                fill={C.hair}
                stroke={C.hairLine}
                {...line}
              />
              <path d="M92 100 Q100 52 150 42 Q126 62 126 92 Z" fill={C.hair} stroke={C.hairLine} {...line} />
              <path d="M124 94 Q146 46 192 52 Q164 64 160 100 Z" fill={C.hair} stroke={C.hairLine} {...line} />
              <path d="M58 104 Q66 78 98 66" stroke={C.hairHi} strokeWidth={5} fill="none" strokeLinecap="round" />
              <path d="M134 64 Q150 54 170 56 M172 96 Q188 106 194 124" stroke={C.hairHi} strokeWidth={4.5} fill="none" strokeLinecap="round" />
            </motion.g>
            <path d="M56 176 Q76 166 96 174 M124 174 Q144 166 164 176" stroke={C.hair} strokeWidth={6.5} fill="none" strokeLinecap="round" />
            <Eye cx={76} cy={208} gaze={eyes} happy={happy} delay={0.3} />
            <Eye cx={144} cy={208} gaze={eyes} happy={happy} delay={0.3} />
            <path d="M108 224 Q113 232 106 236" stroke={C.skinALine} strokeWidth={2.6} fill="none" strokeLinecap="round" />
            <ellipse cx={58} cy={242} rx={16} ry={9} fill={C.blush} opacity={0.45} />
            <ellipse cx={162} cy={242} rx={16} ry={9} fill={C.blush} opacity={0.45} />
            {phase >= 2 ? (
              <g>
                <path d="M88 244 Q110 276 132 244 Q110 254 88 244 Z" fill="#8a3f45" stroke="#7a3238" {...line} />
                <path d="M99 258 Q110 268 121 258 Q110 254 99 258 Z" fill="#ec8592" />
              </g>
            ) : (
              <path d="M92 248 Q110 264 128 248" stroke="#8a3f45" strokeWidth={4.5} fill="none" strokeLinecap="round" />
            )}
          </Joint>
        </Joint>

        {/* outer arm: hangs, then cheers when the letter comes out */}
        <Joint
          x={64}
          y={322}
          r={130}
          animate={{ rotate: phase === 2 ? [100, 128, 108, 128, 112] : 6 }}
          transition={phase === 2 ? { duration: 1.6, ease: "easeInOut" } : { type: "spring", stiffness: 110, damping: 11 }}
        >
          <path d="M38 350 Q30 390 40 418 L62 418 Q66 388 66 358 Z" fill={C.skinA} stroke={C.skinALine} {...line} />
          <rect x={36} y={396} width={29} height={10} rx={3.5} fill="#2e2b33" />
          <circle cx={51} cy={424} r={15} fill={C.skinA} stroke={C.skinALine} {...line} />
          <path d="M64 312 Q40 318 34 352 L68 362 Q72 334 74 318 Z" fill={C.white} stroke={C.whiteLine} {...line} />
        </Joint>
      </motion.g>
    </Joint>
  );
}

function Rheena({ phase, gaze }: { phase: number; gaze: Look }) {
  const lean = phase === 1 ? -3 : phase === 2 ? 2 : phase === 3 ? -4 : 0;
  const tilt = phase === 1 ? -6 : phase === 2 ? 8 : phase === 3 ? -7 : gaze.x * 4;
  const eyes = phase === 1 ? { x: -0.8, y: 0.9 } : phase === 3 ? { x: -1, y: 0.1 } : gaze;
  const happy = phase === 2;
  const cheek = phase >= 2;
  return (
    <Joint x={490} y={600} r={600} animate={{ rotate: lean }} transition={{ type: "spring", stiffness: 70, damping: 11 }}>
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        {/* long hair behind */}
        <Joint x={490} y={110} r={360} animate={{ rotate: [-1.2, 1.2, -1.2] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
          <path
            d="M396 200 Q386 104 490 96 Q594 104 584 200 Q596 320 588 448 Q566 476 540 452 L536 320 L444 320 L440 452 Q414 476 392 448 Q384 320 396 200 Z"
            fill={C.hair}
            stroke={C.hairLine}
            {...line}
          />
        </Joint>

        {/* long flowy skirt */}
        <Joint x={490} y={398} r={215} animate={{ skewX: [-1.5, 1.5, -1.5] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M440 396 Q490 386 540 396 Q584 476 598 584 Q490 606 382 584 Q396 476 440 396 Z" fill={C.skirt} stroke={C.skirtLine} {...line} />
          <path d="M440 396 Q490 386 540 396 Q584 476 598 584 Q490 606 382 584 Q396 476 440 396 Z" fill="url(#fabric)" />
          <path d="M462 404 Q448 500 430 594 M490 400 L490 600 M518 404 Q532 500 550 594" stroke={C.skirtLine} strokeWidth={2.2} fill="none" />
        </Joint>
        <ellipse cx={468} cy={598} rx={17} ry={7} fill={C.white} stroke={C.whiteLine} {...line} />
        <ellipse cx={512} cy={598} rx={17} ry={7} fill={C.white} stroke={C.whiteLine} {...line} />

        {/* inner arm to the envelope's right edge */}
        <path d="M430 330 Q414 362 426 400 L440 424 L456 418 Q444 392 446 340 Z" fill={C.skinR} stroke={C.skinRLine} {...line} />

        {/* neck, shoulders, off-shoulder ruffle top */}
        <path d="M476 270 L504 270 L506 302 L474 302 Z" fill="#e5b08f" />
        <path d="M418 326 Q430 296 490 292 Q550 296 562 326 Z" fill={C.skinR} stroke={C.skinRLine} {...line} />
        <path d="M440 334 L540 334 L546 402 Q490 412 434 402 Z" fill={C.white} stroke={C.whiteLine} {...line} />
        <path d="M440 334 L540 334 L546 402 Q490 412 434 402 Z" fill="url(#fabric)" />
        <path
          d="M410 318 q10 14 20 0 q10 14 20 0 q10 14 20 0 q10 14 20 0 q10 14 20 0 q10 14 20 0 q10 14 20 0 q10 14 20 0 L570 340 q-10 16 -20 2 q-10 16 -20 2 q-10 16 -20 2 q-10 16 -20 2 q-10 16 -20 2 q-10 16 -20 2 q-10 16 -20 2 q-10 16 -20 2 Z"
          fill={C.white}
          stroke={C.whiteLine}
          {...line}
        />
        <path d="M434 398 q9 10 18 0 q9 10 18 0 q9 10 18 0 q9 10 18 0 q9 10 18 0 q9 10 18 0" stroke={C.whiteLine} strokeWidth={2} fill="none" />

        {/* head */}
        <Joint x={490} y={292} r={250} animate={{ rotate: tilt }} transition={{ type: "spring", stiffness: 80, damping: 12 }}>
          <Joint x={490} y={292} r={250} animate={{ rotate: [1.5, -1.5, 1.5] }} transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}>
            <path d="M406 196 Q406 114 490 112 Q574 114 574 196 Q574 260 532 280 Q490 294 448 280 Q406 260 406 196 Z" fill={C.skinR} stroke={C.skinRLine} {...line} />
            {/* side-swept bangs and the strands that frame her face */}
            <path d="M398 212 Q390 100 492 94 Q594 102 584 210 Q576 168 548 152 Q530 176 488 180 Q448 182 424 178 Q406 186 398 212 Z" fill={C.hair} stroke={C.hairLine} {...line} />
            <path d="M548 152 Q542 120 516 104" stroke={C.hairLine} strokeWidth={2.2} fill="none" strokeLinecap="round" />
            <path d="M402 196 Q386 270 408 352 L430 346 Q414 270 420 206 Z" fill={C.hair} stroke={C.hairLine} {...line} />
            <path d="M580 192 Q596 270 572 352 L550 346 Q566 270 562 202 Z" fill={C.hair} stroke={C.hairLine} {...line} />
            <path d="M448 112 Q490 98 534 112 M430 168 Q462 160 500 162" stroke={C.hairHi} strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d="M443 190 Q457 183 471 189 M509 189 Q523 183 537 190" stroke={C.hair} strokeWidth={3.6} fill="none" strokeLinecap="round" />
            <Eye cx={458} cy={212} gaze={eyes} happy={happy} lash delay={1.2} />
            <Eye cx={522} cy={212} gaze={eyes} happy={happy} lash delay={1.2} />
            <path d="M489 228 Q493 234 487 237" stroke={C.skinRLine} strokeWidth={2.4} fill="none" strokeLinecap="round" />
            <ellipse cx={440} cy={244} rx={16} ry={9} fill={C.blush} opacity={cheek ? 0.75 : 0.5} />
            <ellipse cx={540} cy={244} rx={16} ry={9} fill={C.blush} opacity={cheek ? 0.75 : 0.5} />
            {phase >= 2 ? (
              <path d="M474 250 Q490 272 506 250 Q490 258 474 250 Z" fill="#c25a6c" stroke="#a84a5b" {...line} />
            ) : (
              <path d="M477 252 Q490 263 503 252" stroke="#c25a6c" strokeWidth={4.2} fill="none" strokeLinecap="round" />
            )}
          </Joint>
        </Joint>

        {/* outer arm with the ring: hangs, then hand to cheek — kilig */}
        <Joint x={550} y={326} r={130} animate={{ rotate: cheek ? -168 : -5 }} transition={{ type: "spring", stiffness: 90, damping: 12 }}>
          <path d="M546 330 Q572 360 568 412 L548 414 Q550 372 534 340 Z" fill={C.skinR} stroke={C.skinRLine} {...line} />
          <rect x={546} y={392} width={22} height={9} rx={3.5} fill="#d4a26a" />
          <circle cx={558} cy={422} r={14} fill={C.skinR} stroke={C.skinRLine} {...line} />
          <circle cx={551} cy={428} r={3.6} fill="none" stroke="#efe6cf" strokeWidth={2.2} />
          <AnimatePresence>
            {cheek && (
              <motion.path
                d="M551 418 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 Z"
                fill="#fff"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.8, 1], opacity: [0, 1, 0.95] }}
                exit={{ opacity: 0 }}
                style={{ originX: 0.5, originY: 0.5 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            )}
          </AnimatePresence>
        </Joint>
      </motion.g>
    </Joint>
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
          <stop offset="0" stopColor="#000" stopOpacity="0.06" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <ellipse cx={110} cy={596} rx={72} ry={10} fill="#3e1f2c" opacity={0.1} />
      <ellipse cx={490} cy={602} rx={100} ry={10} fill="#3e1f2c" opacity={0.1} />
      <Alvin phase={phase} gaze={gaze} />
      <Rheena phase={phase} gaze={gaze} />
    </svg>
  );
}

const sparkles = [
  [120, 60],
  [300, 96],
  [470, 54],
  [560, 150],
  [40, 150],
  [330, 40],
];

/** Their hands on the envelope's edges, plus hearts and sparkles. */
export function CoupleFront({ phase }: { phase: number }) {
  return (
    <svg viewBox={`0 0 ${SCENE.w} ${SCENE.h}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}>
        <path d="M134 406 Q134 396 146 396 L156 396 Q168 396 168 410 L168 432 Q168 444 154 444 L146 444 Q134 444 134 432 Z" fill={C.skinA} stroke={C.skinALine} {...line} />
        <path d="M152 408 L166 408 M152 420 L166 420 M152 432 L164 432" stroke={C.skinALine} strokeWidth={1.8} strokeLinecap="round" />
      </motion.g>
      <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        <path d="M466 406 Q466 396 454 396 L444 396 Q432 396 432 410 L432 432 Q432 444 446 444 L454 444 Q466 444 466 432 Z" fill={C.skinR} stroke={C.skinRLine} {...line} />
        <path d="M448 408 L434 408 M448 420 L434 420 M448 432 L436 432" stroke={C.skinRLine} strokeWidth={1.8} strokeLinecap="round" />
      </motion.g>

      <AnimatePresence>
        {phase >= 2 &&
          [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.path
              key={`h${i}`}
              d="M0 5 C0 -1 9 -3 9 4 C9 -3 18 -1 18 5 C18 12 9 17 9 17 C9 17 0 12 0 5 Z"
              fill={i % 2 ? "#cf6f8c" : "#f6b6c4"}
              stroke="#fff"
              strokeWidth={1.2}
              initial={{ x: 291, y: 300, opacity: 0, scale: 0.4 }}
              animate={{ x: 291 + (i - 3.5) * 30, y: 110 - (i % 3) * 26, opacity: [0, 1, 0], scale: 1.1 + (i % 3) * 0.25 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.4, delay: 0.12 * i, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        {phase >= 2 &&
          sparkles.map(([x, y], i) => (
            <motion.path
              key={`s${i}`}
              d={`M${x} ${y - 9} Q${x + 1.5} ${y - 1.5} ${x + 9} ${y} Q${x + 1.5} ${y + 1.5} ${x} ${y + 9} Q${x - 1.5} ${y + 1.5} ${x - 9} ${y} Q${x - 1.5} ${y - 1.5} ${x} ${y - 9} Z`}
              fill="#ecd0a7"
              style={{ originX: 0.5, originY: 0.5 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0.8, 1.1], opacity: [0, 1, 0.7, 1], rotate: [0, 45, 90] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, delay: 0.3 + i * 0.12, repeat: Infinity, repeatType: "reverse" }}
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
          className={`absolute top-[-5%] z-30 rounded-2xl bg-white px-3.5 py-2 font-display text-[clamp(0.85rem,3.4vw,1.1rem)] text-ink italic shadow-[0_10px_30px_-12px_rgba(62,31,44,0.45)] ${
            side === "left" ? "left-[2%] rounded-bl-sm" : "right-[0%] rounded-br-sm"
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
