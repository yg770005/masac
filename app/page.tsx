"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Scene01Challenge = dynamic(() => import("../components/scene/Scene01Challenge"), { ssr: false });
const Scene02Conflict = dynamic(() => import("../components/scene/Scene02Conflict"), { ssr: false });
const SceneInsideMASAC = dynamic(() => import("../components/scene/SceneInsideMASAC"), { ssr: false });
const Scene04Learning = dynamic(() => import("../components/scene/Scene04Learning"), { ssr: false });
const Scene07Reward = dynamic(() => import("../components/scene/Scene07Reward"), { ssr: false });
const Scene05Validation = dynamic(() => import("../components/scene/Scene05Validation"), { ssr: false });
const VideoScene = dynamic(() => import("../components/video/VideoScene"), { ssr: false });
const Scene06Future = dynamic(() => import("../components/scene/Scene06Future"), { ssr: false });
const Shared3DWorld = dynamic(() => import("../components/3d/Shared3DWorld"), { ssr: false });
const AmbientOverlay = dynamic(() => import("../components/ui/AmbientOverlay"), { ssr: false });
const CursorFollower = dynamic(() => import("../components/ui/CursorFollower"), { ssr: false });

// 每个场景的子步骤数
const SUB_COUNTS = [1, 6, 9, 5, 1, 5, 1, 1];
const TOTAL_STEPS = SUB_COUNTS.reduce((a, b) => a + b, 0);
const SCENE_LABELS = ["挑战", "冲突", "深入", "奖励", "学习", "验证", "演示", "未来"];

function getSceneInfo(step: number) {
  let remaining = step;
  for (let i = 0; i < SUB_COUNTS.length; i++) {
    if (remaining < SUB_COUNTS[i]) return { sceneIndex: i, subStep: remaining };
    remaining -= SUB_COUNTS[i];
  }
  return { sceneIndex: SUB_COUNTS.length - 1, subStep: SUB_COUNTS[SUB_COUNTS.length - 1] - 1 };
}

function NarrativeNav({
  active,
  sceneCount,
  onJump,
}: {
  active: number;
  sceneCount: number;
  onJump: (sceneIndex: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4"
    >
      {SCENE_LABELS.map((label, i) => {
        if (i >= sceneCount) return null;
        return (
          <button
            key={label}
            onClick={() => onJump(i)}
            className="group relative flex items-center"
          >
            <span
              className={`absolute right-7 text-[10px] font-mono whitespace-nowrap transition-all duration-300 ${
                active === i
                  ? "text-cyan-400 opacity-100"
                  : "text-slate-700 opacity-0 group-hover:opacity-100 group-hover:text-slate-500"
              }`}
            >
              {label}
            </span>
            <span
              className={`block w-2 h-2 rounded-full transition-all duration-500 ${
                active === i
                  ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)] scale-150"
                  : active > i
                  ? "bg-cyan-500/40"
                  : "bg-slate-700 hover:bg-slate-500"
              }`}
            />
          </button>
        );
      })}
      <div className="absolute top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/20 via-slate-700/50 to-slate-700/50 -z-10" />
    </motion.div>
  );
}

export default function Page() {
  const [step, setStep] = useState(0);
  const [transitionTrigger, setTransitionTrigger] = useState(0);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevSceneRef = useRef(0);

  const { sceneIndex, subStep } = getSceneInfo(step);

  // 更新3D场景进度
  useEffect(() => {
    scrollRef.current = step / (TOTAL_STEPS - 1);
    if (sceneIndex !== prevSceneRef.current) {
      prevSceneRef.current = sceneIndex;
      setTransitionTrigger((t) => t + 1);
    }
  }, [step, sceneIndex]);

  // 键盘导航
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // 忽略输入框中的按键
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setStep((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        setStep(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setStep(TOTAL_STEPS - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // 鼠标位置跟踪
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  const jumpToScene = useCallback(
    (targetScene: number) => {
      let s = 0;
      for (let j = 0; j < Math.min(targetScene, SUB_COUNTS.length); j++) {
        s += SUB_COUNTS[j];
      }
      setStep(Math.min(s, TOTAL_STEPS - 1));
    },
    []
  );

  return (
    <>
      <style jsx global>{`
        html, body {
          overflow: hidden;
          height: 100%;
        }
        /* CRT扫描线 */
        body::after {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 99;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
          );
        }
        /* 暗角 */
        body::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 98;
          pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 60%, rgba(2, 6, 23, 0.55) 100%);
        }
        @media (prefers-reduced-motion: reduce) {
          html, body {
            overflow: auto;
          }
          body::after, body::before {
            display: none;
          }
        }
      `}</style>

      <main className="relative h-screen w-full overflow-hidden">
        <Shared3DWorld scrollRef={scrollRef} mouseRef={mouseRef} transitionTrigger={transitionTrigger} />
        <AmbientOverlay transitionTrigger={transitionTrigger} />
        <CursorFollower />
        <NarrativeNav active={sceneIndex} sceneCount={SUB_COUNTS.length} onJump={jumpToScene} />

        {/* 场景层 */}
        <AnimatePresence mode="wait">
          {sceneIndex === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <div className="pointer-events-auto w-full h-full">
                <Scene01Challenge isActive={sceneIndex === 0} />
              </div>
            </motion.div>
          )}
          {sceneIndex === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <div className="pointer-events-auto w-full h-full">
                <Scene02Conflict subStep={subStep} />
              </div>
            </motion.div>
          )}
          {sceneIndex === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <div className="pointer-events-auto w-full h-full">
                <SceneInsideMASAC subStep={subStep} />
              </div>
            </motion.div>
          )}
          {sceneIndex === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <div className="pointer-events-auto w-full h-full">
                <Scene07Reward subStep={subStep} />
              </div>
            </motion.div>
          )}
          {sceneIndex === 4 && (
            <motion.div
              key="s4"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <div className="pointer-events-auto w-full h-full">
                <Scene04Learning isActive={sceneIndex === 4} />
              </div>
            </motion.div>
          )}
          {sceneIndex === 5 && (
            <motion.div
              key="s5"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <div className="pointer-events-auto w-full h-full">
                <Scene05Validation subStep={subStep} />
              </div>
            </motion.div>
          )}
          {sceneIndex === 6 && (
            <motion.div
              key="s6"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <div className="pointer-events-auto w-full h-full">
                <VideoScene isActive={sceneIndex === 6} />
              </div>
            </motion.div>
          )}
          {sceneIndex === 7 && (
            <motion.div
              key="s7"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <div className="pointer-events-auto w-full h-full">
                <Scene06Future isActive={sceneIndex === 7} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 键盘提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3"
        >
          <kbd className="px-2 py-1 text-[10px] font-mono text-slate-600 bg-slate-800/50 rounded border border-slate-700/50">
            ↑↓
          </kbd>
          <span className="text-slate-600 font-mono text-[10px] tracking-wider">
            键盘翻页
          </span>
          <span className="text-slate-700 text-[10px] font-mono">
            {step + 1}/{TOTAL_STEPS}
          </span>
        </motion.div>
      </main>
    </>
  );
}
