"use client";
import React from "react";
import { AnimatePresence, motion } from "motion/react";

export type GreetingsLoaderProps = {
  showForMs?: number; // default ~2800
  stepMs?: number; // default 500
  onFinish?: () => void;
  greetings?: string[];
  watermark?: string; // default "MADHAV"
  useFramer?: boolean; // default false
};

const DEFAULTS = {
  showForMs: 2800,
  stepMs: 500,
  watermark: "MADHAV",
};

const DEFAULT_GREETINGS: string[] = [
  // English + European
  "Hello",
  "Hi",
  "Hey",
  "Bonjour",
  "Hola",
  "Ciao",
  "Olá",
  "Hallo",
  "Hej",
  "Hej hej",
  "Salut",
  "Привет",
  "Вітаю",
  "Cześć",
  "Hallo (NL)",
  "Ahoj",
  "Γεια σου",
  "Merhaba",
  // Asian
  "こんにちは", // Japanese
  "안녕하세요", // Korean
  "你好", // Chinese
  "สวัสดี", // Thai
  "Xin chào", // Vietnamese
  "Halo", // Indonesian
  "Kumusta", // Filipino
  // Indic
  "नमस्ते", // Hindi
  "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ", // Punjabi (Gurmukhi)
  "வணக்கம்", // Tamil
  "স্বাগতম", // Bengali (Hello/Welcome context)
  "హలో", // Telugu
  "નમસ્તે", // Gujarati
  "नमस्कार", // Marathi
  "നമസ്കാരം", // Malayalam
  // Semitic
  "مرحبا", // Arabic
  "שלום", // Hebrew
  "سلام", // Persian (Farsi)
  // African
  "Hujambo", // Swahili
  "Sawubona", // Zulu
  // Others
  "Buongiorno",
  "Bom dia",
];

export function GreetingsLoader({
  showForMs = DEFAULTS.showForMs,
  stepMs = DEFAULTS.stepMs,
  onFinish,
  greetings = DEFAULT_GREETINGS,
  watermark = DEFAULTS.watermark,
  useFramer = false,
}: GreetingsLoaderProps) {
  const [visible, setVisible] = React.useState(true);
  const [index, setIndex] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);

  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const wmRef = React.useRef<HTMLDivElement | null>(null);
  const measureRef = React.useRef<HTMLDivElement | null>(null);
  const [wmScale, setWmScale] = React.useState(1);

  // Reduced motion preference
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Prevent page scroll while visible
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    if (visible) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  // Cycle greetings
  React.useEffect(() => {
    if (!visible) return;
    let it: ReturnType<typeof setInterval> | undefined;
    if (!reduced) {
      it = setInterval(() => {
        setIndex((i) => (i + 1) % greetings.length);
      }, Math.max(120, stepMs));
    } else {
      // Reduced motion: slower, no crossfade timing dependency
      it = setInterval(() => {
        setIndex((i) => (i + 1) % greetings.length);
      }, Math.max(500, stepMs));
    }
    return () => {
      if (it) clearInterval(it);
    };
  }, [visible, stepMs, greetings.length, reduced]);

  // Exit after showForMs
  React.useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      if (reduced) {
        // Instantly hide
        setVisible(false);
        onFinish?.();
      } else {
        setExiting(true);
      }
    }, Math.max(800, showForMs));
    return () => clearTimeout(t);
  }, [visible, showForMs, reduced, onFinish]);

  // When slide-up transition finishes, unmount + callback
  const onExitTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== overlayRef.current) return;
    if (exiting) {
      setVisible(false);
      onFinish?.();
    }
  };

  // Compute watermark scale so it fits viewport
  const computeScale = React.useCallback(() => {
    if (!wmRef.current || !measureRef.current) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = Math.min(vw, vh) * 0.06; // 6% padding

    // Measure the text at base scale 1
    const meas = measureRef.current.getBoundingClientRect();
    const maxW = vw - padding * 2;
    const maxH = vh - padding * 2;
    const s = Math.max(0.2, Math.min(maxW / meas.width, maxH / meas.height));
    setWmScale(s);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const r = () => computeScale();
    // compute after paint
    const id = requestAnimationFrame(r);
    window.addEventListener("resize", r);
    window.addEventListener("orientationchange", r);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", r);
      window.removeEventListener("orientationchange", r);
    };
  }, [computeScale]);

  if (!visible) return null;

  const GreetingText = (
    <div
      key={index}
      className="gl-greeting"
      aria-live="polite"
      aria-atomic="true"
    >
      {greetings[index]}
    </div>
  );

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-label="Loading"
      aria-busy={true}
      className={`gl-overlay${exiting ? " gl-exit" : ""}${
        reduced ? " gl-reduced" : ""
      }`}
      onTransitionEnd={onExitTransitionEnd}
    >
      {/* Watermark measurement (hidden) */}
      <div className="gl-measure" ref={measureRef} aria-hidden>
        {watermark}
      </div>

      {/* Watermark display */}
      <div
        ref={wmRef}
        className="gl-watermark"
        style={{ transform: `translate(-50%, -50%) scale(${wmScale})` }}
        aria-hidden
      >
        {watermark}
      </div>

      {/* Centered greeting */}
      <div className="gl-center">
        {useFramer ? (
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="gl-greeting"
            >
              {greetings[index]}
            </motion.div>
          </AnimatePresence>
        ) : (
          GreetingText
        )}
      </div>

      <style>{`
        .gl-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #0a0a0a; /* matte black */
          color: white;
          display: grid;
          place-items: center;
          overflow: hidden;
          pointer-events: auto;
          transform: translateY(0%);
          opacity: 1;
          transition: transform 640ms cubic-bezier(0.22, 1, 0.36, 1), opacity 480ms ease;
        }
        .gl-overlay.gl-exit {
          transform: translateY(-100%);
          opacity: 0.96;
        }
        .gl-overlay.gl-reduced { transition: none; }

        .gl-center {
          position: relative;
          z-index: 2;
          font-weight: 800;
          font-size: clamp(28px, 5vw, 56px);
          text-align: center;
          line-height: 1.1;
          padding: 0 16px;
        }
        .gl-greeting {
          will-change: opacity, transform;
          animation: gl-fade-in 320ms ease both;
          text-shadow: 0 2px 16px rgba(0,0,0,0.25);
        }
        @keyframes gl-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        .gl-watermark {
          position: absolute;
          top: 50%; left: 50%;
          transform-origin: center;
          z-index: 1;
          font-weight: 900;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.04);
          white-space: nowrap;
          user-select: none;
          pointer-events: none;
          font-size: 160px; /* measurement base */
        }
        .gl-measure {
          position: absolute; top: -9999px; left: -9999px; visibility: hidden;
          white-space: nowrap; font-weight: 900; font-size: 160px; letter-spacing: 0.06em;
        }
      `}</style>
    </div>
  );
}

export default GreetingsLoader;