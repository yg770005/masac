"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";

// 动态导入所有section
const HeroSection = dynamic(() => import("../components/HeroSection"), { ssr: false });
const ProblemStatement = dynamic(() => import("../components/ProblemStatement"), { ssr: false });
const SystemOverview = dynamic(() => import("../components/SystemOverview"), { ssr: false });
const HowMASACWorks = dynamic(() => import("../components/HowMASACWorks"), { ssr: false });
const AlgorithmFlow = dynamic(() => import("../components/AlgorithmFlow"), { ssr: false });
const TrainingDashboard = dynamic(() => import("../components/TrainingDashboard"), { ssr: false });
const CooperationScene = dynamic(() => import("../components/CooperationScene"), { ssr: false });
const VideoCenter = dynamic(() => import("../components/VideoCenter"), { ssr: false });
const ResultsPanel = dynamic(() => import("../components/ResultsPanel"), { ssr: false });
const FutureVision = dynamic(() => import("../components/FutureVision"), { ssr: false });

function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((s) => {
        const el = s as HTMLElement;
        const top = el.offsetTop - 100;
        if (window.scrollY >= top && window.scrollY < top + el.offsetHeight) {
          setActive(el.id);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "home", label: "首页" },
    { id: "problem", label: "问题定义" },
    { id: "overview", label: "系统概览" },
    { id: "how", label: "MASAC原理" },
    { id: "algorithm", label: "算法架构" },
    { id: "dashboard", label: "训练驾驶舱" },
    { id: "cooperation", label: "协同展示" },
    { id: "demo", label: "演示中心" },
    { id: "results", label: "项目成果" },
    { id: "vision", label: "未来展望" },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-cyan-500/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <button
          onClick={() => scrollTo("home")}
          className="text-lg font-black tracking-[0.2em] neon-text"
        >
          MASAC
        </button>
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`relative px-3 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                active === item.id
                  ? "text-cyan-400 neon-text"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {item.label}
              {active === item.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-cyan-400" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function Home() {
  const starRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starRef.current) return;
    const container = starRef.current;
    const stars: HTMLDivElement[] = [];
    for (let i = 0; i < 200; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.setProperty("--duration", `${1 + Math.random() * 3}s`);
      star.style.setProperty("--delay", `${Math.random() * 3}s`);
      star.style.opacity = `${0.2 + Math.random() * 0.5}`;
      container.appendChild(star);
      stars.push(star);
    }
    return () => {
      stars.forEach((s) => s.remove());
    };
  }, []);

  return (
    <main className="relative">
      {/* 全局星空背景 */}
      <div ref={starRef} className="fixed inset-0 pointer-events-none z-0" />

      <Navbar />

      {/* Section 1: Hero */}
      <section id="home">
        <HeroSection />
      </section>

      {/* Section 2: Problem Statement —— 问题定义 */}
      <section id="problem">
        <ProblemStatement />
      </section>

      {/* Section 3: System Overview —— 系统概览 */}
      <section id="overview">
        <SystemOverview />
      </section>

      {/* Section 4: How MASAC Works —— MASAC如何解决问题 */}
      <section id="how">
        <HowMASACWorks />
      </section>

      {/* Section 5: Algorithm Architecture —— 算法架构 */}
      <section id="algorithm">
        <AlgorithmFlow />
      </section>

      {/* Section 6: Training Dashboard —— 训练驾驶舱 */}
      <section id="dashboard">
        <TrainingDashboard />
      </section>

      {/* Section 7: Multi-UAV Cooperation —— 协同展示 */}
      <section id="cooperation">
        <CooperationScene />
      </section>

      {/* Section 8: Demo Center —— 演示中心 */}
      <section id="demo">
        <VideoCenter />
      </section>

      {/* Section 9: Project Results —— 项目成果 */}
      <section id="results">
        <ResultsPanel />
      </section>

      {/* Section 10: Future Vision —— 未来展望与个人思考 */}
      <section id="vision">
        <FutureVision />
      </section>
    </main>
  );
}
