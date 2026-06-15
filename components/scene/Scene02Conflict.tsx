"use client";

import { motion, AnimatePresence } from "framer-motion";

const objectives = [
  { text: "追踪目标", color: "#ef4444" },
  { text: "保持编队", color: "#22d3ee" },
  { text: "避免碰撞", color: "#f59e0b" },
  { text: "节省能量", color: "#10b981" },
];

// subStep: 0-3 = 四个目标依次累计, 4 = 问题, 5 = MASAC揭晓
export default function Scene02Conflict({ subStep }: { subStep: number }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <AnimatePresence mode="wait">
        {/* 目标阶段: subStep 0-3 — 累计显示 */}
        {subStep <= 3 && (
          <motion.div
            key={`obj-${subStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {objectives.slice(0, subStep + 1).map((obj, i) => (
              <motion.div
                key={obj.text}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: i === subStep ? 1 : 0.35, y: 0 }}
                transition={{ duration: 0.5, delay: i === subStep ? 0 : 0, ease: [0.33, 1, 0.68, 1] }}
                className="mb-2"
              >
                <h2
                  className="font-black tracking-tight leading-[0.9]"
                  style={{
                    color: obj.color,
                    fontSize: "clamp(60px, 12vw, 180px)",
                  }}
                >
                  {obj.text}
                </h2>
              </motion.div>
            ))}
            <p className="text-slate-600 font-mono text-xs mt-4">
              目标 {subStep + 1}/{objectives.length}
            </p>
          </motion.div>
        )}

        {/* 问题: subStep 4 */}
        {subStep === 4 && (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <p
              className="font-light text-slate-400 text-center"
              style={{ fontSize: "clamp(24px, 3.5vw, 48px)" }}
            >
              无法同时满足。谁来权衡取舍？
            </p>
          </motion.div>
        )}

        {/* MASAC揭晓: subStep 5 */}
        {subStep === 5 && (
          <motion.div
            key="masac"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          >
            <p className="text-cyan-400 font-mono tracking-[0.3em] uppercase mb-4" style={{ fontSize: "14px" }}>
              答案揭晓
            </p>
            <h1
              className="font-black tracking-tight leading-[0.9] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              style={{ fontSize: "clamp(80px, 16vw, 220px)" }}
            >
              MASAC
            </h1>
            <p className="mt-2 text-slate-500 font-mono" style={{ fontSize: "clamp(16px, 2vw, 24px)" }}>
              Multi-Agent Soft Actor-Critic
            </p>
            <p className="mt-4 text-slate-400 max-w-lg" style={{ fontSize: "clamp(16px, 2vw, 24px)" }}>
              一个强化学习框架，让五个独立智能体学会协同——发现人类无法手工编程的平衡点。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
