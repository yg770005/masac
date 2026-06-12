"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================
// 程序化生成的行星纹理
// ============================================================
function createPlanetTexture(
  baseColor: string,
  secondaryColor: string,
  pattern: "earth" | "mars" | "jupiter" | "venus" | "neptune"
): HTMLCanvasElement {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // 底色
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  if (pattern === "earth") {
    // 海洋 + 大陆
    ctx.fillStyle = "#1a3a5c";
    ctx.fillRect(0, 0, size, size);
    // 大陆块
    ctx.fillStyle = "#2d5a27";
    ctx.beginPath(); ctx.arc(size * 0.35, size * 0.3, size * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(size * 0.6, size * 0.5, size * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(size * 0.4, size * 0.7, size * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(size * 0.7, size * 0.25, size * 0.13, 0, Math.PI * 2); ctx.fill();
    // 云
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath(); ctx.arc(size * 0.5, size * 0.4, size * 0.25, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(size * 0.3, size * 0.6, size * 0.2, 0, Math.PI * 2); ctx.fill();
  } else if (pattern === "mars") {
    // 红色沙漠
    ctx.fillStyle = secondaryColor;
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * size * 0.12;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${180 + Math.random() * 75},${40 + Math.random() * 40},${10 + Math.random() * 20},0.5)`;
      ctx.fill();
    }
    // 极冠
    ctx.fillStyle = "rgba(255,255,240,0.2)";
    ctx.beginPath(); ctx.arc(size * 0.5, size * 0.08, size * 0.3, 0, Math.PI); ctx.fill();
  } else if (pattern === "jupiter") {
    // 条纹
    for (let i = 0; i < 14; i++) {
      const y = size * 0.1 + i * size * 0.06;
      const alpha = 0.15 + Math.random() * 0.3;
      ctx.fillStyle = `rgba(${200 + Math.random() * 55},${150 + Math.random() * 55},${80 + Math.random() * 40},${alpha})`;
      ctx.fillRect(0, y, size, size * 0.04 + Math.random() * size * 0.03);
    }
    // 大红斑
    ctx.fillStyle = "rgba(210,120,90,0.4)";
    ctx.beginPath(); ctx.ellipse(size * 0.55, size * 0.55, size * 0.1, size * 0.06, 0.1, 0, Math.PI * 2); ctx.fill();
  } else if (pattern === "neptune") {
    // 深蓝渐变
    const grad = ctx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, "#1a3a5c");
    grad.addColorStop(0.5, "#2244aa");
    grad.addColorStop(1, "#1a3366");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    // 亮斑
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `rgba(120,180,255,${0.05 + Math.random() * 0.1})`;
      ctx.beginPath(); ctx.arc(Math.random() * size, Math.random() * size, Math.random() * size * 0.08, 0, Math.PI * 2); ctx.fill();
    }
  } else if (pattern === "venus") {
    // 金星 — 橙黄渐变
    const grad = ctx.createRadialGradient(size * 0.3, size * 0.3, 0, size * 0.5, size * 0.5, size * 0.5);
    grad.addColorStop(0, "#ffe8c0");
    grad.addColorStop(0.4, "#e8b860");
    grad.addColorStop(1, "#8a6020");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    // 云纹
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(255,240,200,${0.05 + Math.random() * 0.1})`;
      ctx.beginPath(); ctx.arc(Math.random() * size, size * 0.3 + Math.random() * size * 0.4, Math.random() * size * 0.15, 0, Math.PI * 2); ctx.fill();
    }
  }

  return canvas;
}

const planetDefs = [
  // 左侧天体
  { position: [-12, 3.5, -8] as [number, number, number], radius: 1.6, baseColor: "#1a3a5c", secondaryColor: "#2d5a27", pattern: "earth" as const, glowColor: "#22d3ee", rotationSpeed: 0.08 },
  { position: [-9, -2.5, -5] as [number, number, number], radius: 1.0, baseColor: "#c1440e", secondaryColor: "#e87830", pattern: "mars" as const, glowColor: "#ef4444", rotationSpeed: 0.05 },
  // 右侧天体
  { position: [11, 2.0, -7] as [number, number, number], radius: 2.0, baseColor: "#d4a574", secondaryColor: "#c49460", pattern: "jupiter" as const, glowColor: "#f59e0b", rotationSpeed: 0.12 },
  { position: [8, -3.0, -4] as [number, number, number], radius: 1.2, baseColor: "#2244aa", secondaryColor: "#1a3366", pattern: "neptune" as const, glowColor: "#3b82f6", rotationSpeed: 0.04 },
  { position: [14, 4.5, -10] as [number, number, number], radius: 0.8, baseColor: "#e8b860", secondaryColor: "#8a6020", pattern: "venus" as const, glowColor: "#fbbf24", rotationSpeed: 0.03 },
];

// ============================================================
// 单个行星
// ============================================================
function Planet({
  position,
  radius,
  baseColor,
  secondaryColor,
  pattern,
  glowColor,
  rotationSpeed,
}: (typeof planetDefs)[0]) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const canvas = createPlanetTexture(baseColor, secondaryColor, pattern);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [baseColor, secondaryColor, pattern]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <group position={position}>
      {/* 行星本体 */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 大气光晕 */}
      <mesh>
        <sphereGeometry args={[radius * 1.12, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 外层光晕 */}
      <mesh>
        <sphereGeometry args={[radius * 1.3, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 轨道环 — 不是所有行星都有 */}
      {(pattern === "jupiter" || pattern === "neptune") && (
        <mesh ref={ringRef} rotation={[Math.PI * 0.4, 0.2, 0]}>
          <torusGeometry args={[radius * 1.6, radius * 0.04, 16, 80]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

// ============================================================
// 背景星空 — 固定位置大星点
// ============================================================
function BrightStars() {
  const stars = useMemo(() => {
    const arr: { pos: [number, number, number]; color: string; size: number }[] = [];
    const colors = ["#22d3ee", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#ffffff", "#38bdf8", "#818cf8"];
    for (let i = 0; i < 40; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 5 - 10,
        ],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 0.08 + 0.02,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {stars.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <sphereGeometry args={[s.size, 4, 4]} />
          <meshBasicMaterial color={s.color} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function CelestialBodies() {
  return (
    <group>
      {planetDefs.map((def, i) => (
        <Planet key={i} {...def} />
      ))}
      <BrightStars />
    </group>
  );
}
