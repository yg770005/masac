"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ============================================================
// Part 1: Future Applications
// ============================================================
const applications = [
  {
    icon: "🚦",
    title: "智慧交通",
    en: "Smart Transportation",
    desc: "城市空中交通（UAM）管理、无人机物流配送、空中走廊流量控制——MASAC的多目标权衡能力天然适配复杂交通场景的动态资源调度。",
  },
  {
    icon: "📦",
    title: "无人机物流",
    en: "Drone Logistics",
    desc: "多机协同配送路线规划，动态避让与空中交汇点管理。分布式决策使每架无人机能独立应对配送途中的突发情况。",
  },
  {
    icon: "🚨",
    title: "应急救援",
    en: "Emergency Response",
    desc: "灾后多机协同搜救、应急物资精准投送。通信受限环境下的自主协同能力使MASAC在应急场景中具有独特优势。",
  },
  {
    icon: "⚡",
    title: "智能巡检",
    en: "Intelligent Inspection",
    desc: "电力线路、油气管道、风电场的多机协同自主巡检。MASAC使无人机群能自动划分巡检区域、动态调整飞行路径。",
  },
  {
    icon: "🛫",
    title: "空中交通管理",
    en: "Air Traffic Management",
    desc: "低空空域多飞行器的安全间隔管理、冲突解决与航迹规划——这是MASAC最直接的扩展方向。",
  },
];

function FutureApplications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref}>
      <div className="flex items-center gap-3 mb-8">
        <span className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-400 font-mono">
          A
        </span>
        <h3 className="text-lg font-bold text-white">应用前景</h3>
        <span className="text-[10px] font-mono text-slate-600">FUTURE APPLICATIONS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {applications.map((app, i) => (
          <motion.div
            key={app.en}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group p-5 rounded-2xl border border-cyan-500/10 bg-gradient-to-b from-cyan-500/[0.03] to-transparent hover:border-cyan-500/30 transition-all duration-500"
          >
            <div className="text-2xl mb-3">{app.icon}</div>
            <h4 className="text-sm font-bold text-white mb-1">{app.title}</h4>
            <p className="text-[9px] font-mono text-slate-600 mb-2">{app.en}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{app.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Part 2: Current Limitations
// ============================================================
const limitations = [
  {
    id: "01",
    title: "训练成本高昂",
    en: "High Training Cost",
    severity: "high" as const,
    detail:
      "当前MASAC在仿真环境中需约200K episodes收敛，单次训练耗时约48 GPU-hours。迁移至新场景时需从头训练，成本难以接受。",
    techDetail: "根本原因：Model-Free方法缺乏对环境的内部模型，需大量试错样本。SAC的熵正则化虽提升探索，但也降低了样本效率。",
  },
  {
    id: "02",
    title: "样本效率低下",
    en: "Low Sample Efficiency",
    severity: "high" as const,
    detail:
      "每个transition仅被使用一次梯度更新。智能体需要经历数百万次交互才能习得有效策略，样本利用率不足。",
    techDetail: "根本原因：On-policy / Off-policy混合训练中，早期经验快速失效。优先经验回放（PER）部分缓解但未根本解决。",
  },
  {
    id: "03",
    title: "泛化能力不足",
    en: "Limited Generalization",
    severity: "medium" as const,
    detail:
      "当前策略对训练环境过拟合——改变目标运动模式、增加/减少无人机数量、修改编队构型后，策略性能显著下降。",
    techDetail: "根本原因：标准MLP策略网络缺乏对多智能体关系结构的归纳偏置。策略学到了场景特定的解，而非通用的协同原则。",
  },
  {
    id: "04",
    title: "Sim-to-Real差距",
    en: "Sim-to-Real Gap",
    severity: "high" as const,
    detail:
      "仿真环境使用简化的质点动力学模型，但真实无人机受空气动力学、风扰、传感器噪声等复杂因素影响，策略难以直接迁移。",
    techDetail: "根本原因：Domain Randomization仅覆盖部分分布偏移，但真实世界的物理复杂性远超仿真所能模拟。",
  },
  {
    id: "05",
    title: "通信假设理想化",
    en: "Idealized Communication",
    severity: "medium" as const,
    detail:
      "当前Critic训练假设全局信息完全可用，但实际场景中通信延迟、丢包、阻塞等约束使得集中式价值评估难以实现。",
    techDetail: "根本原因：CTDE范式在训练阶段对通信的假设过强。真实部署时Critic不可用，策略质量依赖Actor自身的泛化。",
  },
];

function CurrentLimitations() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="mt-20">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-6 h-6 rounded bg-red-500/20 border border-red-500/30 flex items-center justify-center text-[10px] text-red-400 font-mono">
          B
        </span>
        <h3 className="text-lg font-bold text-white">当前局限性</h3>
        <span className="text-[10px] font-mono text-slate-600">CURRENT LIMITATIONS</span>
      </div>

      <div className="space-y-4">
        {limitations.map((lim, i) => (
          <motion.div
            key={lim.id}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`p-5 rounded-2xl border transition-all ${
              lim.severity === "high"
                ? "border-red-500/15 bg-red-500/[0.02] hover:border-red-500/30"
                : "border-amber-500/15 bg-amber-500/[0.02] hover:border-amber-500/30"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* 编号 */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                  lim.severity === "high"
                    ? "bg-red-500/10 text-red-400 border border-red-500/30"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                }`}
              >
                {lim.id}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-sm font-bold text-white">{lim.title}</h4>
                  <span className="text-[9px] font-mono text-slate-600">{lim.en}</span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                      lim.severity === "high"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {lim.severity === "high" ? "关键瓶颈" : "重要问题"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{lim.detail}</p>
                <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                  <span className="text-[9px] font-mono text-slate-600 uppercase">技术分析</span>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{lim.techDetail}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Part 3: Future Research Directions
// ============================================================
const futureDirections = [
  {
    title: "Transformer for MARL",
    icon: "⊞",
    color: "#22d3ee",
    desc: "用Self-Attention替换MLP策略网络，使智能体能够动态关注最相关的队友和环境特征。Multi-Head Attention天然建模多智能体交互关系。",
    impact: "解决泛化问题——Transformer的排列等变性使策略能泛化到不同数量和排列的智能体。",
  },
  {
    title: "Decision Transformer",
    icon: "⊟",
    color: "#3b82f6",
    desc: "将序列决策建模为条件序列预测问题。不再最大化奖励，而是基于期望回报（Return-to-Go）生成动作序列。",
    impact: "稀疏奖励场景下表现优异，且可与大规模预训练结合——用离线数据预训练，再用少量在线数据微调。",
  },
  {
    title: "World Model & MBRL",
    icon: "⊠",
    color: "#8b5cf6",
    desc: "学习环境的内部动力学模型（World Model），在&ldquo;想象&rdquo;中规划未来。结合Model-Based RL与SAC的探索能力。",
    impact: "大幅提升样本效率——1个真实transition可在World Model中被利用100次。显著降低训练成本。",
  },
  {
    title: "Large Agent Systems",
    icon: "⊡",
    color: "#f59e0b",
    desc: "将大语言模型的推理能力引入多智能体系统。用自然语言描述任务目标，让LLM协调多智能体的高层策略。",
    impact: "零样本泛化——无需针对每个新任务重新训练。自然语言接口使非专家也能定义复杂的多智能体任务。",
  },
  {
    title: "Embodied AI",
    icon: "⊗",
    color: "#10b981",
    desc: "将MASAC从仿真推向真实机器人。结合Sim-to-Real迁移、Domain Randomization和在线自适应。",
    impact: "闭环Sim-to-Real——在真实飞行中持续收集数据，在线微调策略，缩小Sim-to-Real差距。",
  },
  {
    title: "Communication Learning",
    icon: "⊕",
    color: "#ec4899",
    desc: "让智能体学会'何时通信'和'通信什么'，而非假设完美的全局通信。通信本身成为可学习的动作。",
    impact: "真正去中心化——智能体学会稀疏、高效的通信协议，适用于通信受限的真实场景。",
  },
];

function FutureDirections() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="mt-20">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-6 h-6 rounded bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] text-purple-400 font-mono">
          C
        </span>
        <h3 className="text-lg font-bold text-white">未来研究方向</h3>
        <span className="text-[10px] font-mono text-slate-600">FUTURE RESEARCH DIRECTIONS</span>
      </div>

      <p className="text-sm text-slate-400 mb-8 max-w-2xl">
        当前的MASAC只是一个起点。以下是能够从根本上改进MASAC的前沿AI研究方向，
        每一个方向都与当前系统存在的局限性直接对应。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {futureDirections.map((dir, i) => (
          <motion.div
            key={dir.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all duration-500"
          >
            <div className="text-2xl mb-3" style={{ color: dir.color }}>{dir.icon}</div>
            <h4 className="text-sm font-bold text-white mb-2" style={{ color: dir.color }}>
              {dir.title}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">{dir.desc}</p>
            <div className="pt-3 border-t border-white/10">
              <span className="text-[9px] font-mono uppercase" style={{ color: dir.color }}>
                IMPACT
              </span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{dir.impact}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Part 4: Personal Reflection
// ============================================================
function PersonalReflection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const reflections = [
    {
      question: "通过这个项目，我学到了什么？",
      answer:
        "多智能体强化学习远不只是“多个智能体同时训练”。真正的挑战在于——如何在分布式局部观测的条件下，让独立决策的个体涌现出全局一致的协同行为。我深刻理解了CTDE（集中训练分布式执行）范式的优雅：在训练阶段注入全局信息，在执行阶段保持分布式的鲁棒性。",
    },
    {
      question: "MASAC解决了什么传统方法无法解决的问题？",
      answer:
        "传统PID控制需要精确建模，规则控制无法覆盖所有场景，经典优化难以实时求解。MASAC的核心突破在于——端到端地从原始状态空间直接学习到连续动作空间的映射，无需任何人工设计的控制律。特别是SAC的最大熵框架，在探索与利用之间找到了优雅的平衡。",
    },
    {
      question: "MASAC的不足在哪里？",
      answer:
        "最根本的瓶颈是样本效率——200K episodes的训练成本在实际部署中难以承受。此外，当前策略对训练配置（无人机数量、编队构型、目标运动模式）高度过拟合，缺乏泛化性。Sim-to-Real的鸿沟也意味着仿真中的'完美策略'离真实飞行还有很长的路要走。",
    },
    {
      question: "如果继续研究，我会往哪些方向推进？",
      answer:
        "三个方向最令我兴奋。第一，用Transformer架构重建策略网络，利用Self-Attention的自然归纳偏置建模多智能体交互。第二，引入Model-Based方法，让智能体学习环境动力学模型，在&ldquo;想象&rdquo;中规划，从根本上提升样本效率。第三，探索将大模型/基础模型引入多智能体系统——如果我们能用自然语言描述&ldquo;编队追踪移动目标&rdquo;，AI就能自主协调多智能体执行，那将是真正的通用智能。",
    },
  ];

  return (
    <div ref={ref} className="mt-20">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400 font-mono">
          D
        </span>
        <h3 className="text-lg font-bold text-white">个人思考</h3>
        <span className="text-[10px] font-mono text-slate-600">PERSONAL REFLECTION</span>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {reflections.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[10px] text-cyan-400 font-mono flex-shrink-0 mt-0.5">
                ?
              </span>
              <h4 className="text-sm font-bold text-white">{item.question}</h4>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed pl-9">{item.answer}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 主组件
// ============================================================
export default function FutureVision() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer className="relative pt-24 lg:pt-32 pb-12 px-6 lg:px-16 bg-[#020617] border-t border-white/5">
      {/* 背景 */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-purple-500/[0.02] to-transparent pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

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
              FUTURE VISION & REFLECTION
            </span>
            <span className="flex-1 h-px w-16 bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight mb-4">
            <span className="section-title pb-4">
              未来<span className="text-purple-400">展望</span>与<span className="text-emerald-400">个人思考</span>
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl text-sm lg:text-base">
            不回避局限，不停止探索 —— 诚实面对当前问题，明确未来方向
          </p>
        </motion.div>

        {/* Part A: Future Applications */}
        <FutureApplications />

        {/* Part B: Current Limitations */}
        <CurrentLimitations />

        {/* Part C: Future Research Directions */}
        <FutureDirections />

        {/* Part D: Personal Reflection */}
        <PersonalReflection />

        {/* 底部栏 */}
        <div className="mt-20 flex flex-col lg:flex-row items-center justify-between pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4 lg:mb-0">
            <span className="text-lg font-black tracking-[0.2em] neon-text">MASAC</span>
            <span className="h-4 w-px bg-slate-700" />
            <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">
              Multi-Agent Soft Actor-Critic
            </span>
          </div>
          <div className="text-center lg:text-right">
            <p className="text-[10px] text-slate-600 font-mono">
              © {new Date().getFullYear()} MASAC Research Team. All Rights Reserved.
            </p>
            <p className="text-[10px] text-slate-700 mt-1">
              Built with Next.js · Three.js · Framer Motion · ECharts
            </p>
          </div>
        </div>

        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>
    </footer>
  );
}
