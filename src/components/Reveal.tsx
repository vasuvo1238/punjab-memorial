"use client";
import { animate, motion, MotionConfig, useInView, useReducedMotion } from "framer-motion";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Fade-and-rise as content enters the viewport. Honours reduced motion. */
export function Reveal({ children, delay = 0, className, as = "div", y = 24 }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" | "p" | "span"; y?: number }) {
  const M = motion[as];
  return (
    <MotionConfig reducedMotion="user">
      <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.1, ease: EASE, delay }}>
        {children}
      </M>
    </MotionConfig>
  );
}

/** Headline that rises in word by word from behind a mask. Text stays readable to screen readers as one string. */
export function SplitWords({ text, className, delay = 0, stagger = 0.06, as = "h1" }: { text: string; className?: string; delay?: number; stagger?: number; as?: "h1" | "h2" | "p" }) {
  const reduce = useReducedMotion();
  const Tag = as;
  const words = text.split(" ");
  if (reduce) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.2, ease: EASE, delay: delay + i * stagger }}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Animated count-up for headline numbers. */
export function CountUp({ to, className }: { to: number; className?: string }) {
  return (
    <motion.span className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
      <Counter to={to} />
    </motion.span>
  );
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView || reduce) { setV(to); return; }
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return <span ref={ref} className="tabular-nums">{v.toLocaleString("en-IN")}</span>;
}
