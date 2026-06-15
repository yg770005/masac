"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface TextParticle {
  x: number;
  y: number;
  vy: number;
  life: number;
  maxLife: number;
  char: string;
  color: string;
}

const COLORS = ["#22d3ee", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];
const CHARS = [
  "λ", "∑", "∂", "∇", "α", "π", "θ", "→", "∀", "∃",
  "def", "fn", "=>", "{}", "()", "await", "async", "use",
  "10", "01", "//", "#", "*", "~", "$",
];

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const textParticlesRef = useRef<TextParticle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const smoothRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const isHoveringRef = useRef(false);

  const spawnParticle = useCallback((x: number, y: number) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.8 + 0.3;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: Math.random() * 35 + 18,
      size: Math.random() * 2.2 + 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // hover检测
    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("video")
      ) {
        isHoveringRef.current = true;
      }
    };
    const onOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("video")
      ) {
        isHoveringRef.current = false;
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      frameCountRef.current++;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const sx = smoothRef.current.x;
      const sy = smoothRef.current.y;
      const hovering = isHoveringRef.current;

      // 平滑跟随
      const easing = hovering ? 0.22 : 0.12;
      smoothRef.current.x += (mx - sx) * easing;
      smoothRef.current.y += (my - sy) * easing;

      const cx = smoothRef.current.x;
      const cy = smoothRef.current.y;

      const ringSize = hovering ? "48px" : "36px";
      const ringBorder = hovering
        ? "1px solid rgba(236,72,153,0.5)"
        : "1px solid rgba(34,211,238,0.25)";
      const ringShadow = hovering
        ? "0 0 30px rgba(236,72,153,0.2), inset 0 0 30px rgba(236,72,153,0.1)"
        : "0 0 20px rgba(34,211,238,0.12), inset 0 0 20px rgba(34,211,238,0.06)";

      // 更新DOM
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
        const ringInner = ringRef.current.firstChild as HTMLElement;
        if (ringInner) {
          ringInner.style.width = ringSize;
          ringInner.style.height = ringSize;
          ringInner.style.border = ringBorder;
          ringInner.style.boxShadow = ringShadow;
        }
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
        const glowInner = glowRef.current.firstChild as HTMLElement;
        if (glowInner) {
          glowInner.style.width = hovering ? "120px" : "80px";
          glowInner.style.height = hovering ? "120px" : "80px";
          glowInner.style.opacity = hovering ? "0.5" : "0.25";
        }
      }

      // 生成光点粒子
      const particles = particlesRef.current;
      if (frameCountRef.current % 3 === 0 && (Math.abs(mx - sx) > 0.5 || Math.abs(my - sy) > 0.5)) {
        particles.push(spawnParticle(cx, cy));
        if (hovering) {
          particles.push(spawnParticle(cx + (Math.random() - 0.5) * 20, cy + (Math.random() - 0.5) * 20));
        }
      }

      // 静止时冒泡
      if (frameCountRef.current % 12 === 0 && Math.abs(mx - sx) < 0.5) {
        particles.push(spawnParticle(cx + (Math.random() - 0.5) * 8, cy + (Math.random() - 0.5) * 8));
      }

      // 文字粒子 — hover时爆发
      const textParticles = textParticlesRef.current;
      if (hovering && frameCountRef.current % 8 === 0) {
        textParticles.push({
          x: cx + (Math.random() - 0.5) * 30,
          y: cy + (Math.random() - 0.5) * 10,
          vy: -(Math.random() * 1.5 + 0.8),
          life: 0,
          maxLife: Math.random() * 50 + 30,
          char: CHARS[Math.floor(Math.random() * CHARS.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }

      // 渲染
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 光点粒子
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.65;
        ctx.fill();
      }

      // 文字粒子
      for (let i = textParticles.length - 1; i >= 0; i--) {
        const tp = textParticles[i];
        tp.life++;
        if (tp.life >= tp.maxLife) {
          textParticles.splice(i, 1);
          continue;
        }
        tp.y += tp.vy;
        tp.vy *= 0.995;
        const alpha = 1 - tp.life / tp.maxLife;
        ctx.font = `${10 + alpha * 4}px "JetBrains Mono", "Fira Code", monospace`;
        ctx.fillStyle = tp.color;
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillText(tp.char, tp.x, tp.y);
      }

      ctx.globalAlpha = 1;
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [spawnParticle]);

  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        a, button, [role="button"], input, textarea, select, video, [tabindex] {
          cursor: none !important;
        }
        @media (pointer: coarse) {
          * { cursor: auto !important; }
          a, button, [role="button"] { cursor: pointer !important; }
        }
      `}</style>

      {/* 粒子canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[100] pointer-events-none"
      />

      {/* 环境光晕 — 最大延迟 */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 z-[101] pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "80px",
            height: "80px",
            background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)",
            transition: "width 0.4s, height 0.4s, opacity 0.4s",
            opacity: 0.25,
          }}
        />
      </div>

      {/* 外层光环 */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[102] pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full"
          style={{
            width: "36px",
            height: "36px",
            border: "1px solid rgba(34,211,238,0.25)",
            boxShadow: "0 0 20px rgba(34,211,238,0.12), inset 0 0 20px rgba(34,211,238,0.06)",
            transition: "width 0.3s, height 0.3s, border 0.3s, box-shadow 0.3s",
          }}
        />
      </div>

      {/* 主光标核心 */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[103] pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full"
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: "#22d3ee",
            boxShadow:
              "0 0 10px rgba(34,211,238,0.9), 0 0 20px rgba(34,211,238,0.5), 0 0 35px rgba(34,211,238,0.2)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "16px",
            height: "16px",
            background: "radial-gradient(circle, rgba(34,211,238,0.25) 0%, transparent 70%)",
          }}
        />
      </div>
    </>
  );
}
