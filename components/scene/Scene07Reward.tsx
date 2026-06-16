"use client";

import { motion, AnimatePresence } from "framer-motion";
import KatexFormula from "../ui/KatexFormula";

// ── Hero UAV Reward Table Data ──
const heroRewards = [
  {
    item: "边界惩罚",
    condition: "飞出任务区域",
    value: "-1",
    effect: "防止越界",
    icon: "⚠️",
    color: "#f59e0b",
  },
  {
    item: "障碍物碰撞",
    condition: "距离障碍物 < 20 px",
    value: "-500（终止）",
    effect: "强制避障",
    icon: "💥",
    color: "#ef4444",
  },
  {
    item: "障碍物预警",
    condition: "20 px ≤ 距离 < 40 px",
    value: "-2",
    effect: "提前规避障碍",
    icon: "⚠️",
    color: "#f97316",
  },
  {
    item: "到达目标",
    condition: "距离目标 < 40 px",
    value: "+1000（终止）",
    effect: "完成任务",
    icon: "🎯",
    color: "#10b981",
  },
  {
    item: "目标引导",
    condition: "正常飞行",
    value: "-0.001 × GoalDistance",
    effect: "引导接近目标",
    icon: "🧭",
    color: "#3b82f6",
  },
  {
    item: "编队约束",
    condition: "僚机未形成稳定编队",
    value: "-0.001 × FormationDistance",
    effect: "引导编队形成",
    icon: "🤝",
    color: "#8b5cf6",
  },
  {
    item: "速度协同",
    condition: "编队形成且速度差 < 1",
    value: "+1",
    effect: "提高协同性",
    icon: "🚁",
    color: "#22d3ee",
  },
];

// ── Wingman UAV Reward Table Data ──
const wingmanRewards = [
  {
    item: "跟随惩罚",
    condition: "与领队距离 > 50 px",
    value: "-0.001 × Distance",
    effect: "引导接近领队",
    icon: "📏",
    color: "#f59e0b",
  },
  {
    item: "编队保持",
    condition: "与领队距离 ≤ 50 px",
    value: "0",
    effect: "保持编队",
    icon: "🤝",
    color: "#10b981",
  },
  {
    item: "速度同步",
    condition: "编队形成且速度差 < 1",
    value: "+1",
    effect: "保持速度一致",
    icon: "🔄",
    color: "#22d3ee",
  },
];

// ── Design Philosophy Data ──
const philosophies = [
  {
    index: "1",
    title: "势函数奖励塑形",
    subtitle: "Potential-Based Reward Shaping",
    body: "系统采用 R = -0.001 × d 形式的距离奖励塑形，使智能体能够在每个时间步获得连续反馈，从而避免稀疏奖励导致的随机探索问题。",
    formula: "R = -0.001 \\times d",
    icon: "📐",
    color: "#3b82f6",
  },
  {
    index: "2",
    title: "多机协同机制",
    subtitle: "Multi-UAV Cooperation Mechanism",
    body: "领队无人机负责导航至目标点，而僚机无人机负责维持编队结构与速度同步。通过不同奖励目标的设计，实现协同飞行行为的自组织形成。",
    icon: "🤝",
    color: "#10b981",
  },
  {
    index: "3",
    title: "奖励量级设计",
    subtitle: "Hierarchical Reward Scaling",
    body: "奖励采用分层结构：任务成功奖励 +1000、碰撞惩罚 -500、协同奖励 +1、距离塑形奖励 -0.001 × Distance。不同量级之间形成明显层次，使智能体优先关注任务完成与安全飞行，同时兼顾编队协同效果。",
    icon: "📊",
    color: "#f59e0b",
  },
  {
    index: "4",
    title: "协同编队效果",
    subtitle: "Formation Convergence Effect",
    body: "当全部僚机进入领队附近指定范围后，系统停止距离惩罚，并进一步通过速度同步奖励促进稳定编队飞行，从而形成具有工程意义的多无人机协同行为。",
    icon: "✨",
    color: "#ec4899",
  },
];

// ── Styles ──
const tableCellBase =
  "px-3 py-2.5 font-mono border-b border-white/5 align-middle";
const tableHeaderCell =
  "px-3 py-3 font-mono text-[11px] tracking-[0.15em] uppercase border-b border-white/10 text-slate-400";

export default function Scene07Reward({ subStep }: { subStep: number }) {
  return (
    <div className="w-full h-full overflow-hidden">
      <div className="h-full relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* ─── SubStep 0: Title ─── */}
          {subStep === 0 && (
            <motion.div
              key="title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <p
                className="text-cyan-400 font-mono tracking-[0.3em] uppercase mb-4"
                style={{ fontSize: "14px" }}
              >
                奖励函数设计
              </p>
              <h2
                className="font-bold text-white leading-[1.1] mb-6"
                style={{ fontSize: "clamp(42px, 8vw, 110px)" }}
              >
                奖励函数设计
              </h2>
              <p
                className="text-slate-400 leading-relaxed max-w-xl"
                style={{ fontSize: "clamp(18px, 2.5vw, 28px)" }}
              >
                本项目采用非对称多智能体强化学习奖励机制，其中
                <span className="text-cyan-400 font-semibold">领队无人机（Hero UAV）</span>
                与{" "}
                <span className="text-fuchsia-400 font-semibold">4 架僚机无人机（Wingman UAV）</span>
                {" "}具有不同任务目标。
              </p>
              <p
                className="text-slate-500 mt-4 leading-relaxed max-w-lg"
                style={{ fontSize: "clamp(16px, 2vw, 22px)" }}
              >
                🚁 领队负责到达目标区域，🎯 僚机负责保持协同编队并跟随领队运动。
              </p>
              <p className="mt-8 text-slate-600 font-mono text-xs">
                按 → 键深入探索奖励设计
              </p>
            </motion.div>
          )}

          {/* ─── SubStep 1: Hero UAV Reward ─── */}
          {subStep === 1 && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="flex flex-col items-center justify-center px-4 w-full max-w-3xl mx-auto"
            >
              <p
                className="font-mono tracking-[0.3em] uppercase mb-4"
                style={{ color: "#22d3ee", fontSize: "14px" }}
              >
                🚁 领队无人机
              </p>
              <h3
                className="font-bold text-white leading-[1.1] mb-2"
                style={{ fontSize: "clamp(28px, 5vw, 60px)" }}
              >
                领队无人机奖励函数
              </h3>

              {/* Formula */}
              <div className="my-4 bg-white/[0.03] border border-white/10 rounded-lg px-6 py-4">
                <KatexFormula
                  latex="R_{\\text{hero}} = R_{\\text{edge}} + R_{\\text{obstacle}} + R_{\\text{goal}} + R_{\\text{speed}} + R_{\\text{formation}}"
                  displayMode={true}
                />
              </div>

              {/* Table */}
              <div className="w-full overflow-x-auto mt-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.03]">
                      <th className={tableHeaderCell}>奖励项</th>
                      <th className={tableHeaderCell}>条件</th>
                      <th className={tableHeaderCell}>奖励值</th>
                      <th className={tableHeaderCell}>作用</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heroRewards.map((r, i) => (
                      <motion.tr
                        key={r.item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.35 }}
                        className="hover:bg-white/[0.04] transition-colors"
                      >
                        <td className={tableCellBase}>
                          <span className="mr-1.5">{r.icon}</span>
                          <span style={{ color: r.color, fontSize: "13px" }} className="font-semibold">
                            {r.item}
                          </span>
                        </td>
                        <td className={tableCellBase}>
                          <span className="text-slate-300" style={{ fontSize: "12px" }}>
                            {r.condition}
                          </span>
                        </td>
                        <td className={tableCellBase}>
                          <span
                            className="font-bold font-mono"
                            style={{
                              color: r.value.startsWith("-") ? "#ef4444" : "#10b981",
                              fontSize: "13px",
                            }}
                          >
                            {r.value}
                          </span>
                        </td>
                        <td className={tableCellBase}>
                          <span className="text-slate-400" style={{ fontSize: "12px" }}>
                            {r.effect}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-6 text-slate-600 font-mono text-xs">
                领队奖励 · 1 / 3
              </p>
            </motion.div>
          )}

          {/* ─── SubStep 2: Wingman UAV Reward ─── */}
          {subStep === 2 && (
            <motion.div
              key="wingman"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="flex flex-col items-center justify-center px-4 w-full max-w-3xl mx-auto"
            >
              <p
                className="font-mono tracking-[0.3em] uppercase mb-4"
                style={{ color: "#d946ef", fontSize: "14px" }}
              >
                🤝 僚机无人机
              </p>
              <h3
                className="font-bold text-white leading-[1.1] mb-2"
                style={{ fontSize: "clamp(28px, 5vw, 60px)" }}
              >
                僚机无人机奖励函数
              </h3>

              {/* Formula */}
              <div className="my-4 bg-white/[0.03] border border-white/10 rounded-lg px-6 py-4">
                <KatexFormula
                  latex="R_{\\text{wingman}} = R_{\\text{follow}} + R_{\\text{speed}}"
                  displayMode={true}
                />
              </div>
              <p className="text-slate-500 mb-2" style={{ fontSize: "14px" }}>
                每架僚机采用独立奖励，各自优化自身行为。
              </p>

              {/* Table */}
              <div className="w-full overflow-x-auto mt-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.03]">
                      <th className={tableHeaderCell}>奖励项</th>
                      <th className={tableHeaderCell}>条件</th>
                      <th className={tableHeaderCell}>奖励值</th>
                      <th className={tableHeaderCell}>作用</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wingmanRewards.map((r, i) => (
                      <motion.tr
                        key={r.item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.35 }}
                        className="hover:bg-white/[0.04] transition-colors"
                      >
                        <td className={tableCellBase}>
                          <span className="mr-1.5">{r.icon}</span>
                          <span style={{ color: r.color, fontSize: "13px" }} className="font-semibold">
                            {r.item}
                          </span>
                        </td>
                        <td className={tableCellBase}>
                          <span className="text-slate-300" style={{ fontSize: "12px" }}>
                            {r.condition}
                          </span>
                        </td>
                        <td className={tableCellBase}>
                          <span
                            className="font-bold font-mono"
                            style={{
                              color: r.value.startsWith("-") ? "#ef4444" : "#10b981",
                              fontSize: "13px",
                            }}
                          >
                            {r.value}
                          </span>
                        </td>
                        <td className={tableCellBase}>
                          <span className="text-slate-400" style={{ fontSize: "12px" }}>
                            {r.effect}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-6 text-slate-600 font-mono text-xs">
                僚机奖励 · 2 / 3
              </p>
            </motion.div>
          )}

          {/* ─── SubStep 3: Design Philosophy ─── */}
          {subStep === 3 && (
            <motion.div
              key="philosophy"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="flex flex-col items-center justify-center px-4 w-full max-w-3xl mx-auto"
            >
              <p
                className="text-amber-400 font-mono tracking-[0.3em] uppercase mb-4"
                style={{ fontSize: "14px" }}
              >
                💡 设计思想分析
              </p>
              <h3
                className="font-bold text-white leading-[1.1] mb-8"
                style={{ fontSize: "clamp(28px, 5vw, 55px)" }}
              >
                奖励设计思想
              </h3>

              <div className="space-y-5 w-full">
                {philosophies.slice(0, 2).map((p, i) => (
                  <motion.div
                    key={p.index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.4 }}
                    className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="font-black text-2xl leading-none mt-0.5"
                        style={{ color: p.color }}
                      >
                        {p.index}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{p.icon}</span>
                          <h4
                            className="font-bold text-white"
                            style={{ fontSize: "18px" }}
                          >
                            {p.title}
                          </h4>
                        </div>
                        <p
                          className="text-slate-500 font-mono mb-2"
                          style={{ fontSize: "12px" }}
                        >
                          {p.subtitle}
                        </p>
                        <p
                          className="text-slate-300 leading-relaxed"
                          style={{ fontSize: "14px" }}
                        >
                          {p.body}
                        </p>
                        {p.formula && (
                          <div className="mt-3 bg-white/[0.02] border border-white/[0.05] rounded px-4 py-2 inline-block">
                            <KatexFormula latex={p.formula} displayMode={true} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="mt-6 text-slate-600 font-mono text-xs">
                设计思想 · 3 / 3
              </p>
            </motion.div>
          )}

          {/* ─── SubStep 4: More Design Philosophy + Summary ─── */}
          {subStep === 4 && (
            <motion.div
              key="philosophy-2"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="flex flex-col items-center justify-center px-4 w-full max-w-3xl mx-auto"
            >
              <div className="space-y-5 w-full">
                {philosophies.slice(2, 4).map((p, i) => (
                  <motion.div
                    key={p.index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.4 }}
                    className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="font-black text-2xl leading-none mt-0.5"
                        style={{ color: p.color }}
                      >
                        {p.index}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{p.icon}</span>
                          <h4
                            className="font-bold text-white"
                            style={{ fontSize: "18px" }}
                          >
                            {p.title}
                          </h4>
                        </div>
                        <p
                          className="text-slate-500 font-mono mb-2"
                          style={{ fontSize: "12px" }}
                        >
                          {p.subtitle}
                        </p>
                        <p
                          className="text-slate-300 leading-relaxed"
                          style={{ fontSize: "14px" }}
                        >
                          {p.body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-6 text-center"
              >
                <p
                  className="text-slate-400 font-light italic"
                  style={{ fontSize: "clamp(16px, 2vw, 22px)" }}
                >
                  "奖励定义了什么是好的协同 —— 数学自己找到了答案。"
                </p>
                <p className="mt-3 text-slate-500 font-mono text-xs">
                  —— Reward Function Design Philosophy
                </p>
              </motion.div>

              <p className="mt-6 text-slate-600 font-mono text-xs">
                设计思想 · 总结
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
