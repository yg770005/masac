"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

interface CounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  delay: number;
  decimals?: number;
  color?: string;
}

function AnimatedCounter({
  value,
  label,
  suffix = "",
  prefix = "",
  delay,
  decimals = 0,
  color = "#22d3ee",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
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

  const formatted = decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="text-center"
    >
      <div
        className="text-3xl lg:text-4xl xl:text-5xl font-black font-mono tracking-tight"
        style={{ color }}
      >
        <span ref={ref}>
          {prefix}
          {formatted}
        </span>
        <span className="text-lg lg:text-xl text-slate-600 ml-1">{suffix}</span>
      </div>
      <p className="mt-2 text-[10px] lg:text-xs text-slate-500 uppercase tracking-[0.2em]">
        {label}
      </p>
    </motion.div>
  );
}

export default function ResultsPanel() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      value: 200000,
      label: "训练轮次",
      suffix: "EPS",
      color: "#22d3ee",
      delay: 0,
    },
    {
      value: 98.7,
      label: "编队成功率",
      suffix: "%",
      color: "#10b981",
      delay: 0.2,
      decimals: 1,
    },
    {
      value: 1785,
      label: "平均奖励值",
      color: "#f59e0b",
      delay: 0.4,
    },
    {
      value: 5,
      label: "智能体数量",
      color: "#3b82f6",
      delay: 0.6,
    },
    {
      value: 8.3,
      label: "决策延迟",
      suffix: "ms",
      color: "#8b5cf6",
      delay: 0.8,
      decimals: 1,
    },
  ];

  return (
    <div className="relative py-24 lg:py-32 px-6 lg:px-16 bg-[#030712] overflow-hidden">
      {/* 背景动态光效 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* 网格 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* 标题 */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="flex-1 h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">
              PROJECT RESULTS
            </span>
            <span className="flex-1 h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight">
            <span className="section-title pb-4">
              项目<span className="text-cyan-400">成果</span>
            </span>
          </h2>
        </motion.div>

        {/* 数据展示 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="hud-panel p-6">
              <AnimatedCounter {...stat} />
            </div>
          ))}
        </div>

        {/* 底部摘要 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            在200K episodes的训练后，MASAC算法使5架无人机在复杂动态环境中
            实现了<span className="text-cyan-400 font-semibold">98.7%</span>
            的编队保持成功率，平均决策延迟仅为
            <span className="text-purple-400 font-semibold">8.3ms</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
