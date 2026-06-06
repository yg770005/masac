"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const nodes = [
  { id: "state", label: "State", sub: "状态空间", x: 50, y: 5, color: "#22d3ee", desc: "全局状态 S ∈ ℝⁿ" },
  { id: "actor", label: "Actor Network", sub: "策略网络", x: 50, y: 22, color: "#3b82f6", desc: "π(a|s) — 分布式决策" },
  { id: "action", label: "Action", sub: "动作空间", x: 50, y: 40, color: "#6366f1", desc: "A ∈ ℝᵐ — 连续控制" },
  { id: "env", label: "Environment", sub: "环境交互", x: 50, y: 58, color: "#8b5cf6", desc: "状态转移 & 奖励计算" },
  { id: "reward", label: "Reward", sub: "奖励信号", x: 50, y: 72, color: "#ec4899", desc: "R(s,a) — 混合奖励" },
  { id: "replay", label: "Replay Buffer", sub: "经验回放", x: 50, y: 87, color: "#f59e0b", desc: "优先经验采样" },
  { id: "critic", label: "Critic Network", sub: "价值网络", x: 15, y: 65, color: "#10b981", desc: "Q(s,a) — 集中评估" },
  { id: "policy", label: "Policy Update", sub: "策略更新", x: 85, y: 65, color: "#ef4444", desc: "∇J — 梯度优化" },
];

const connections = [
  { from: "state", to: "actor" },
  { from: "actor", to: "action" },
  { from: "action", to: "env" },
  { from: "env", to: "reward" },
  { from: "reward", to: "replay" },
  { from: "replay", to: "critic" },
  { from: "critic", to: "policy" },
  { from: "policy", to: "actor" },
];

function FlowNode({
  node,
  index,
  isActive,
  onClick,
}: {
  node: (typeof nodes)[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onClick={onClick}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        zIndex: isActive ? 20 : 10,
      }}
    >
      <div
        className={`relative px-4 py-3 rounded-xl border transition-all duration-500 ${
          isActive
            ? "border-current bg-black/60 scale-110"
            : "border-white/10 bg-black/30 hover:border-white/30"
        }`}
        style={{
          borderColor: isActive ? node.color : undefined,
          boxShadow: isActive ? `0 0 30px ${node.color}33, inset 0 0 20px ${node.color}11` : undefined,
        }}
      >
        {/* 发光点 */}
        <div
          className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full"
          style={{ backgroundColor: node.color, boxShadow: `0 0 10px ${node.color}` }}
        />

        <div className="text-xs font-mono font-bold" style={{ color: node.color }}>
          {node.label}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">{node.sub}</div>

        {/* 悬停详情 */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/90 border border-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-400">{node.desc}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AlgorithmFlow() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p + 0.5) % connections.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const getConnectionPath = (from: string, to: string) => {
    const fromNode = nodes.find((n) => n.id === from)!;
    const toNode = nodes.find((n) => n.id === to)!;
    const startX = fromNode.x;
    const startY = fromNode.y;
    const endX = toNode.x;
    const endY = toNode.y;
    const midX = (startX + endX) / 2;
    return `M ${startX}% ${startY}% C ${midX}% ${startY}%, ${midX}% ${endY}%, ${endX}% ${endY}%`;
  };

  return (
    <div className="relative py-24 lg:py-32 px-6 lg:px-16 bg-[#030712]">
      {/* 背景网格 */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

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
              ALGORITHM ARCHITECTURE
            </span>
            <span className="flex-1 h-px w-16 bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight">
            <span className="section-title pb-4">
              MASAC<span className="text-cyan-400">算法架构</span>
            </span>
          </h2>
          <p className="mt-6 text-slate-500 max-w-xl text-sm lg:text-base">
            Actor-Critic架构 + 集中训练分布式执行，端到端的多智能体协同优化
          </p>
        </motion.div>

        {/* 流程图 */}
        <div className="relative w-full" style={{ height: "550px" }}>
          {/* SVG连线 */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
            <defs>
              {connections.map((conn, i) => (
                <linearGradient
                  key={i}
                  id={`glow-${i}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor={
                      nodes.find((n) => n.id === conn.from)!.color
                    }
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      nodes.find((n) => n.id === conn.to)!.color
                    }
                    stopOpacity={0.8}
                  />
                </linearGradient>
              ))}
              <filter id="glow-filter">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 静态连线 */}
            {connections.map((conn, i) => (
              <path
                key={`static-${i}`}
                d={getConnectionPath(conn.from, conn.to)}
                fill="none"
                stroke={`url(#glow-${i})`}
                strokeWidth={1}
                opacity={0.15}
              />
            ))}

            {/* 动画流动连线 */}
            {connections.map((conn, i) => {
              const pathD = getConnectionPath(conn.from, conn.to);
              const isCurrent = Math.floor(progress) === i;
              return (
                <path
                  key={`flow-${i}`}
                  d={pathD}
                  fill="none"
                  stroke={`url(#glow-${i})`}
                  strokeWidth={2}
                  opacity={isCurrent ? 0.7 : 0}
                  filter="url(#glow-filter)"
                  strokeDasharray={isCurrent ? "4 8" : "0 1000"}
                  className="transition-opacity duration-500"
                />
              );
            })}
          </svg>

          {/* 节点 */}
          {nodes.map((node, i) => (
            <FlowNode
              key={node.id}
              node={node}
              index={i}
              isActive={activeNode === node.id}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
            />
          ))}

          {/* 流程指示 */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              {connections.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  animate={{
                    backgroundColor:
                      Math.floor(progress) === i ? "#22d3ee" : "#334155",
                    scale: Math.floor(progress) === i ? 1.5 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-600 font-mono">
              DATA FLOW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
