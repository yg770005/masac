"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

interface AnimatedMetricProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  color?: string;
  delay?: number;
  decimals?: number;
}

export default function AnimatedMetric({
  value,
  label,
  suffix = "",
  prefix = "",
  color = "#22d3ee",
  delay = 0,
  decimals = 0,
}: AnimatedMetricProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      delay,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [isInView, value, delay]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8 }}
      className="text-center"
    >
      <p
        className="font-black tracking-tight leading-[0.9]"
        style={{ color, fontSize: "clamp(60px, 10vw, 160px)" }}
      >
        {prefix}
        {formatted}
        {suffix && (
          <span className="text-slate-600" style={{ fontSize: "0.35em" }}>
            {suffix}
          </span>
        )}
      </p>
      <p
        className="mt-3 text-slate-500 font-mono tracking-[0.15em] uppercase"
        style={{ fontSize: "clamp(12px, 1.5vw, 18px)" }}
      >
        {label}
      </p>
    </motion.div>
  );
}
