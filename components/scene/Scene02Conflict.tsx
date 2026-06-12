"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const objectives = [
  { text: "追踪目标", color: "#ef4444" },
  { text: "保持编队", color: "#22d3ee" },
  { text: "避免碰撞", color: "#f59e0b" },
  { text: "节省能量", color: "#10b981" },
];

export default function Scene02Conflict() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const ranges: [number, number][] = [
    [0.02, 0.18],
    [0.16, 0.32],
    [0.30, 0.46],
    [0.44, 0.60],
  ];

  const objAnims = objectives.map((_, i) => ({
    opacity: useTransform(scrollYProgress, [ranges[i][0], ranges[i][0] + 0.06, ranges[i][1], ranges[i][1] + 0.04], [0, 1, 1, 0]),
    y: useTransform(scrollYProgress, [ranges[i][0], ranges[i][0] + 0.06], [60, 0]),
  }));

  const questionOpacity = useTransform(scrollYProgress, [0.58, 0.65], [0, 1]);
  const masacOpacity = useTransform(scrollYProgress, [0.68, 0.78], [0, 1]);
  const masacScale = useTransform(scrollYProgress, [0.68, 0.78], [0.85, 1]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {objectives.map((obj, i) => (
            <motion.div
              key={obj.text}
              style={{ opacity: objAnims[i].opacity, y: objAnims[i].y }}
              className="absolute text-center"
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

          <motion.div
            style={{ opacity: questionOpacity }}
            className="absolute text-center"
          >
            <p
              className="font-light text-slate-400"
              style={{ fontSize: "clamp(24px, 3.5vw, 48px)" }}
            >
              无法同时满足。谁来权衡取舍？
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: masacOpacity, scale: masacScale }}
            className="absolute text-center px-4"
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
            <p
              className="mt-2 text-slate-500 font-mono"
              style={{ fontSize: "clamp(16px, 2vw, 24px)" }}
            >
              Multi-Agent Soft Actor-Critic
            </p>
            <p
              className="mt-4 text-slate-400 max-w-lg mx-auto"
              style={{ fontSize: "clamp(16px, 2vw, 24px)" }}
            >
              一个强化学习框架，让五个独立智能体学会协同——
              发现人类无法手工编程的平衡点。
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
