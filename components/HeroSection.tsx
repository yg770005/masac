"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import DroneModel from "./DroneModel";
import ParticleField from "./ParticleField";
import StarField from "./StarField";

// 控制无人机编队飞行的逻辑
function DroneSwarm() {
  const groupRef = useRef<THREE.Group>(null);
  const drones = useMemo(() => {
    const arr = [];
    const colors = [
      { color: "#22d3ee", emissive: "#0891b2" },
      { color: "#3b82f6", emissive: "#1d4ed8" },
      { color: "#6366f1", emissive: "#4338ca" },
      { color: "#38bdf8", emissive: "#0284c7" },
      { color: "#818cf8", emissive: "#4f46e5" },
    ];
    // Leader in center, followers around
    const formations = [
      { x: 0, y: 1.5, z: 0 },        // Leader - 中心上方
      { x: 1.2, y: 0.3, z: 0.8 },    // 右前下
      { x: -1.2, y: 0.3, z: 0.8 },   // 左前下
      { x: 1.0, y: 0.8, z: -1.0 },   // 右后
      { x: -1.0, y: 0.8, z: -1.0 },  // 左后
    ];
    for (let i = 0; i < 5; i++) {
      arr.push({
        position: formations[i],
        ...colors[i],
        scale: i === 0 ? 1.3 : 0.9, // Leader slightly larger
        phase: i * 0.5,
        orbitRadius: 0.15,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // 整体编队缓慢旋转
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {drones.map((drone, i) => (
        <DroneInstance key={i} {...drone} index={i} />
      ))}
    </group>
  );
}

function DroneInstance({
  position: initialPos,
  color,
  emissive,
  scale,
  phase,
  orbitRadius,
  index,
}: {
  position: { x: number; y: number; z: number };
  color: string;
  emissive: string;
  scale: number;
  phase: number;
  orbitRadius: number;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);

  // 飞行轨迹点
  const trailPositions = useMemo(() => {
    const arr = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) {
      arr[i * 3] = 0;
      arr[i * 3 + 1] = 0;
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, []);

  const trailHistory = useRef<THREE.Vector3[]>([]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // 漂浮动画 + 微小的轨道运动
    const floatY = Math.sin(t * 1.2 + phase) * 0.4;
    const orbitX = Math.sin(t * 0.6 + phase) * orbitRadius;
    const orbitZ = Math.cos(t * 0.6 + phase) * orbitRadius;

    groupRef.current.position.x = initialPos.x + orbitX;
    groupRef.current.position.y = initialPos.y + floatY;
    groupRef.current.position.z = initialPos.z + orbitZ;

    // 朝向运动方向微调
    groupRef.current.rotation.z = Math.sin(t * 0.8 + phase) * 0.1;
    groupRef.current.rotation.x = Math.cos(t * 0.7 + phase) * 0.08;

    // 更新轨迹 - 保存当前位置
    const pos = groupRef.current.position.clone();
    trailHistory.current.push(pos);
    if (trailHistory.current.length > 60) {
      trailHistory.current.shift();
    }

    // 更新轨迹点
    if (trailRef.current) {
      const geo = trailRef.current.geometry;
      const posAttr = geo.attributes.position;
      for (let i = 0; i < 60; i++) {
        if (i < trailHistory.current.length) {
          const p = trailHistory.current[i];
          posAttr.array[i * 3] = p.x;
          posAttr.array[i * 3 + 1] = p.y;
          posAttr.array[i * 3 + 2] = p.z;
        } else {
          posAttr.array[i * 3] = 0;
          posAttr.array[i * 3 + 1] = -999;
          posAttr.array[i * 3 + 2] = 0;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 飞行轨迹 */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={60}
            array={trailPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 无人机模型 */}
      <DroneModel color={color} emissive={emissive} scale={scale} />

      {/* 底部发光点 */}
      <mesh position={[0, -0.12, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// 场景光效
function SceneLighting() {
  const spotlightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (!spotlightRef.current) return;
    const t = state.clock.getElapsedTime();
    spotlightRef.current.position.x = Math.sin(t * 0.3) * 5;
    spotlightRef.current.position.z = Math.cos(t * 0.3) * 5;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3, 0]} intensity={2} color="#22d3ee" distance={10} />
      <pointLight position={[3, 1, 3]} intensity={1} color="#3b82f6" distance={8} />
      <pointLight position={[-3, 1, -3]} intensity={1} color="#6366f1" distance={8} />
      <spotLight
        ref={spotlightRef}
        position={[0, 5, 0]}
        angle={0.5}
        penumbra={0.5}
        intensity={3}
        color="#22d3ee"
        distance={15}
        castShadow
      />
    </>
  );
}

// 环形HUD指示器
function HUDRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z += delta * 0.15;
    ringRef.current.rotation.x += delta * 0.05;
  });

  return (
    <mesh ref={ringRef} position={[0, -0.1, 0]}>
      <torusGeometry args={[3.5, 0.005, 16, 100]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.15} />
    </mesh>
  );
}

// 数据面板覆盖层
function HUDOverlay() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 grid grid-cols-4 gap-4 lg:gap-8">
      {[
        { label: "智能体数", value: "5", unit: "AGENTS" },
        { label: "平均奖励", value: "1,245", unit: "REWARD" },
        { label: "成功率", value: "98.7", unit: "%" },
        { label: "训练轮次", value: "500K", unit: "EPS" },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + i * 0.15, duration: 0.6 }}
          className="hud-panel px-4 py-3 lg:px-8 lg:py-4 text-center min-w-[90px]"
        >
          <div className="text-[10px] lg:text-xs text-slate-500 uppercase tracking-[0.2em] mb-1">
            {stat.label}
          </div>
          <div className="text-lg lg:text-2xl font-black text-cyan-400 font-mono">
            {stat.value}
            <span className="text-xs lg:text-sm text-slate-600 ml-1">{stat.unit}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* 3D Canvas 背景 */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 1.5, 8], fov: 50, near: 0.1, far: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <SceneLighting />
            <StarField />
            <ParticleField count={400} radius={15} color="#22d3ee" />
            <DroneSwarm />
            <HUDRing />
            <fog attach="fog" args={["#020617", 8, 30]} />
          </Suspense>
        </Canvas>
      </div>

      {/* 渐变覆盖层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/70 via-transparent to-transparent pointer-events-none" />

      {/* 文字内容 */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-8 lg:px-16">
        <div className="max-w-2xl">
          {/* 标签 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-mono">
              强化学习 · 无人机集群
            </span>
          </motion.div>

          {/* 主标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              MASAC
            </span>
          </motion.h1>

          {/* 副标题 */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-4 text-lg sm:text-xl lg:text-2xl text-slate-300 font-light tracking-wide"
          >
            Multi-Agent Soft Actor-Critic
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-2 text-sm sm:text-base lg:text-lg text-slate-500 font-light"
          >
            多智能体强化学习 · 无人机协同决策系统
          </motion.p>

          {/* 简介 */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-6 text-sm lg:text-base text-slate-400 leading-relaxed max-w-lg"
          >
            基于端到端MASAC算法的多无人机编队协同控制系统，
            实现无人机集群在复杂环境中的智能编队飞行、
            动态目标追踪与自主避障决策。
          </motion.p>

          {/* 按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-8 flex items-center gap-4"
          >
            <button
              onClick={() =>
                document
                  .getElementById("overview")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-primary"
            >
              Explore System
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("demo")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-secondary"
            >
              Watch Demo
            </button>
          </motion.div>
        </div>
      </div>

      {/* 底部HUD数据面板 */}
      <HUDOverlay />

      {/* 滚动提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-600 uppercase tracking-[0.3em]">
          SCROLL TO EXPLORE
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-4 h-6 rounded-full border border-slate-600 flex items-start justify-center p-1"
        >
          <div className="w-1 h-1 rounded-full bg-cyan-400" />
        </motion.div>
      </motion.div>
    </div>
  );
}
