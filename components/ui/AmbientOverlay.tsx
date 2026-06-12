"use client";

import { motion } from "framer-motion";

export default function AmbientOverlay({ transitionTrigger }: { transitionTrigger: number }) {
  return (
    <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">

      {/* ================================================ */}
      {/* 全屏背景网格 */}
      {/* ================================================ */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ================================================ */}
      {/* 四角色光 */}
      {/* ================================================ */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[120px]" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-500/12 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-cyan-500/12 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-500/15 rounded-full blur-[120px]" />

      {/* ================================================ */}
      {/* 左侧轨道环组 — 青色系 */}
      {/* ================================================ */}
      <motion.div
        className="absolute left-[-350px] top-1/2 -translate-y-1/2"
        style={{ width: "1100px", height: "1100px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "2px solid rgba(34,211,238,0.2)",
            boxShadow: "inset 0 0 100px rgba(34,211,238,0.08), 0 0 60px rgba(34,211,238,0.06)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute left-[-300px] top-1/2 -translate-y-1/2"
        style={{ width: "950px", height: "950px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "1px solid rgba(6,182,212,0.15)",
            borderStyle: "dashed",
          }}
        />
      </motion.div>

      {/* ================================================ */}
      {/* 右侧轨道环组 — 紫色/品红系 */}
      {/* ================================================ */}
      <motion.div
        className="absolute right-[-350px] top-1/2 -translate-y-1/2"
        style={{ width: "1100px", height: "1100px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "2px solid rgba(139,92,246,0.18)",
            boxShadow: "inset 0 0 100px rgba(139,92,246,0.06), 0 0 60px rgba(139,92,246,0.05)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute right-[-280px] top-1/2 -translate-y-1/2"
        style={{ width: "850px", height: "850px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "1px solid rgba(236,72,153,0.14)",
            borderStyle: "dotted",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute right-[-220px] top-1/2 -translate-y-1/2"
        style={{ width: "700px", height: "700px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "1px solid rgba(245,158,11,0.15)",
          }}
        />
      </motion.div>

      {/* ================================================ */}
      {/* 左侧垂直光线柱 */}
      {/* ================================================ */}
      <motion.div
        className="absolute left-[8%] top-[-10%]"
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "1px",
            height: "120vh",
            background: "linear-gradient(to bottom, transparent 0%, rgba(34,211,238,0.4) 30%, rgba(34,211,238,0.15) 60%, transparent 100%)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute left-[5%] top-[-10%]"
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 7, delay: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "1px",
            height: "120vh",
            background: "linear-gradient(to bottom, transparent 0%, rgba(59,130,246,0.3) 40%, rgba(59,130,246,0.1) 70%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* ================================================ */}
      {/* 右侧垂直光线柱 */}
      {/* ================================================ */}
      <motion.div
        className="absolute right-[8%] top-[-10%]"
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 6, delay: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "1px",
            height: "120vh",
            background: "linear-gradient(to bottom, transparent 0%, rgba(139,92,246,0.4) 35%, rgba(139,92,246,0.15) 65%, transparent 100%)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute right-[5%] top-[-10%]"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 8, delay: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "1px",
            height: "120vh",
            background: "linear-gradient(to bottom, transparent 0%, rgba(236,72,153,0.35) 30%, rgba(236,72,153,0.1) 60%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* ================================================ */}
      {/* 左侧散落光点 */}
      {/* ================================================ */}
      {[
        { x: "3%", y: "20%", c: "rgba(34,211,238,0.9)", s: 5, d: 2, dl: 0 },
        { x: "6%", y: "65%", c: "rgba(59,130,246,0.8)", s: 4, d: 3, dl: 0.8 },
        { x: "2%", y: "40%", c: "rgba(139,92,246,0.85)", s: 5, d: 2.5, dl: 1.5 },
        { x: "7%", y: "85%", c: "rgba(34,211,238,0.7)", s: 3, d: 4, dl: 0.3 },
        { x: "4%", y: "10%", c: "rgba(245,158,11,0.8)", s: 4, d: 3.5, dl: 2 },
        { x: "8%", y: "50%", c: "rgba(236,72,153,0.8)", s: 4, d: 3, dl: 1 },
      ].map((dot, i) => (
        <motion.div
          key={`left-${i}`}
          className="absolute rounded-full"
          style={{
            left: dot.x,
            top: dot.y,
            width: `${dot.s}px`,
            height: `${dot.s}px`,
            backgroundColor: dot.c,
            boxShadow: `0 0 ${dot.s * 6}px ${dot.c}`,
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: dot.d, delay: dot.dl, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ================================================ */}
      {/* 右侧散落光点 */}
      {/* ================================================ */}
      {[
        { x: "93%", y: "15%", c: "rgba(139,92,246,0.9)", s: 5, d: 2.5, dl: 0 },
        { x: "96%", y: "55%", c: "rgba(236,72,153,0.85)", s: 5, d: 3, dl: 1 },
        { x: "91%", y: "75%", c: "rgba(34,211,238,0.8)", s: 4, d: 3.5, dl: 0.5 },
        { x: "97%", y: "35%", c: "rgba(245,158,11,0.85)", s: 5, d: 2, dl: 2 },
        { x: "94%", y: "5%", c: "rgba(59,130,246,0.85)", s: 4, d: 4, dl: 1.2 },
        { x: "89%", y: "90%", c: "rgba(236,72,153,0.7)", s: 3, d: 3, dl: 0.7 },
      ].map((dot, i) => (
        <motion.div
          key={`right-${i}`}
          className="absolute rounded-full"
          style={{
            right: `${100 - parseFloat(dot.x)}%`,
            top: dot.y,
            width: `${dot.s}px`,
            height: `${dot.s}px`,
            backgroundColor: dot.c,
            boxShadow: `0 0 ${dot.s * 6}px ${dot.c}`,
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: dot.d, delay: dot.dl, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ================================================ */}
      {/* 左上角斜向能量线 */}
      {/* ================================================ */}
      <motion.div
        className="absolute left-[-5%] top-[10%]"
        animate={{ opacity: [0.08, 0.2, 0.08] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "300px",
            height: "1px",
            background: "linear-gradient(to right, rgba(34,211,238,0.6), transparent)",
            transform: "rotate(-25deg)",
            transformOrigin: "left center",
          }}
        />
      </motion.div>

      {/* 右上角斜向能量线 */}
      <motion.div
        className="absolute right-[-5%] top-[15%]"
        animate={{ opacity: [0.08, 0.22, 0.08] }}
        transition={{ duration: 7, delay: 1, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "280px",
            height: "1px",
            background: "linear-gradient(to left, rgba(139,92,246,0.6), transparent)",
            transform: "rotate(25deg)",
            transformOrigin: "right center",
          }}
        />
      </motion.div>

      {/* 左下角斜向能量线 */}
      <motion.div
        className="absolute left-[-3%] bottom-[20%]"
        animate={{ opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 5.5, delay: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "250px",
            height: "1px",
            background: "linear-gradient(to right, rgba(59,130,246,0.5), transparent)",
            transform: "rotate(20deg)",
            transformOrigin: "left center",
          }}
        />
      </motion.div>

      {/* 右下角斜向能量线 */}
      <motion.div
        className="absolute right-[-3%] bottom-[25%]"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6.5, delay: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "250px",
            height: "1px",
            background: "linear-gradient(to left, rgba(236,72,153,0.5), transparent)",
            transform: "rotate(-20deg)",
            transformOrigin: "right center",
          }}
        />
      </motion.div>

      {/* ================================================ */}
      {/* 中心能量场 — 呼吸 */}
      {/* ================================================ */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [0.85, 1.08, 0.85],
          opacity: [0.25, 0.55, 0.25],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="rounded-full"
          style={{
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, rgba(139,92,246,0.02) 25%, rgba(59,130,246,0.01) 45%, transparent 65%)",
          }}
        />
      </motion.div>

      {/* 中心细环 */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: "550px", height: "550px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "1px solid rgba(34,211,238,0.05)",
            boxShadow: "0 0 50px rgba(34,211,238,0.02)",
          }}
        />
      </motion.div>

      {/* ================================================ */}
      {/* 过渡爆发 */}
      {/* ================================================ */}
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
