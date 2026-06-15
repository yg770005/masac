"use client";

import { motion, AnimatePresence } from "framer-motion";

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

// subStep: 0-3 = 四个指标依次累计, 4 = 总结
export default function Scene05Validation({ subStep }: { subStep: number }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <AnimatePresence mode="wait">
        {/* 指标阶段: subStep 0-3 */}
        {subStep <= 3 && (
          <motion.div
            key={`metric-${subStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {metrics.slice(0, subStep + 1).map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{
                  opacity: i === subStep ? 1 : 0.35,
                  y: 0,
                  scale: i === subStep ? 1 : 0.95,
                }}
                transition={{ duration: 0.5, delay: i === subStep ? 0.1 : 0, ease: [0.33, 1, 0.68, 1] }}
                className="text-center px-4 mb-2"
              >
                <p
                  className="font-black tracking-tight leading-[0.85]"
                  style={{ color: m.color, fontSize: "clamp(60px, 16vw, 200px)" }}
                >
                  {m.value}
                </p>
                <p className="text-slate-500 font-mono tracking-[0.2em] uppercase" style={{ fontSize: "clamp(14px, 2vw, 20px)" }}>
                  {m.title}
                </p>
                <p className="text-slate-600 max-w-sm mx-auto" style={{ fontSize: "clamp(12px, 1.6vw, 16px)" }}>
                  {m.desc}
                </p>
              </motion.div>
            ))}
            <p className="text-slate-600 font-mono text-xs mt-4">
              指标 {subStep + 1}/{metrics.length}
            </p>
          </motion.div>
        )}

        {/* 总结: subStep 4 */}
        {subStep === 4 && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          >
            <p
              className="text-slate-300 font-light leading-relaxed max-w-xl"
              style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
            >
              一个集群同时完成追踪、编队、避碰与节能。没有人类程序员预设规则。数学自己找到了答案。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
