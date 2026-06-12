"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const visions = [
  {
    title: "超越编队",
    text: "如果集群能动态重塑以适应任何任务？不仅仅是五架无人机——而是自主车队、物流网络、太空星座。同样的原理可以无限扩展。",
  },
  {
    title: "超越仿真",
    text: "当这些算法驾驶真实飞行器时会发生什么？真实的风，真实的传感器，真实的代价。仿真与现实的鸿沟是下一个前沿。",
  },
  {
    title: "超越人类控制",
    text: "想象100个智能体、1000个，无需人类参与就能协调行动。涌现集体智能——自组织、自修复、自改进的集群。",
  },
  {
    title: "未来集群",
    text: "这不是科幻。算法已经存在，硬件已经就绪。剩下的只是放手中心化控制的勇气——以及信任协作的数学。",
  },
];

export default function Scene06Future() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="w-full h-full flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="text-purple-400 font-mono tracking-[0.3em] uppercase mb-4" style={{ fontSize: "14px" }}>
          未来
        </p>
        <h2
          className="font-bold text-white"
          style={{ fontSize: "clamp(50px, 9vw, 130px)" }}
        >
          下一步是什么
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl">
        {visions.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.7 }}
            className="text-center"
          >
            <h3
              className="font-bold text-white mb-3"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              {v.title}
            </h3>
            <p
              className="text-slate-400 leading-relaxed"
              style={{ fontSize: "clamp(16px, 2vw, 22px)" }}
            >
              {v.text}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-12 text-center"
      >
        <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-6" />
        <p
          className="font-light text-slate-300"
          style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
        >
          集群正在学习。
        </p>
        <p
          className="text-slate-600 mt-1"
          style={{ fontSize: "clamp(16px, 2vw, 22px)" }}
        >
          这只是个开始。
        </p>
      </motion.div>
    </div>
  );
}
