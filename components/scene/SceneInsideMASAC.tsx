"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// 8个子场景定义
const subScenes = [
  {
    title: "观测空间",
    subtitle: "每架无人机知道什么？",
    body: "每个智能体只能观测局部信息。自身位置、速度、目标方位、邻居距离、编队偏差——无全局视野，无中心调度。",
    quote: "每一次决策都始于观测。",
    color: "#22d3ee",
    range: [0, 0.11] as [number, number],
  },
  {
    title: "动作空间",
    subtitle: "无人机能控制什么？",
    body: "速度、航向、加速度——连续动作空间中的平滑控制信号。每一次动作都直接影响飞行轨迹和编队状态。",
    quote: "观测转化为行动。",
    color: "#3b82f6",
    range: [0.10, 0.21] as [number, number],
  },
  {
    title: "奖励系统",
    subtitle: "协同是如何被学会的？",
    body: "四股正向力——追踪目标、保持编队、缩短路程、减少能耗。四股负向力——碰撞、编队破裂、目标丢失、危险行为。奖励函数是MASAC的核心引擎。",
    quote: "奖励定义了什么是好的协同。",
    color: "#f59e0b",
    range: [0.20, 0.31] as [number, number],
  },
  {
    title: "Actor 网络",
    subtitle: "谁来执行决策？",
    body: "观测状态输入策略网络，输出连续控制信号。随机策略让智能体既利用已知最优解，又持续探索新可能——观测→策略→动作。",
    quote: "选择下一步行动。",
    color: "#22d3ee",
    range: [0.30, 0.41] as [number, number],
  },
  {
    title: "Critic 网络",
    subtitle: "谁来判断好坏？",
    body: "Critic评估长期价值——不是眼前的即时奖励，而是未来累积折扣奖励的期望。γ趋于0则急功近利，γ趋于1则深谋远虑。Soft Critic额外鼓励探索。",
    quote: "思考下一步之后。",
    color: "#8b5cf6",
    range: [0.40, 0.51] as [number, number],
  },
  {
    title: "经验回放",
    subtitle: "过去的经验如何变成智慧？",
    body: "采集的经验(s,a,r,s')存入记忆池，随机采样打破时序相关性。过去的轨迹在记忆池中留存，每一次训练都用到多样化的历史数据。",
    quote: "经验沉淀为智慧。",
    color: "#f59e0b",
    range: [0.50, 0.61] as [number, number],
  },
  {
    title: "熵探索",
    subtitle: "MASAC 的关键特性",
    body: "传统方法过早收敛到局部最优。MASAC的最大熵框架在利用已知最优策略的同时，持续探索新的可能——永远不会过早锁定次优解。",
    quote: "永不停止探索。",
    color: "#ec4899",
    range: [0.60, 0.71] as [number, number],
  },
  {
    title: "涌现协同",
    subtitle: "协同是学会的，不是编程的",
    body: "从随机碰撞到避开彼此，再到精确编队——整个过程中没有人告诉任何一架无人机应该怎么做。协同行为从奖励信号中自然涌现。",
    quote: "协同是学会的，不是编程的。",
    color: "#10b981",
    range: [0.70, 0.85] as [number, number],
  },
];

function SubScene({
  scene,
  progress,
}: {
  scene: (typeof subScenes)[0];
  progress: any;
}) {
  const opacity = useTransform(
    progress,
    [scene.range[0], scene.range[0] + 0.03, scene.range[1], scene.range[1] + 0.02],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [scene.range[0], scene.range[0] + 0.03], [80, 0]);
  const scale = useTransform(
    progress,
    [scene.range[0], scene.range[0] + 0.03, scene.range[1], scene.range[1] + 0.02],
    [0.85, 1, 1, 0.9]
  );

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
      }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
    >
      <p
        className="font-mono tracking-[0.3em] uppercase mb-6"
        style={{ color: scene.color, fontSize: "14px" }}
      >
        {scene.title}
      </p>
      <h2
        className="font-bold text-white leading-[1.1] mb-6 max-w-2xl"
        style={{ fontSize: "clamp(40px, 7vw, 100px)" }}
      >
        {scene.subtitle}
      </h2>
      <p
        className="text-slate-400 leading-relaxed max-w-xl"
        style={{ fontSize: "clamp(18px, 2.5vw, 28px)" }}
      >
        {scene.body}
      </p>
      <p
        className="mt-8 text-slate-500 font-light italic"
        style={{ fontSize: "clamp(16px, 2vw, 24px)" }}
      >
        "{scene.quote}"
      </p>
    </motion.div>
  );
}

export default function SceneInsideMASAC() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <div className="sticky top-0 h-screen relative">
        {/* 章节标题 — 开头显示 */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.02, 0.06], [0, 1, 0]),
          }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <p className="text-cyan-400 font-mono tracking-[0.3em] uppercase mb-4" style={{ fontSize: "14px" }}>
            深入探索
          </p>
          <h1
            className="font-bold text-white"
            style={{ fontSize: "clamp(50px, 9vw, 130px)" }}
          >
            MASAC 内部机制
          </h1>
          <p
            className="text-slate-500"
            style={{ fontSize: "clamp(18px, 2.5vw, 28px)" }}
          >
            进入智能系统的核心
          </p>
        </motion.div>

        {/* 8个子场景 */}
        {subScenes.map((scene) => (
          <SubScene key={scene.title} scene={scene} progress={scrollYProgress} />
        ))}

        {/* 底部提示 */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.88, 0.96], [0, 1]) }}
          className="absolute bottom-10 w-full text-center"
        >
          <span className="text-slate-600 font-mono tracking-[0.3em] uppercase" style={{ fontSize: "12px" }}>
            向下滚动，查看学习成果
          </span>
        </motion.div>
      </div>
    </div>
  );
}
