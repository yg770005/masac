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
      {/* 左侧轨道环 */}
      {/* ================================================ */}
      <div
        className="absolute left-[-350px] top-1/2 -translate-y-1/2"
        style={{ width: "1100px", height: "1100px" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "2px solid rgba(34,211,238,0.2)",
            boxShadow: "inset 0 0 100px rgba(34,211,238,0.08), 0 0 60px rgba(34,211,238,0.06)",
            animation: "spin-cw 55s linear infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* ================================================ */}
      {/* 右侧轨道环 */}
      {/* ================================================ */}
      <div
        className="absolute right-[-350px] top-1/2 -translate-y-1/2"
        style={{ width: "1100px", height: "1100px" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "2px solid rgba(139,92,246,0.18)",
            boxShadow: "inset 0 0 100px rgba(139,92,246,0.06), 0 0 60px rgba(139,92,246,0.05)",
            animation: "spin-ccw 65s linear infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* ================================================ */}
      {/* 垂直光线柱 */}
      {/* ================================================ */}
      <div
        className="absolute left-[8%] top-[-10%]"
        style={{ animation: "pulse-a 5s ease-in-out infinite", willChange: "opacity" }}
      >
        <div
          style={{
            width: "1px",
            height: "120vh",
            background: "linear-gradient(to bottom, transparent 0%, rgba(34,211,238,0.4) 30%, rgba(34,211,238,0.15) 60%, transparent 100%)",
          }}
        />
      </div>

      <div
        className="absolute right-[8%] top-[-10%]"
        style={{ animation: "pulse-b 6s ease-in-out 1s infinite", willChange: "opacity" }}
      >
        <div
          style={{
            width: "1px",
            height: "120vh",
            background: "linear-gradient(to bottom, transparent 0%, rgba(139,92,246,0.4) 35%, rgba(139,92,246,0.15) 65%, transparent 100%)",
          }}
        />
      </div>

      {/* ================================================ */}
      {/* 左侧散落光点 */}
      {/* ================================================ */}
      {[
        { x: "3%", y: "20%", c: "rgba(34,211,238,0.9)", s: 5, d: 2, dl: 0 },
        { x: "6%", y: "65%", c: "rgba(59,130,246,0.8)", s: 4, d: 3, dl: 0.8 },
      ].map((dot, i) => (
        <div
          key={`left-${i}`}
          className="absolute rounded-full"
          style={{
            left: dot.x,
            top: dot.y,
            width: `${dot.s}px`,
            height: `${dot.s}px`,
            backgroundColor: dot.c,
            boxShadow: `0 0 ${dot.s * 6}px ${dot.c}`,
            animation: `pulse-dot ${dot.d}s ease-in-out ${dot.dl}s infinite`,
            willChange: "opacity",
          }}
        />
      ))}

      {/* ================================================ */}
      {/* 右侧散落光点 */}
      {/* ================================================ */}
      {[
        { x: "93%", y: "15%", c: "rgba(139,92,246,0.9)", s: 5, d: 2.5, dl: 0 },
        { x: "96%", y: "55%", c: "rgba(236,72,153,0.85)", s: 5, d: 3, dl: 1 },
      ].map((dot, i) => (
        <div
          key={`right-${i}`}
          className="absolute rounded-full"
          style={{
            right: `${100 - parseFloat(dot.x)}%`,
            top: dot.y,
            width: `${dot.s}px`,
            height: `${dot.s}px`,
            backgroundColor: dot.c,
            boxShadow: `0 0 ${dot.s * 6}px ${dot.c}`,
            animation: `pulse-dot ${dot.d}s ease-in-out ${dot.dl}s infinite`,
            willChange: "opacity",
          }}
        />
      ))}

      {/* ================================================ */}
      {/* 斜向能量线 */}
      {/* ================================================ */}
      <div
        className="absolute left-[-5%] top-[10%]"
        style={{ animation: "pulse-line 6s ease-in-out infinite", willChange: "opacity" }}
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
      </div>

      <div
        className="absolute right-[-5%] top-[15%]"
        style={{ animation: "pulse-line 7s ease-in-out 1s infinite", willChange: "opacity" }}
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
      </div>

      {/* ================================================ */}
      {/* 中心能量场 — 呼吸 (定位与动画分离) */}
      {/* ================================================ */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="rounded-full"
          style={{
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, rgba(139,92,246,0.02) 25%, rgba(59,130,246,0.01) 45%, transparent 65%)",
            animation: "breathe 5s ease-in-out infinite",
            willChange: "transform, opacity",
          }}
        />
      </div>

      {/* 中心细环 — (定位与动画分离) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: "550px", height: "550px" }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            border: "1px solid rgba(34,211,238,0.05)",
            boxShadow: "0 0 50px rgba(34,211,238,0.02)",
            animation: "spin-cw 40s linear infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* ================================================ */}
      {/* 过渡爆发 — 保留framer-motion（仅场景切换时短暂触发） */}
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

      {/* ================================================ */}
      {/* CSS Keyframes — 全部运行在compositor线程，零JS开销 */}
      {/* ================================================ */}
      <style jsx>{`
        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse-a {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        @keyframes pulse-b {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes pulse-line {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.22; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(0.85); opacity: 0.25; }
          50% { transform: scale(1.08); opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}
