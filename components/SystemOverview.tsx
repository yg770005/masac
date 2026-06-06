"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const cards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
    title: "环境感知",
    desc: "多传感器融合感知，实时构建环境状态空间。整合GPS、IMU、视觉传感器数据，形成全局态势图。",
    color: "cyan",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 7h4M7 10h6" />
      </svg>
    ),
    title: "状态观测",
    desc: "每个无人机智能体独立观测局部状态，包括自身位置、速度、邻居相对位置及目标信息。",
    color: "blue",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        <path d="M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8" />
      </svg>
    ),
    title: "Actor决策",
    desc: "基于策略网络的分布式Actor，输出连续动作空间中的控制指令，实现平滑飞行控制。",
    color: "purple",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Critic评估",
    desc: "集中式Critic网络对全局状态-动作对进行价值评估，指导各智能体策略优化方向。",
    color: "pink",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2">
        <path d="M12 2l3 6 6.5 1-4.75 4.5L18 20l-6-3-6 3 1.25-6.5L2.5 9 9 8l3-6z" />
      </svg>
    ),
    title: "奖励反馈",
    desc: "稀疏+稠密混合奖励设计：编队保持奖励、目标追踪奖励、碰撞惩罚，引导策略收敛。",
    color: "amber",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-2">
        <path d="M21 12a9 9 0 01-9 9M21 12a9 9 0 00-9-9M21 12H3" />
        <path d="M3 12a9 9 0 019-9M3 12a9 9 0 009 9" />
      </svg>
    ),
    title: "经验回放",
    desc: "优先经验回放机制，高效利用历史交互数据。打破样本相关性，加速训练收敛过程。",
    color: "emerald",
  },
];

const colorMap: Record<string, string> = {
  cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 hover:border-cyan-400/60 text-cyan-400",
  blue: "from-blue-500/20 to-blue-500/5 border-blue-500/30 hover:border-blue-400/60 text-blue-400",
  purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30 hover:border-purple-400/60 text-purple-400",
  pink: "from-pink-500/20 to-pink-500/5 border-pink-500/30 hover:border-pink-400/60 text-pink-400",
  amber: "from-amber-500/20 to-amber-500/5 border-amber-500/30 hover:border-amber-400/60 text-amber-400",
  emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 hover:border-emerald-400/60 text-emerald-400",
};

function SystemCard({
  card,
  index,
}: {
  card: (typeof cards)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`relative group bg-gradient-to-br ${colorMap[card.color]} backdrop-blur-sm border rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
      style={{
        boxShadow: isInView ? `0 0 30px rgba(${card.color === 'cyan' ? '34,211,238' : card.color === 'blue' ? '59,130,246' : card.color === 'purple' ? '139,92,246' : card.color === 'pink' ? '236,72,153' : card.color === 'amber' ? '245,158,11' : '16,185,129'}, 0.1)` : "none",
      }}
    >
      {/* 悬停扫描线 */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scan-line" />
      </div>

      {/* 角落光效 */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-current to-transparent opacity-0 group-hover:opacity-10 transition-opacity rounded-tr-2xl" />

      <div className={`${card.color === 'cyan' ? 'text-cyan-400' : card.color === 'blue' ? 'text-blue-400' : card.color === 'purple' ? 'text-purple-400' : card.color === 'pink' ? 'text-pink-400' : card.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'} mb-4`}>
        {card.icon}
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>

      {/* 编号 */}
      <div className="absolute bottom-4 right-4 text-4xl font-black text-white/5 select-none">
        {String(index + 1).padStart(2, "0")}
      </div>
    </motion.div>
  );
}

export default function SystemOverview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div className="relative py-24 lg:py-32 px-6 lg:px-16 bg-[#020617] grid-bg">
      {/* 背景光晕 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 章节标题 */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">
              SYSTEM OVERVIEW
            </span>
            <span className="flex-1 h-px w-16 bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight">
            <span className="section-title pb-4">
              系统<span className="text-cyan-400">概览</span>
            </span>
          </h2>
          <p className="mt-6 text-slate-500 max-w-xl text-sm lg:text-base">
            MASAC系统由六个核心模块构成，覆盖从环境感知到策略更新的完整强化学习闭环
          </p>
        </motion.div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {cards.map((card, i) => (
            <SystemCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
