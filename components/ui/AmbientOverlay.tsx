"use client";

import { motion } from "framer-motion";

export default function AmbientOverlay({ transitionTrigger }: { transitionTrigger: number }) {
  return (
    <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
      {/* 全屏背景网格 */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* 左侧大型轨道环 */}
      <motion.div
        className="absolute left-[-300px] top-1/2 -translate-y-1/2"
        style={{ width: "1000px", height: "1000px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "1px solid rgba(34,211,238,0.08)",
            boxShadow: "inset 0 0 80px rgba(34,211,238,0.03)",
          }}
        />
      </motion.div>

      {/* 第二个轨道环 */}
      <motion.div
        className="absolute left-[-250px] top-1/2 -translate-y-1/2"
        style={{ width: "900px", height: "900px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "1px solid rgba(59,130,246,0.05)",
            borderStyle: "dashed",
          }}
        />
      </motion.div>

      {/* 中心能量场 */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.05, 0.8],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="rounded-full"
          style={{
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, rgba(59,130,246,0.02) 30%, transparent 60%)",
          }}
        />
      </motion.div>

      {/* 能量场光环 */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: "600px", height: "600px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "1px solid rgba(34,211,238,0.06)",
            boxShadow: "0 0 60px rgba(34,211,238,0.03), 0 0 120px rgba(34,211,238,0.02)",
          }}
        />
      </motion.div>

      {/* 过渡粒子爆发 — 场景切换时触发 */}
      <motion.div
        key={transitionTrigger}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(34,211,238,0.06) 0%, transparent 50%)",
          }}
        />
      </motion.div>
    </div>
  );
}
