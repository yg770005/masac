"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ============================================================
// Module 1: Mission Description — 场景示意图
// ============================================================
function MissionScene() {
  return (
    <div className="relative w-full aspect-[16/9] max-h-[400px] bg-gradient-to-b from-[#020617] via-[#030712] to-[#020617] rounded-2xl border border-cyan-500/20 overflow-hidden">
      {/* 背景网格 */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Leader UAV — 中心蓝色发光 */}
      <motion.div
        className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 z-20"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <div className="relative">
          {/* 通信圆环 */}
          <div className="absolute inset-0 w-20 h-20 -top-6 -left-6 rounded-full border border-cyan-400/40 animate-pulse" />
          <div className="absolute inset-0 w-28 h-28 -top-10 -left-10 rounded-full border border-cyan-400/15 animate-pulse" style={{ animationDelay: "0.5s" }} />
          {/* 机身 */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-400 whitespace-nowrap">
            LEADER
          </span>
        </div>
      </motion.div>

      {/* 4架Follower UAVs */}
      {[
        { x: "25%", y: "55%", delay: 0, color: "#3b82f6" },
        { x: "75%", y: "55%", delay: 0.5, color: "#6366f1" },
        { x: "35%", y: "72%", delay: 1, color: "#38bdf8" },
        { x: "65%", y: "72%", delay: 1.5, color: "#818cf8" },
      ].map((f, i) => (
        <motion.div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: f.x, top: f.y }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: f.delay, ease: "easeInOut" }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${f.color}, rgba(0,0,0,0.5))`, boxShadow: `0 0 12px ${f.color}66` }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white/80">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-slate-500 whitespace-nowrap">
              UAV {i + 2}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Dynamic Target — 红色运动 */}
      <motion.div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
        animate={{
          x: ["0%", "30%", "-20%", "10%", "0%"],
          y: ["0%", "-15%", "5%", "-8%", "0%"],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        style={{ left: "70%", top: "25%" }}
      >
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
          <div className="absolute inset-0 w-6 h-6 -top-1 -left-1 rounded-full border border-red-400/60 animate-ping" />
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-red-400 whitespace-nowrap">
            TARGET
          </span>
        </div>
      </motion.div>

      {/* 虚线连接 Leader→Target */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <line
          x1="50%" y1="35%" x2="70%" y2="25%"
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity={0.3}
        />
      </svg>

      {/* 编队范围虚线圆 */}
      <div
        className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-cyan-500/15 border-dashed"
      />

      {/* 标签 */}
      <div className="absolute top-3 left-3 z-30">
        <span className="text-[10px] font-mono text-cyan-400 bg-black/60 px-2 py-1 rounded border border-cyan-500/20">
          SCENARIO: 1 LEADER + 4 FOLLOWERS + 1 TARGET
        </span>
      </div>
      <div className="absolute bottom-3 right-3 z-30">
        <span className="text-[10px] font-mono text-slate-500 bg-black/60 px-2 py-1 rounded border border-white/10">
          动态不确定环境
        </span>
      </div>
    </div>
  );
}

// ============================================================
// Module 2: Control Objectives
// ============================================================
function ControlObjectives() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const objectives = [
    {
      icon: "◎",
      title: "目标追踪",
      en: "Target Tracking",
      desc: "Leader UAV持续追踪动态目标，最小化与目标的相对距离，确保目标不丢失",
      color: "#ef4444",
    },
    {
      icon: "◇",
      title: "编队保持",
      en: "Formation Keeping",
      desc: "4架Follower UAV维持预设编队构型，与Leader保持稳定的相对位置关系",
      color: "#22d3ee",
    },
    {
      icon: "○",
      title: "碰撞规避",
      en: "Collision Avoidance",
      desc: "所有UAV之间保持安全距离，在密集编队中实现零碰撞的协同飞行",
      color: "#f59e0b",
    },
    {
      icon: "△",
      title: "协同决策",
      en: "Cooperative Decision",
      desc: "多智能体分布式决策，无中心控制器，每个UAV自主推理并协同行动",
      color: "#8b5cf6",
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {objectives.map((obj, i) => (
        <motion.div
          key={obj.en}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.12, duration: 0.5 }}
          className="relative group p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all duration-500"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-3"
            style={{ backgroundColor: `${obj.color}15`, color: obj.color }}
          >
            {obj.icon}
          </div>
          <h3 className="text-sm font-bold text-white mb-1">{obj.title}</h3>
          <p className="text-[10px] font-mono text-slate-600 mb-2">{obj.en}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{obj.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// Module 3: Constraints
// ============================================================
function Constraints() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const constraints = [
    {
      category: "运动学约束",
      items: [
        { label: "最大速度", value: "v ≤ v_max" },
        { label: "最大转向角", value: "|δ| ≤ δ_max" },
        { label: "最大加速度", value: "|a| ≤ a_max" },
      ],
      color: "#22d3ee",
    },
    {
      category: "安全约束",
      items: [
        { label: "最小安全距离", value: "d_ij ≥ d_safe" },
        { label: "避障缓冲区", value: "r_buffer ≥ 1.5m" },
        { label: "高度限制", value: "h ∈ [h_min, h_max]" },
      ],
      color: "#f59e0b",
    },
    {
      category: "感知约束",
      items: [
        { label: "局部观测范围", value: "Ω_i 有限" },
        { label: "通信带宽限制", value: "B ≤ B_max" },
        { label: "传感器噪声", value: "ε ∼ N(0, σ²)" },
      ],
      color: "#8b5cf6",
    },
    {
      category: "决策约束",
      items: [
        { label: "决策频率", value: "f ≥ 10Hz" },
        { label: "实时性要求", value: "τ < 100ms" },
        { label: "分布式限制", value: "无全局信息" },
      ],
      color: "#10b981",
    },
  ];

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {constraints.map((c, i) => (
        <motion.div
          key={c.category}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="hud-panel p-5"
        >
          <div
            className="text-xs font-bold font-mono mb-3 pb-2 border-b border-white/10"
            style={{ color: c.color }}
          >
            {c.category}
          </div>
          <div className="space-y-2.5">
            {c.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{item.label}</span>
                <span className="text-[10px] font-mono text-slate-600">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// Module 4: Why It Is Difficult
// ============================================================
function WhyDifficult() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const conflicts = [
    {
      a: "目标追踪",
      b: "碰撞规避",
      problem: "接近目标 ←→ 远离障碍",
      desc: "追踪目标要求UAV快速接近，但密集编队中需保持安全距离——越接近目标，碰撞风险越高",
    },
    {
      a: "编队保持",
      b: "目标追踪",
      problem: "维持队形 ←→ 快速机动",
      desc: "编队构型要求UAV限制运动幅度，但追踪动态目标需要快速、大幅度的机动响应",
    },
    {
      a: "分布式决策",
      b: "全局最优",
      problem: "局部信息 ←→ 协同最优",
      desc: "每个UAV只能观测局部状态，无法获取全局信息，但需要达到全局一致的协同行为",
    },
    {
      a: "实时性",
      b: "策略质量",
      problem: "决策速度 ←→ 决策精度",
      desc: "高频控制要求毫秒级推理，但复杂策略搜索需要充足计算——时间与质量的矛盾",
    },
  ];

  return (
    <div ref={ref}>
      {/* 核心问题声明 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="relative p-6 rounded-2xl border border-red-500/20 bg-red-500/[0.03] mb-8 text-center"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
          <span className="text-[10px] font-mono text-red-400 uppercase tracking-[0.2em]">CORE CHALLENGE</span>
        </div>
        <p className="mt-4 text-sm lg:text-base text-slate-300 leading-relaxed">
          这是一个
          <span className="text-red-400 font-semibold">高维 · 多目标 · 多智能体</span>
          的优化问题——
          <br className="hidden sm:block" />
          四个控制目标<span className="text-cyan-400 font-semibold">相互冲突</span>，
          需要在高维连续动作空间中寻找<span className="text-amber-400 font-semibold">帕累托最优解</span>
        </p>
      </motion.div>

      {/* 冲突对 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conflicts.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            className="p-5 rounded-xl border border-white/10 bg-white/[0.02]"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono font-bold" style={{ color: "#ef4444" }}>
                {c.a}
              </span>
              <span className="text-slate-700">vs</span>
              <span className="text-xs font-mono font-bold" style={{ color: "#22d3ee" }}>
                {c.b}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500 mb-2">{c.problem}</div>
            <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Module 5: Why MASAC
// ============================================================
function WhyMASAC() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const methods = [
    {
      name: "PID控制",
      desc: "需要精确动力学模型，参数整定困难，难以处理多变量耦合",
      status: "fail" as const,
    },
    {
      name: "规则控制",
      desc: "基于if-else逻辑，规则覆盖不完整，无法适应动态不确定环境",
      status: "fail" as const,
    },
    {
      name: "经典优化",
      desc: "依赖精确目标函数，计算复杂度高，实时性差，易陷入局部最优",
      status: "fail" as const,
    },
    {
      name: "MASAC",
      desc: "端到端学习最优策略 · 分布式执行 · 无需环境先验 · 自动权衡多目标",
      status: "success" as const,
    },
  ];

  return (
    <div ref={ref} className="space-y-6">
      {/* 传统方法失败 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-sm text-slate-400">
          传统控制与优化方法在动态多智能体场景中面临根本性挑战
        </p>
      </motion.div>

      {/* 方法对比时间线 */}
      <div className="relative">
        {/* 连接线 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-red-500/30 via-slate-700 to-cyan-400/50 hidden lg:block" />

        <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-4">
          {methods.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className={`relative p-5 rounded-xl border transition-all duration-300 ${
                m.status === "success"
                  ? "border-cyan-500/40 bg-cyan-500/5 hover:border-cyan-400/60"
                  : "border-red-500/15 bg-red-500/[0.02] hover:border-red-500/30 opacity-60 hover:opacity-100"
              }`}
            >
              {/* 状态指示 */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    m.status === "success" ? "bg-cyan-400 animate-pulse" : "bg-red-500/50"
                  }`}
                />
                <span
                  className={`text-xs font-bold font-mono ${
                    m.status === "success" ? "text-cyan-400" : "text-slate-500"
                  }`}
                >
                  {m.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              {m.status === "success" && (
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center">
                  <span className="text-[10px]">✓</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 结论 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 text-center"
      >
        <p className="text-sm lg:text-base text-slate-300">
          <span className="text-cyan-400 font-bold">MASAC</span>
          {' '}—— 端到端的深度强化学习算法，自动习得多目标权衡策略，
          <br className="hidden sm:block" />
          在<span className="text-amber-400">高维连续动作空间</span>中实现{' '}
          <span className="text-emerald-400">分布式最优协同控制</span>
        </p>
      </motion.div>
    </div>
  );
}

// ============================================================
// 主组件
// ============================================================
export default function ProblemStatement() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div className="relative py-24 lg:py-32 px-6 lg:px-16 bg-[#030712]">
      {/* 背景光效 */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 标题 */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-red-400 uppercase tracking-[0.3em]">
              PROBLEM STATEMENT
            </span>
            <span className="flex-1 h-px w-16 bg-gradient-to-r from-red-500/50 to-transparent" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight">
            <span className="section-title pb-4">
              我们<span className="text-red-400">解决</span>什么问题
            </span>
          </h2>
          <p className="mt-6 text-slate-500 max-w-2xl text-sm lg:text-base">
            1个Leader + 4个Follower + 1个动态目标 —— 在不确定环境中实现目标追踪、编队保持、碰撞规避与协同决策
          </p>
        </motion.div>

        {/* Module 1: Mission Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-6 rounded bg-red-500/20 border border-red-500/30 flex items-center justify-center text-[10px] text-red-400 font-mono">
              01
            </span>
            <h3 className="text-lg font-bold text-white">任务场景</h3>
            <span className="text-[10px] font-mono text-slate-600">MISSION DESCRIPTION</span>
          </div>
          <MissionScene />
        </motion.div>

        {/* Module 2: Control Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] text-amber-400 font-mono">
              02
            </span>
            <h3 className="text-lg font-bold text-white">控制目标</h3>
            <span className="text-[10px] font-mono text-slate-600">CONTROL OBJECTIVES</span>
          </div>
          <ControlObjectives />
        </motion.div>

        {/* Module 3: Constraints */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-6 rounded bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] text-purple-400 font-mono">
              03
            </span>
            <h3 className="text-lg font-bold text-white">约束条件</h3>
            <span className="text-[10px] font-mono text-slate-600">CONSTRAINTS</span>
          </div>
          <Constraints />
        </motion.div>

        {/* Module 4: Why Difficult */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-6 rounded bg-red-500/20 border border-red-500/30 flex items-center justify-center text-[10px] text-red-400 font-mono">
              04
            </span>
            <h3 className="text-lg font-bold text-white">为什么困难</h3>
            <span className="text-[10px] font-mono text-slate-600">INHERENT DIFFICULTY</span>
          </div>
          <WhyDifficult />
        </motion.div>

        {/* Module 5: Why MASAC */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-400 font-mono">
              05
            </span>
            <h3 className="text-lg font-bold text-white">为什么选择MASAC</h3>
            <span className="text-[10px] font-mono text-slate-600">WHY MASAC</span>
          </div>
          <WhyMASAC />
        </motion.div>
      </div>
    </div>
  );
}
