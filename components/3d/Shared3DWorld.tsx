"use client";

import { Suspense, useRef, useMemo, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import DeepParticleUniverse from "./DeepParticleUniverse";
import DroneTrailSystem from "./DroneTrailSystem";
import CelestialBodies from "./CelestialBodies";

// 摄像机系统
function VirtualCamera({ scrollRef }: { scrollRef: RefObject<number> }) {
  const { camera } = useThree();
  const targetZ = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(1.5);

  useFrame((_, delta) => {
    const s = scrollRef.current ?? 0;
    targetZ.current = s * 20;
    targetX.current = Math.sin(s * 0.5) * 2.5;
    targetY.current = 1.5 + Math.cos(s * 0.3) * 0.8;

    (camera as any).position.x += (targetX.current - (camera as any).position.x) * delta * 1.8;
    (camera as any).position.y += (targetY.current - (camera as any).position.y) * delta * 1.8;
    (camera as any).position.z += (6 + targetZ.current - (camera as any).position.z) * delta * 1.8;
    camera.lookAt(0, 1.0, targetZ.current);
  });

  return null;
}

// 过渡粒子爆发
function TransitionBurst({ trigger }: { trigger: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const prevTrigger = useRef(trigger);

  const particles = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = 0;
      vel[i * 3] = (Math.random() - 0.5) * 10;
      vel[i * 3 + 1] = Math.random() * 8 + 3;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return { pos, vel, count };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    if (trigger !== prevTrigger.current) {
      prevTrigger.current = trigger;
      const arr = particles.pos;
      for (let i = 0; i < particles.count; i++) {
        arr[i * 3] = 0; arr[i * 3 + 1] = 0; arr[i * 3 + 2] = 0;
      }
    }
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    let allGone = true;
    for (let i = 0; i < particles.count; i++) {
      arr[i * 3] += particles.vel[i * 3] * delta;
      arr[i * 3 + 1] += particles.vel[i * 3 + 1] * delta;
      arr[i * 3 + 2] += particles.vel[i * 3 + 2] * delta;
      if (arr[i * 3 + 1] < 12) allGone = false;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    (pointsRef.current.material as THREE.PointsMaterial).opacity = allGone ? 0 : 0.7;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.count} array={particles.pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#22d3ee" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// 地面网格
function GroundGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (gridRef.current) {
      gridRef.current.rotation.z += delta * 0.015;
    }
  });

  return (
    <group ref={gridRef} position={[0, -2.5, 0]}>
      {/* 主网格盘 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 10, 120]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.04} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* 细网格线 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.5, 3.52, 80]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.5, 6.52, 80]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9, 9.52, 80]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// 光隧道
function LightTunnel() {
  const rings = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      z: -i * 2.5,
      radius: 4 + Math.sin(i * 0.4) * 2,
      opacity: 0.06 + (1 - i / 30) * 0.2,
    }));
  }, []);

  return (
    <group>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]}>
          <torusGeometry args={[ring.radius, 0.015, 8, 48]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#3b82f6" : "#8b5cf6"}
            transparent
            opacity={ring.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Shared3DWorld({
  scrollRef,
  mouseRef,
  transitionTrigger,
}: {
  scrollRef: RefObject<number>;
  mouseRef: RefObject<{ x: number; y: number }>;
  transitionTrigger: number;
}) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 65, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[0.8, 1.2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 4, 0]} intensity={2.5} color="#22d3ee" distance={18} />
          <pointLight position={[4, 1, 4]} intensity={1.5} color="#3b82f6" distance={12} />
          <pointLight position={[-4, 1, -4]} intensity={1.5} color="#6366f1" distance={12} />

          <DeepParticleUniverse mouseRef={mouseRef} />
          <LightTunnel />
          <GroundGrid />
          <CelestialBodies />
          <DroneTrailSystem cameraZ={scrollRef as any} />
          <TransitionBurst trigger={transitionTrigger} />
          <VirtualCamera scrollRef={scrollRef} />
          <fog attach="fog" args={["#020617", 10, 35]} />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#020617]/30 via-transparent to-[#020617]/50" />
    </div>
  );
}
