"use client";

import { motion, AnimatePresence } from "framer-motion";

const subScenes = [
  {
    title: "观测空间",
    subtitle: "每架无人机知道什么？",
    body: "每个智能体只能观测局部信息。自身位置、速度、目标方位、邻居距离、编队偏差——无全局视野，无中心调度。",
    quote: "每一次决策都始于观测。",
    color: "#22d3ee",
  },
  {
    title: "动作空间",
    subtitle: "无人机能控制什么？",
    body: "速度、航向、加速度——连续动作空间中的平滑控制信号。每一次动作都直接影响飞行轨迹和编队状态。",
    quote: "观测转化为行动。",
    color: "#3b82f6",
  },
  {
    title: "奖励系统",
    subtitle: "协同是如何被学会的？",
    body: "四股正向力——追踪目标、保持编队、缩短路程、减少能耗。四股负向力——碰撞、编队破裂、目标丢失、危险行为。奖励函数是MASAC的核心引擎。",
    quote: "奖励定义了什么是好的协同。",
    color: "#f59e0b",
  },
  {
    title: "Actor 网络",
    subtitle: "谁来执行决策？",
    body: "观测状态输入策略网络，输出连续控制信号。随机策略让智能体既利用已知最优解，又持续探索新可能——观测→策略→动作。",
    quote: "选择下一步行动。",
    color: "#22d3ee",
  },
  {
    title: "Critic 网络",
    subtitle: "谁来判断好坏？",
    body: "Critic评估长期价值——不是眼前的即时奖励，而是未来累积折扣奖励的期望。γ趋于0则急功近利，γ趋于1则深谋远虑。Soft Critic额外鼓励探索。",
    quote: "思考下一步之后。",
    color: "#8b5cf6",
  },
  {
    title: "经验回放",
    subtitle: "过去的经验如何变成智慧？",
    body: "采集的经验(s,a,r,s')存入记忆池，随机采样打破时序相关性。过去的轨迹在记忆池中留存，每一次训练都用到多样化的历史数据。",
    quote: "经验沉淀为智慧。",
    color: "#f59e0b",
  },
  {
    title: "熵探索",
    subtitle: "MASAC 的关键特性",
    body: "传统方法过早收敛到局部最优。MASAC的最大熵框架在利用已知最优策略的同时，持续探索新的可能——永远不会过早锁定次优解。",
    quote: "永不停止探索。",
    color: "#ec4899",
  },
  {
    title: "涌现协同",
    subtitle: "协同是学会的，不是编程的",
    body: "从随机碰撞到避开彼此，再到精确编队——整个过程中没有人告诉任何一架无人机应该怎么做。协同行为从奖励信号中自然涌现。",
    quote: "协同是学会的，不是编程的。",
    color: "#10b981",
  },
];

export default function SceneInsideMASAC({ subStep }: { subStep: number }) {
  const isIntro = subStep === 0;
  const sceneIndex = subStep - 1; // 0-based into subScenes

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="h-full relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* 标题页: subStep === 0 */}
          {isIntro && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="flex flex-col items-center justify-center text-center px-4"
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
          )}

          {/* 子场景 */}
          {!isIntro && sceneIndex >= 0 && sceneIndex < subScenes.length && (
            <motion.div
              key={`sub-${sceneIndex}`}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <p
                className="font-mono tracking-[0.3em] uppercase mb-6"
                style={{ color: subScenes[sceneIndex].color, fontSize: "14px" }}
              >
                {subScenes[sceneIndex].title}
              </p>
              <h2
                className="font-bold text-white leading-[1.1] mb-6 max-w-2xl"
                style={{ fontSize: "clamp(40px, 7vw, 100px)" }}
              >
                {subScenes[sceneIndex].subtitle}
              </h2>
              <p
                className="text-slate-400 leading-relaxed max-w-xl"
                style={{ fontSize: "clamp(18px, 2.5vw, 28px)" }}
              >
                {subScenes[sceneIndex].body}
              </p>
              <p
                className="mt-8 text-slate-500 font-light italic"
                style={{ fontSize: "clamp(16px, 2vw, 24px)" }}
              >
                "{subScenes[sceneIndex].quote}"
              </p>
              <p className="mt-6 text-slate-600 font-mono text-xs">
                {sceneIndex + 1} / {subScenes.length}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
