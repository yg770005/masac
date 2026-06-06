"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// ============================================================
// 独立的动画步骤组件
// ============================================================

interface StepProps {
  step: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  color?: string;
  delay?: number;
}

function StepBlock({ step, title, subtitle, children, color = "#22d3ee", delay = 0 }: StepProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="relative pl-16 lg:pl-20 pb-16 last:pb-0"
    >
      {/* 左侧时间线 */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center">
        {/* 节点 */}
        <div
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-mono font-bold z-10"
          style={{
            borderColor: color,
            backgroundColor: `${color}15`,
            color: color,
          }}
        >
          {String(step).padStart(2, "0")}
        </div>
        {/* 连接线 */}
        <div className="flex-1 w-px mt-3" style={{ background: `linear-gradient(180deg, ${color}44, transparent)` }} />
      </div>

      {/* 内容 */}
      <div>
        <div className="flex items-baseline gap-3 mb-4">
          <h3 className="text-lg lg:text-xl font-bold text-white">{title}</h3>
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">{subtitle}</span>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

// ============================================================
// Section 1: State Observation
// ============================================================
function StateObservation() {
  const sensors = [
    { label: "自身位置", value: "p_i = (x, y, z)", color: "#22d3ee" },
    { label: "自身速度", value: "v_i = (v_x, v_y, v_z)", color: "#3b82f6" },
    { label: "邻居位置", value: "p_j, j ∈ N_i", color: "#6366f1" },
    { label: "目标位置", value: "p_target", color: "#ef4444" },
    { label: "相对距离", value: "d_ij = ||p_i - p_j||", color: "#f59e0b" },
    { label: "编队偏移", value: "Δ_form = p_i - p_desired", color: "#10b981" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
        每个UAV从局部观测中构建状态向量。无需全局信息，每个智能体仅基于
        <span className="text-cyan-400 font-semibold">局部可观测信息</span>进行独立决策。
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {sensors.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="p-3 rounded-xl border border-white/10 bg-white/[0.02]"
          >
            <div className="text-[10px] text-slate-500 mb-1">{s.label}</div>
            <div className="text-xs font-mono" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Section 2: Policy Network (Actor)
// ============================================================
function PolicyNetwork() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
        Actor网络将状态映射到动作。采用<span className="text-cyan-400 font-semibold">随机策略</span>，
        输出高斯分布参数（均值μ和方差σ），通过重参数化技巧采样连续动作。
      </p>

      {/* 流程图 */}
      <div className="relative p-6 rounded-2xl border border-cyan-500/20 bg-black/40">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
          {/* State */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-2xl border-2 border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center">
              <span className="text-xs font-mono text-cyan-400">State</span>
            </div>
            <span className="text-[9px] text-slate-600 font-mono">S ∈ ℝⁿ</span>
          </div>

          {/* 箭头 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 hidden lg:block" />
            <span className="text-[8px] text-slate-700 font-mono lg:hidden">↓</span>
          </div>

          {/* Actor Network */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-28 h-28 rounded-2xl border-2 border-blue-500/40 bg-blue-500/10 flex flex-col items-center justify-center gap-1">
              <span className="text-[10px] font-mono text-blue-400 font-bold">Actor</span>
              <span className="text-[8px] font-mono text-blue-400/60">Network</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-400/50 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-blue-400/50 animate-pulse" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
            <span className="text-[9px] text-slate-600 font-mono">π_θ(a|s)</span>
          </div>

          {/* 箭头 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 hidden lg:block" />
            <span className="text-[8px] text-slate-700 font-mono lg:hidden">↓</span>
          </div>

          {/* Action */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-2xl border-2 border-purple-500/40 bg-purple-500/10 flex flex-col items-center justify-center gap-2">
              <span className="text-xs font-mono text-purple-400">Action</span>
              <div className="text-[8px] space-y-0.5">
                <div className="text-purple-300/60">速度调整</div>
                <div className="text-purple-300/60">转向控制</div>
                <div className="text-purple-300/60">加速度控制</div>
              </div>
            </div>
            <span className="text-[9px] text-slate-600 font-mono">A ∈ ℝᵐ</span>
          </div>
        </div>

        {/* 随机性提示 */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-500">
            策略输出为<span className="text-cyan-400">高斯分布</span>——
            均值决定"最佳动作"，方差决定"探索程度"，二者<span className="text-amber-400">同时学习</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Section 3: Environment Interaction
// ============================================================
function EnvironmentInteraction() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
        动作施加于环境后，物理引擎更新所有无人机和目标的运动状态，计算新的位置、速度和编队构型。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "无人机状态更新", items: ["位置: p_i ← p_i + v_i·Δt", "速度: v_i ← v_i + a_i·Δt", "姿态: θ_i ← θ_i + ω_i·Δt"], color: "#22d3ee" },
          { title: "目标状态更新", items: ["目标按预设轨迹运动", "或由智能体策略控制", "支持随机扰动模拟不确定性"], color: "#ef4444" },
          { title: "编队状态评估", items: ["计算Leader-Follower偏差", "检测碰撞事件", "计算目标追踪误差"], color: "#f59e0b" },
        ].map((env, i) => (
          <motion.div
            key={env.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="p-4 rounded-xl border border-white/10 bg-white/[0.02]"
          >
            <h4 className="text-xs font-bold text-white mb-3" style={{ color: env.color }}>{env.title}</h4>
            <div className="space-y-2">
              {env.items.map((item, j) => (
                <div key={j} className="text-[11px] font-mono text-slate-500">{item}</div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Section 4: Reward Design
// ============================================================
function RewardDesign() {
  const rewards = [
    { name: "目标接近奖励", formula: "r_target = -α₁ · ||p_leader - p_target||", desc: "鼓励Leader缩短与目标距离", color: "#22d3ee", type: "positive" as const },
    { name: "编队保持奖励", formula: "r_form = -α₂ · Σ||p_i - p_i_desired||", desc: "鼓励Follower维持预定队形", color: "#3b82f6", type: "positive" as const },
    { name: "安全距离奖励", formula: "r_safe = α₃ · min(0, d_ij - d_safe)", desc: "鼓励UAV之间保持安全间距", color: "#10b981", type: "positive" as const },
    { name: "能耗惩罚", formula: "r_energy = -α₄ · Σ||a_i||²", desc: "惩罚过大加速度，鼓励平滑控制", color: "#f59e0b", type: "negative" as const },
    { name: "碰撞惩罚", formula: "r_collision = -α₅ · I(d_ij < d_min)", desc: "碰撞时施加巨大负奖励", color: "#ef4444", type: "negative" as const },
    { name: "偏离惩罚", formula: "r_drift = -α₆ · I(||p - p_form|| > ε)", desc: "编队严重偏离时施加惩罚", color: "#ec4899", type: "negative" as const },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
        奖励函数是MASAC的<span className="text-amber-400 font-semibold">核心设计</span>——
        稀疏+稠密混合奖励，从多个维度引导策略收敛至最优协同行为。
      </p>

      {/* 总奖励公式 */}
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] text-center">
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.2em]">TOTAL REWARD</span>
        <p className="mt-2 text-sm font-mono text-slate-300">
          R = r_target + r_form + r_safe + r_energy + r_collision + r_drift
        </p>
      </div>

      {/* 奖励卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rewards.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className={`p-4 rounded-xl border ${
              r.type === "positive"
                ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                : "border-red-500/20 bg-red-500/[0.03]"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${r.type === "positive" ? "bg-emerald-400" : "bg-red-400"}`} />
              <span className="text-xs font-bold text-white">{r.name}</span>
            </div>
            <div className="text-[10px] font-mono mb-1.5" style={{ color: r.color }}>{r.formula}</div>
            <div className="text-[11px] text-slate-500">{r.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Section 5: Critic Evaluation
// ============================================================
function CriticEvaluation() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
        Critic网络评估<span className="text-amber-400 font-semibold">全局状态-动作</span>的长期价值。
        它不是只看眼前收益，而是估计<span className="text-cyan-400 font-semibold">未来累积折扣奖励的期望</span>。
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 当前 vs 长期 */}
        <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
          <h4 className="text-sm font-bold text-white mb-4">为什么只看当前收益不够？</h4>
          <div className="space-y-4">
            {[
              { now: "接近目标 → +10", future: "但可能撞上队友 → 明天-100" },
              { now: "保持距离 → -5 (偏离目标)", future: "但避免碰撞 → 长远更安全" },
              { now: "加速机动 → -2 (能耗惩罚)", future: "但快速到位 → 累积高追踪奖励" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[10px] font-mono text-slate-600 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="text-xs text-slate-400">{item.now}</div>
                  <div className="text-xs text-cyan-400">→ {item.future}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 公式 */}
        <div className="p-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.03]">
          <h4 className="text-sm font-bold text-white mb-4">Critic的目标</h4>
          <div className="space-y-3 text-center">
            <div className="p-3 rounded-lg bg-black/40">
              <p className="text-xs font-mono text-slate-300">
                Q(s, a) = E[ Σ γ^t · r_t | s₀=s, a₀=a ]
              </p>
            </div>
            <div className="text-[11px] text-slate-500 space-y-1.5 text-left">
              <p>• <span className="text-cyan-400">γ (gamma)</span> — 折扣因子，决定未来奖励的衰减速度</p>
              <p>• <span className="text-cyan-400">γ → 0</span> — 只看眼前，急功近利</p>
              <p>• <span className="text-cyan-400">γ → 1</span> — 看重未来，深谋远虑</p>
              <p>• <span className="text-amber-400">Soft Critic</span> — 额外考虑策略熵，鼓励探索</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Section 6: Replay Buffer
// ============================================================
function ReplayBuffer() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
        经验回放打破<span className="text-amber-400">样本时序相关性</span>，提升数据效率。
        随机采样历史经验，使每次参数更新都用到了<span className="text-cyan-400">来自不同时期的多样化数据</span>。
      </p>

      <div className="relative p-6 rounded-2xl border border-cyan-500/20 bg-black/40 overflow-hidden">
        {/* 缓冲区示意图 */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* 环境交互 */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-xl border border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center">
              <span className="text-[10px] font-mono text-cyan-400">采集</span>
            </div>
            <span className="text-[9px] text-slate-600">(s, a, r, s')</span>
          </div>

          <span className="text-slate-700">→</span>

          {/* 缓冲区 */}
          <motion.div
            className="w-40 h-24 rounded-xl border-2 border-dashed border-amber-500/40 bg-amber-500/[0.03] flex flex-col items-center justify-center gap-1"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-xs font-mono text-amber-400 font-bold">Replay Buffer</span>
            <span className="text-[9px] text-slate-600">容量: 1M transitions</span>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded"
                  style={{ backgroundColor: `hsl(${30 + i * 10}, 80%, 50%)` }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                />
              ))}
            </div>
          </motion.div>

          <span className="text-slate-700">→</span>

          {/* 随机采样 */}
          <motion.div
            className="w-20 h-16 rounded-xl border border-purple-500/30 bg-purple-500/5 flex flex-col items-center justify-center gap-1"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-[10px] font-mono text-purple-400">随机</span>
            <span className="text-[10px] font-mono text-purple-400">采样</span>
          </motion.div>

          <span className="text-slate-700">→</span>

          {/* 训练 */}
          <div className="w-16 h-16 rounded-xl border border-green-500/30 bg-green-500/5 flex items-center justify-center">
            <span className="text-[10px] font-mono text-green-400">训练</span>
          </div>
        </div>

        {/* 关键优势 */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "打破相关性", desc: "随机采样消除相邻样本的时序依赖" },
            { label: "数据复用", desc: "每条经验可被多次学习，提升效率" },
            { label: "稳定训练", desc: "大batch平滑梯度，减少方差" },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg border border-white/10 text-center">
              <div className="text-[11px] font-bold text-white mb-1">{item.label}</div>
              <div className="text-[10px] text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Section 7: Multi-Agent Learning
// ============================================================
function MultiAgentLearning() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
        MASAC的核心思想——
        <span className="text-cyan-400 font-semibold">集中式训练，分布式执行</span>。
        Critic在训练时获取全局信息，Actor在执行时仅需局部观测。
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          {
            title: "独立执行",
            desc: "每个UAV的Actor网络仅依赖自身局部观测产生动作，不依赖中心节点，保证系统鲁棒性",
            icon: "⊡",
            color: "#22d3ee",
            details: ["本地状态输入", "独立策略输出", "无中心依赖", "通信故障时仍可运行"],
          },
          {
            title: "联合训练",
            desc: "Critic网络在训练阶段获取所有智能体的全局状态-动作信息，实现协同价值评估",
            icon: "⊕",
            color: "#8b5cf6",
            details: ["全局信息Critic", "集中价值评估", "跨智能体信用分配", "协调策略改进方向"],
          },
          {
            title: "共享经验",
            desc: "多智能体的交互数据统一存入回放缓冲区，打破单智能体数据局限，加速集体学习",
            icon: "⊗",
            color: "#f59e0b",
            details: ["统一经验池", "跨角色泛化", "样本效率5x提升", "涌现协同行为"],
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all"
          >
            <div className="text-2xl mb-3" style={{ color: item.color }}>{item.icon}</div>
            <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.desc}</p>
            <div className="pt-3 border-t border-white/10 space-y-1">
              {item.details.map((d, j) => (
                <div key={j} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-slate-500">{d}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Section 8: Final Learned Behavior
// ============================================================
function FinalBehavior() {
  const behaviors = [
    {
      title: "智能目标追踪",
      desc: "Leader UAV学会根据目标运动模式预测轨迹，主动截击而非被动跟随。速度与距离的权衡自动优化。",
      color: "#ef4444",
      icon: "◎",
    },
    {
      title: "鲁棒编队保持",
      desc: "Follower UAV在目标追踪过程中动态调整队形，编队误差 < 0.3m，队形恢复时间 < 2s。",
      color: "#22d3ee",
      icon: "◇",
    },
    {
      title: "零碰撞协同",
      desc: "5架UAV在密集空域中保持 > 1.5m 安全距离，200K episodes训练后碰撞率趋近于零。",
      color: "#10b981",
      icon: "○",
    },
    {
      title: "分布式协同决策",
      desc: "无需中心控制器，每个UAV自主推理并协同行动，通信故障时仍维持编队稳定性。",
      color: "#8b5cf6",
      icon: "△",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {behaviors.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl" style={{ color: b.color }}>{b.icon}</span>
              <h4 className="text-sm font-bold text-white">{b.title}</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* 引导链接 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 text-center"
      >
        <p className="text-sm text-slate-400 mb-4">
          继续向下滚动，查看<span className="text-cyan-400 font-bold">训练驾驶舱</span>的实时数据曲线
          和<span className="text-blue-400 font-bold">无人机协同</span>的3D场景演示
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-primary text-[10px]"
          >
            ↓ 查看训练结果
          </button>
          <button
            onClick={() => document.getElementById("cooperation")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-secondary text-[10px]"
          >
            ↓ 查看3D演示
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// 主组件
// ============================================================
export default function HowMASACWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div className="relative py-24 lg:py-32 px-6 lg:px-16 bg-[#020617] grid-bg">
      {/* 背景光效 */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

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
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">
              HOW IT WORKS
            </span>
            <span className="flex-1 h-px w-16 bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight">
            <span className="section-title pb-4">
              MASAC<span className="text-cyan-400">如何解决</span>问题
            </span>
          </h2>
          <p className="mt-6 text-slate-500 max-w-2xl text-sm lg:text-base">
            从状态观测到最终习得协同行为 —— 逐步拆解MASAC算法的完整工作流程，
            用直观的可视化方式向所有人讲清楚深度强化学习如何驱动无人机协同
          </p>
        </motion.div>

        {/* 8个步骤 */}
        <StepBlock step={1} title="状态观测" subtitle="State Observation" color="#22d3ee" delay={0}>
          <StateObservation />
        </StepBlock>

        <StepBlock step={2} title="策略网络" subtitle="Policy Network (Actor)" color="#3b82f6" delay={0.05}>
          <PolicyNetwork />
        </StepBlock>

        <StepBlock step={3} title="环境交互" subtitle="Environment Interaction" color="#6366f1" delay={0.1}>
          <EnvironmentInteraction />
        </StepBlock>

        <StepBlock step={4} title="奖励设计" subtitle="Reward Design" color="#f59e0b" delay={0.15}>
          <RewardDesign />
        </StepBlock>

        <StepBlock step={5} title="价值评估" subtitle="Critic Evaluation" color="#8b5cf6" delay={0.2}>
          <CriticEvaluation />
        </StepBlock>

        <StepBlock step={6} title="经验回放" subtitle="Replay Buffer" color="#ec4899" delay={0.25}>
          <ReplayBuffer />
        </StepBlock>

        <StepBlock step={7} title="多智能体学习" subtitle="Multi-Agent Learning" color="#10b981" delay={0.3}>
          <MultiAgentLearning />
        </StepBlock>

        <StepBlock step={8} title="最终习得行为" subtitle="Final Learned Behavior" color="#22d3ee" delay={0.35}>
          <FinalBehavior />
        </StepBlock>
      </div>
    </div>
  );
}
