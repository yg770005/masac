"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const phases = [
  {
    text: "5架无人机",
    color: "#ffffff",
    sub: "",
    delay: 0.3,
  },
  {
    text: "1个目标",
    color: "#ef4444",
    sub: "",
    delay: 1.8,
  },
  {
    text: "无限决策",
    color: "#94a3b8",
    sub: "在追踪、编队、安全、能效之间找到平衡",
    delay: 3.3,
  },
];

export default function Scene01Challenge() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = phases.map((p) =>
      setTimeout(() => setPhase((prev) => prev + 1), p.delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-4">
      <AnimatePresence mode="wait">
        {phases.slice(0, phase + 1).map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className="mb-4"
          >
            <p
              className="font-black tracking-tight leading-[0.9]"
              style={{
                color: p.color,
                fontSize: "clamp(100px, 16vw, 240px)",
              }}
            >
              {p.text}
            </p>
            {p.sub && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-3 text-slate-500 font-light"
                style={{ fontSize: "clamp(18px, 2.5vw, 32px)" }}
              >
                {p.sub}
              </motion.p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 滚动提示 */}
      {phase >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-10 flex flex-col items-center gap-3"
        >
          <span className="text-slate-600 font-mono tracking-[0.3em] uppercase" style={{ fontSize: "12px" }}>
            向下滚动，感受挑战
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 rounded-full border border-slate-700 flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-2 rounded-full bg-cyan-400" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
