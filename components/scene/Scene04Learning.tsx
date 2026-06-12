"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import AnimatedMetric from "../ui/AnimatedMetric";

export default function Scene04Learning() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [showBars, setShowBars] = useState(false);

  useEffect(() => {
    if (isInView) {
      const t = setTimeout(() => setShowBars(true), 1500);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  const bars = [
    { label: "追踪", color: "#ef4444", width: 82 },
    { label: "编队", color: "#22d3ee", width: 27 },
    { label: "安全", color: "#10b981", width: 92 },
    { label: "能效", color: "#f59e0b", width: 79 },
  ];

  return (
    <div
      ref={ref}
      className="w-full h-full flex flex-col items-center justify-center px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="text-cyan-400 font-mono tracking-[0.3em] uppercase mb-4" style={{ fontSize: "14px" }}>
          学习过程
        </p>
        <h2
          className="font-bold text-white leading-[1.1]"
          style={{ fontSize: "clamp(50px, 9vw, 130px)" }}
        >
          重复中诞生精湛
        </h2>
        <p
          className="mt-3 text-slate-500"
          style={{ fontSize: "clamp(18px, 2.5vw, 28px)" }}
        >
          集群在仿真中训练——回合接回合——发现人类未曾设计的策略
        </p>
      </motion.div>

      <div className="grid grid-cols-3 gap-8 md:gap-16 text-center mb-12">
        <AnimatedMetric value={200000} label="训练回合数" color="#3b82f6" delay={0.2} />
        <AnimatedMetric value={82} label="任务完成率" suffix="%" color="#10b981" delay={0.6} decimals={0} />
        <AnimatedMetric value={0.27} label="编队保持率" color="#ec4899" delay={1.0} decimals={4} />
      </div>

      {showBars && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl mt-8"
        >
          <p className="text-slate-600 font-mono tracking-[0.2em] uppercase text-center mb-6" style={{ fontSize: "12px" }}>
            各维度学习进度
          </p>
          <div className="space-y-3">
            {bars.map((bar, i) => (
              <div key={bar.label} className="flex items-center gap-4">
                <span
                  className="text-slate-500 font-mono w-16 text-right"
                  style={{ fontSize: "14px" }}
                >
                  {bar.label}
                </span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.width}%` }}
                    transition={{ delay: i * 0.15, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: bar.color }}
                  />
                </div>
                <span
                  className="font-mono w-12"
                  style={{ color: bar.color, fontSize: "14px" }}
                >
                  {bar.label === "编队" ? "0.27" : `${bar.width}%`}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-12 text-slate-500 text-center max-w-lg"
        style={{ fontSize: "clamp(16px, 2vw, 24px)" }}
      >
        经过 200,000 次仿真遭遇，集群学会了在每一个竞争需求之间找到平衡
      </motion.p>
    </div>
  );
}
