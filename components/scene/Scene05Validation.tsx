"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const metrics = [
  {
    value: "82%",
    title: "任务完成率",
    desc: "五架无人机在动态环境中成功完成追踪与编队任务",
    color: "#22d3ee",
  },
  {
    value: "0.2705",
    title: "平均最大编队保持率",
    desc: "在目标追踪过程中动态维持编队几何结构",
    color: "#10b981",
  },
  {
    value: "256.29s",
    title: "平均最短飞行时间",
    desc: "高效路径规划，减少空中滞留时间",
    color: "#3b82f6",
  },
  {
    value: "129.73m",
    title: "平均最短飞行路程",
    desc: "优化轨迹，降低能源消耗至 205.84 单位",
    color: "#f59e0b",
  },
];

export default function Scene05Validation() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const ranges: [number, number][] = [
    [0.02, 0.22],
    [0.20, 0.42],
    [0.40, 0.62],
    [0.60, 0.82],
  ];

  const metricAnims = metrics.map((_, i) => ({
    opacity: useTransform(scrollYProgress, [ranges[i][0], ranges[i][0] + 0.05, ranges[i][1], ranges[i][1] + 0.05], [0, 1, 1, 0]),
    scale: useTransform(scrollYProgress, [ranges[i][0], ranges[i][0] + 0.05, ranges[i][1], ranges[i][1] + 0.05], [0.8, 1, 1, 0.9]),
    y: useTransform(scrollYProgress, [ranges[i][0], ranges[i][0] + 0.05], [80, 0]),
  }));

  const summaryOpacity = useTransform(scrollYProgress, [0.84, 0.92], [0, 1]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center relative">
        {metrics.map((m, i) => (
          <motion.div
            key={m.title}
            style={{
              opacity: metricAnims[i].opacity,
              scale: metricAnims[i].scale,
              y: metricAnims[i].y,
            }}
            className="absolute text-center px-4"
          >
            <p
              className="font-black tracking-tight leading-[0.85]"
              style={{
                color: m.color,
                fontSize: "clamp(80px, 20vw, 280px)",
              }}
            >
              {m.value}
            </p>
            <p
              className="mt-4 text-slate-500 font-mono tracking-[0.2em] uppercase"
              style={{ fontSize: "clamp(16px, 2vw, 24px)" }}
            >
              {m.title}
            </p>
            <p
              className="mt-2 text-slate-600 max-w-sm mx-auto"
              style={{ fontSize: "clamp(14px, 1.6vw, 18px)" }}
            >
              {m.desc}
            </p>
          </motion.div>
        ))}

        <motion.div
          style={{ opacity: summaryOpacity }}
          className="absolute text-center px-4"
        >
          <p
            className="text-slate-300 font-light leading-relaxed max-w-xl"
            style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
          >
            一个集群同时完成追踪、编队、避碰与节能。
            没有人类程序员预设规则。
            数学自己找到了答案。
          </p>
        </motion.div>
      </div>
    </div>
  );
}
