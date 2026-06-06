"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

// 生成模拟训练数据
function generateTrainingData(points: number) {
  const rewards: number[] = [];
  const losses: number[] = [];
  const successRate: number[] = [];
  const collisionRate: number[] = [];

  let reward = 50;
  let loss = 2.5;
  let success = 0.3;
  let collision = 0.8;

  for (let i = 0; i < points; i++) {
    reward += (Math.random() - 0.3) * 8 + (i / points) * 3;
    loss *= 0.97 + Math.random() * 0.02;
    success += (Math.random() - 0.2) * 0.02;
    collision *= 0.98 + Math.random() * 0.01;

    rewards.push(parseFloat(reward.toFixed(1)));
    losses.push(parseFloat(Math.max(0.01, loss).toFixed(4)));
    successRate.push(parseFloat(Math.min(0.99, success).toFixed(4)));
    collisionRate.push(parseFloat(Math.max(0.001, collision).toFixed(4)));
  }

  return { rewards, losses, successRate, collisionRate };
}

const data = generateTrainingData(200);
const xLabels = Array.from({ length: 200 }, (_, i) =>
  i % 20 === 0 ? `${(i * 0.5).toFixed(0)}K` : ""
);

export default function TrainingDashboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => setAnimating(true), 300);
    }
  }, [isInView]);

  const rewardOption = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" as const },
    legend: {
      data: ["Average Reward"],
      textStyle: { color: "#94a3b8" },
      top: 0,
    },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: "category" as const,
      data: xLabels,
      axisLine: { lineStyle: { color: "#334155" } },
      axisTick: { show: false },
      axisLabel: { color: "#64748b", fontSize: 10 },
    },
    yAxis: {
      type: "value" as const,
      name: "Reward",
      nameTextStyle: { color: "#64748b", fontSize: 10 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "rgba(51,65,85,0.3)" } },
      axisLabel: { color: "#64748b", fontSize: 10 },
    },
    series: [
      {
        name: "Average Reward",
        type: "line",
        data: animating ? data.rewards : [],
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 2,
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: "#22d3ee" },
            { offset: 1, color: "#3b82f6" },
          ]),
        },
        itemStyle: { color: "#22d3ee" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(34,211,238,0.2)" },
            { offset: 1, color: "rgba(34,211,238,0.01)" },
          ]),
        },
        animationDuration: 3000,
        animationEasing: "cubicOut" as const,
      },
    ],
  };

  const lossOption = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" as const },
    legend: {
      data: ["Critic Loss", "Actor Loss"],
      textStyle: { color: "#94a3b8" },
      top: 0,
    },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: "category" as const,
      data: xLabels,
      axisLine: { lineStyle: { color: "#334155" } },
      axisTick: { show: false },
      axisLabel: { color: "#64748b", fontSize: 10 },
    },
    yAxis: {
      type: "value" as const,
      name: "Loss",
      nameTextStyle: { color: "#64748b", fontSize: 10 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "rgba(51,65,85,0.3)" } },
      axisLabel: { color: "#64748b", fontSize: 10 },
    },
    series: [
      {
        name: "Critic Loss",
        type: "line",
        data: animating ? data.losses : [],
        smooth: true,
        symbol: "none",
        lineStyle: { width: 2, color: "#f59e0b" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(245,158,11,0.15)" },
            { offset: 1, color: "rgba(245,158,11,0)" },
          ]),
        },
        animationDuration: 3000,
        animationEasing: "cubicOut" as const,
      },
      {
        name: "Actor Loss",
        type: "line",
        data: animating
          ? data.losses.map((v) => v * (0.6 + Math.random() * 0.3))
          : [],
        smooth: true,
        symbol: "none",
        lineStyle: { width: 2, color: "#ef4444" },
        animationDuration: 3000,
        animationEasing: "cubicOut" as const,
      },
    ],
  };

  const successOption = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" as const },
    legend: {
      data: ["Success Rate", "Collision Rate"],
      textStyle: { color: "#94a3b8" },
      top: 0,
    },
    grid: { left: 55, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: "category" as const,
      data: xLabels,
      axisLine: { lineStyle: { color: "#334155" } },
      axisTick: { show: false },
      axisLabel: { color: "#64748b", fontSize: 10 },
    },
    yAxis: {
      type: "value" as const,
      name: "Rate",
      min: 0,
      max: 1,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "rgba(51,65,85,0.3)" } },
      axisLabel: {
        color: "#64748b",
        fontSize: 10,
        formatter: (v: number) => `${(v * 100).toFixed(0)}%`,
      },
    },
    series: [
      {
        name: "Success Rate",
        type: "line",
        data: animating ? data.successRate : [],
        smooth: true,
        symbol: "none",
        lineStyle: { width: 2, color: "#10b981" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(16,185,129,0.2)" },
            { offset: 1, color: "rgba(16,185,129,0.01)" },
          ]),
        },
        animationDuration: 3000,
        animationEasing: "cubicOut" as const,
      },
      {
        name: "Collision Rate",
        type: "line",
        data: animating ? data.collisionRate : [],
        smooth: true,
        symbol: "none",
        lineStyle: { width: 2, color: "#ef4444", type: "dashed" },
        animationDuration: 3000,
        animationEasing: "cubicOut" as const,
      },
    ],
  };

  return (
    <div className="relative py-24 lg:py-32 px-6 lg:px-16 bg-[#020617]">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">
              TRAINING DASHBOARD
            </span>
            <span className="flex-1 h-px w-16 bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight">
            <span className="section-title pb-4">
              训练<span className="text-cyan-400">驾驶舱</span>
            </span>
          </h2>
          <p className="mt-6 text-slate-500 max-w-xl text-sm lg:text-base">
            200K episodes训练过程实时监控，展示奖励收敛、损失下降与成功率提升
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 奖励曲线 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="hud-panel p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Reward Curve</h3>
                <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                  平均奖励 · 每Episode
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] text-cyan-400 font-mono">LIVE</span>
              </div>
            </div>
            <ReactECharts option={rewardOption} style={{ height: 280 }} />
          </motion.div>

          {/* 损失曲线 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="hud-panel p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Loss Curve</h3>
                <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                  Critic & Actor · 损失下降
                </p>
              </div>
            </div>
            <ReactECharts option={lossOption} style={{ height: 280 }} />
          </motion.div>

          {/* 成功率 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hud-panel p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Success & Collision Rate
                </h3>
                <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                  任务成功率 · 碰撞率趋势
                </p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-emerald-400 inline-block" />
                  <span className="text-slate-500">SUCCESS</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-0.5 bg-red-400 inline-block" />
                  <span className="text-slate-500">COLLISION</span>
                </span>
              </div>
            </div>
            <ReactECharts option={successOption} style={{ height: 280 }} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
