"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Scene01Challenge = dynamic(() => import("../components/scene/Scene01Challenge"), { ssr: false });
const Scene02Conflict = dynamic(() => import("../components/scene/Scene02Conflict"), { ssr: false });
const SceneInsideMASAC = dynamic(() => import("../components/scene/SceneInsideMASAC"), { ssr: false });
const Scene04Learning = dynamic(() => import("../components/scene/Scene04Learning"), { ssr: false });
const Scene05Validation = dynamic(() => import("../components/scene/Scene05Validation"), { ssr: false });
const VideoScene = dynamic(() => import("../components/video/VideoScene"), { ssr: false });
const Scene06Future = dynamic(() => import("../components/scene/Scene06Future"), { ssr: false });
const Shared3DWorld = dynamic(() => import("../components/3d/Shared3DWorld"), { ssr: false });
const AmbientOverlay = dynamic(() => import("../components/ui/AmbientOverlay"), { ssr: false });

const SCENE_HEIGHTS = [100, 300, 800, 100, 400, 100, 200];
const TOTAL_VH = SCENE_HEIGHTS.reduce((a, b) => a + b, 0);
const SCENE_LABELS = ["挑战", "冲突", "深入", "学习", "验证", "演示", "未来"];

function NarrativeNav({ active }: { active: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4"
    >
      {SCENE_LABELS.map((label, i) => (
        <button
          key={label}
          onClick={() => {
            let offset = 0;
            for (let j = 0; j < i; j++) offset += SCENE_HEIGHTS[j];
            const targetY = (offset / TOTAL_VH) * (document.body.scrollHeight - window.innerHeight);
            window.scrollTo({ top: targetY, behavior: "smooth" });
          }}
          className="group relative flex items-center"
        >
          <span
            className={`absolute right-7 text-[10px] font-mono whitespace-nowrap transition-all duration-300 ${
              active === i ? "text-cyan-400 opacity-100" : "text-slate-700 opacity-0 group-hover:opacity-100 group-hover:text-slate-500"
            }`}
          >
            {label}
          </span>
          <span
            className={`block w-2 h-2 rounded-full transition-all duration-500 ${
              active === i
                ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)] scale-150"
                : active > i ? "bg-cyan-500/40" : "bg-slate-700 hover:bg-slate-500"
            }`}
          />
        </button>
      ))}
      <div className="absolute top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/20 via-slate-700/50 to-slate-700/50 -z-10" />
    </motion.div>
  );
}

// 电影感场景过渡 — 无blur，纯zoom + opacity + glow
function SceneWrapper({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.88,
        pointerEvents: isActive ? "auto" : "none",
      }}
      transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
      className="sticky top-0 h-screen w-full"
      style={{
        textShadow: isActive
          ? "0 0 40px rgba(34,211,238,0.15)"
          : "0 0 0px rgba(34,211,238,0)",
        transition: "text-shadow 0.5s ease",
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Page() {
  const [activeScene, setActiveScene] = useState(0);
  const [transitionTrigger, setTransitionTrigger] = useState(0);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const prevActiveRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const totalH = document.body.scrollHeight - window.innerHeight;
      if (totalH <= 0) return;
      const progress = window.scrollY / totalH;
      scrollRef.current = progress;

      let accumulated = 0;
      let idx = 0;
      for (let i = 0; i < SCENE_HEIGHTS.length; i++) {
        accumulated += SCENE_HEIGHTS[i] / TOTAL_VH;
        if (progress < accumulated) {
          idx = i;
          break;
        }
        idx = i;
      }

      if (idx !== prevActiveRef.current) {
        prevActiveRef.current = idx;
        setActiveScene(idx);
        setTransitionTrigger((t) => t + 1);
      }
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const scenes = [
    <Scene01Challenge key="s0" />,
    <Scene02Conflict key="s1" />,
    <SceneInsideMASAC key="s2" />,
    <Scene04Learning key="s3" />,
    <Scene05Validation key="s4" />,
    <VideoScene key="s5" />,
    <Scene06Future key="s6" />,
  ];

  return (
    <main className="relative" style={{ height: `${TOTAL_VH}vh` }}>
      <Shared3DWorld scrollRef={scrollRef} mouseRef={mouseRef} transitionTrigger={transitionTrigger} />
      <AmbientOverlay transitionTrigger={transitionTrigger} />
      <NarrativeNav active={activeScene} />

      {scenes.map((scene, i) => {
        const heightVh = SCENE_HEIGHTS[i];
        return (
          <div key={i} style={{ height: `${heightVh}vh`, position: "relative" }}>
            <SceneWrapper isActive={activeScene === i}>
              {scene}
            </SceneWrapper>
          </div>
        );
      })}
    </main>
  );
}
