"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import DroneModel from "./DroneModel";
import ParticleField from "./ParticleField";
import StarField from "./StarField";

// 编队路径 - 圆形编队
function FormationPath({
  radius,
  color,
  height = 0,
}: {
  radius: number;
  color: string;
  height?: number;
}) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius)
      );
    }
    return pts;
  }, [radius, height]);

  const lineGeo = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  const lineObj = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
    return new THREE.Line(lineGeo, mat);
  }, [lineGeo, color]);

  return <primitive object={lineObj} />;
}

// 飞行轨迹
function FlightTrail({
  path,
  color,
  progress,
}: {
  path: THREE.Vector3[];
  color: string;
  progress: number;
}) {
  const trailRef = useRef<THREE.Line>(null);

  const trailGeo = useMemo(() => {
    const visiblePoints = path.slice(0, Math.floor(path.length * progress));
    if (visiblePoints.length < 2) return new THREE.BufferGeometry().setFromPoints([path[0], path[0]]);
    return new THREE.BufferGeometry().setFromPoints(visiblePoints);
  }, [path, progress]);

  const lineObj = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(trailGeo, mat);
  }, [trailGeo, color]);

  return <primitive ref={trailRef} object={lineObj} />;
}

// 移动目标
function MovingTarget() {
  const targetRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!targetRef.current) return;
    const t = state.clock.getElapsedTime();
    targetRef.current.position.x = Math.cos(t * 0.4) * 3;
    targetRef.current.position.z = Math.sin(t * 0.4) * 3;
    targetRef.current.position.y = Math.sin(t * 0.3) * 0.5 + 0.5;
  });

  return (
    <group ref={targetRef}>
      {/* 目标球体 */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.8} />
      </mesh>
      {/* 外圈 */}
      <mesh>
        <torusGeometry args={[0.35, 0.02, 8, 24]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.4} />
      </mesh>
      {/* 光晕 */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

// 协同场景无人机编队
function CooperationDroneSwarm() {
  const drones = useMemo(() => {
    const arr = [];
    const configs = [
      { color: "#22d3ee", emissive: "#0891b2", role: "leader", orbit: 2.5, phase: 0 },
      { color: "#3b82f6", emissive: "#1d4ed8", role: "follower", orbit: 1.8, phase: Math.PI * 0.4 },
      { color: "#6366f1", emissive: "#4338ca", role: "follower", orbit: 1.8, phase: Math.PI * 0.8 },
      { color: "#38bdf8", emissive: "#0284c7", role: "follower", orbit: 1.8, phase: Math.PI * 1.2 },
      { color: "#818cf8", emissive: "#4f46e5", role: "follower", orbit: 1.8, phase: Math.PI * 1.6 },
    ];
    for (let i = 0; i < 5; i++) {
      arr.push({ ...configs[i], id: i });
    }
    return arr;
  }, []);

  const droneRefs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    droneRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const cfg = drones[i];
      if (cfg.role === "leader") {
        // Leader - 复杂的探索路径
        ref.position.x = Math.cos(t * 0.3) * cfg.orbit;
        ref.position.z = Math.sin(t * 0.3) * cfg.orbit;
      } else {
        // Followers - 以leader为中心的编队
        const leaderX = Math.cos(t * 0.3) * 2.5;
        const leaderZ = Math.sin(t * 0.3) * 2.5;
        const angle = t * 0.25 + cfg.phase;
        ref.position.x = leaderX + Math.cos(angle) * cfg.orbit;
        ref.position.z = leaderZ + Math.sin(angle) * cfg.orbit;
      }
      ref.position.y = Math.sin(t * 0.5 + cfg.phase) * 0.3 + 0.2;
      // 朝向
      ref.rotation.z = Math.sin(t * 0.4 + cfg.phase) * 0.08;
    });
  });

  return (
    <group>
      {drones.map((drone, i) => (
        <group
          key={drone.id}
          ref={(el) => {
            droneRefs.current[i] = el as THREE.Group;
          }}
        >
          <DroneModel
            color={drone.color}
            emissive={drone.emissive}
            scale={drone.role === "leader" ? 1.2 : 0.85}
          />
          {/* 角色标签 */}
          <sprite position={[0, 0.3, 0]} scale={[0.5, 0.15, 1]}>
            <spriteMaterial
              color={drone.role === "leader" ? "#22d3ee" : "#64748b"}
              transparent
              opacity={0.6}
            />
          </sprite>
        </group>
      ))}
    </group>
  );
}

// 发光航迹线
function GlowTrails() {
  const trailRef = useRef<THREE.Group>(null);
  const pathPoints = useRef<THREE.Vector3[][]>(
    Array.from({ length: 5 }, () => [])
  );
  const dronePositions = useRef<THREE.Vector3[]>(
    Array.from({ length: 5 }, () => new THREE.Vector3())
  );

  useFrame((state) => {
    if (!trailRef.current) return;
    const t = state.clock.getElapsedTime();

    // Update drone positions
    const configs = [
      { orbit: 2.5, phase: 0 },
      { orbit: 1.8, phase: Math.PI * 0.4 },
      { orbit: 1.8, phase: Math.PI * 0.8 },
      { orbit: 1.8, phase: Math.PI * 1.2 },
      { orbit: 1.8, phase: Math.PI * 1.6 },
    ];

    configs.forEach((cfg, i) => {
      if (i === 0) {
        dronePositions.current[i].set(
          Math.cos(t * 0.3) * cfg.orbit,
          Math.sin(t * 0.5 + cfg.phase) * 0.3 + 0.2,
          Math.sin(t * 0.3) * cfg.orbit
        );
      } else {
        const leaderX = Math.cos(t * 0.3) * 2.5;
        const leaderZ = Math.sin(t * 0.3) * 2.5;
        const angle = t * 0.25 + cfg.phase;
        dronePositions.current[i].set(
          leaderX + Math.cos(angle) * cfg.orbit,
          Math.sin(t * 0.5 + cfg.phase) * 0.3 + 0.2,
          leaderZ + Math.sin(angle) * cfg.orbit
        );
      }
      pathPoints.current[i].push(dronePositions.current[i].clone());
      if (pathPoints.current[i].length > 100) {
        pathPoints.current[i].shift();
      }
    });
  });

  const colors = ["#22d3ee", "#3b82f6", "#6366f1", "#38bdf8", "#818cf8"];

  const lineObjects = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(new Float32Array(100 * 3), 3)
      );
      geo.setDrawRange(0, 0);
      const mat = new THREE.LineBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Line(geo, mat);
    });
  }, []);

  useFrame(() => {
    lineObjects.forEach((line, i) => {
      const pts = pathPoints.current[i];
      const geo = line.geometry;
      const arr = geo.attributes.position.array as Float32Array;
      for (let j = 0; j < pts.length; j++) {
        const base = j * 3;
        arr[base] = pts[j].x;
        arr[base + 1] = pts[j].y;
        arr[base + 2] = pts[j].z;
      }
      // Fill remaining with last known position
      if (pts.length > 0) {
        for (let j = pts.length; j < 100; j++) {
          const base = j * 3;
          const last = pts[pts.length - 1];
          arr[base] = last.x;
          arr[base + 1] = last.y;
          arr[base + 2] = last.z;
        }
      }
      geo.attributes.position.needsUpdate = true;
      geo.setDrawRange(0, Math.max(0, pts.length));
    });
  });

  return (
    <group ref={trailRef}>
      {lineObjects.map((obj, i) => (
        <primitive key={i} object={obj} />
      ))}
    </group>
  );
}

// HUD 地面投影指示器
function GroundProjection() {
  return (
    <group position={[0, -1.6, 0]}>
      {/* 同心圆 */}
      {[1, 2, 3, 4].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r, r + 0.03, 64]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.08 + (4 - r) * 0.02}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
      {/* 十字线 */}
      {[
        { w: 8, h: 0.01 },
        { w: 0.01, h: 8 },
      ].map((size, i) => (
        <mesh key={`cross-${i}`} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size.w, size.h]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 4, 0]} intensity={2.5} color="#22d3ee" distance={12} />
      <pointLight position={[3, 1, 3]} intensity={1.5} color="#3b82f6" distance={10} />
      <pointLight position={[-3, 1, -3]} intensity={1.5} color="#6366f1" distance={10} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#ffffff" />
    </>
  );
}

export default function CooperationScene() {
  return (
    <div className="relative py-24 lg:py-32 px-6 lg:px-16 bg-[#030712]">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em]">
              MULTI-UAV COOPERATION
            </span>
            <span className="flex-1 h-px w-16 bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight">
            <span className="section-title pb-4">
              无人机<span className="text-cyan-400">协同展示</span>
            </span>
          </h2>
          <p className="mt-6 text-slate-500 max-w-xl text-sm lg:text-base">
            Leader-Follower编队架构，5架无人机实时协同飞行与动态目标追踪
          </p>
        </motion.div>

        {/* 3D场景 */}
        <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20" style={{ height: "550px" }}>
          <Canvas
            camera={{ position: [5, 3.5, 7], fov: 55, near: 0.1, far: 50 }}
            gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <SceneLighting />
              <StarField />
              <ParticleField count={300} radius={10} color="#3b82f6" />
              <FormationPath radius={1.8} color="#3b82f6" />
              <FormationPath radius={2.5} color="#22d3ee" />
              <CooperationDroneSwarm />
              <GlowTrails />
              <MovingTarget />
              <GroundProjection />
              <OrbitControls
                enableDamping
                dampingFactor={0.08}
                minPolarAngle={0.3}
                maxPolarAngle={1.3}
                minDistance={4}
                maxDistance={12}
                target={[0, 0.5, 0]}
              />
              <fog attach="fog" args={["#030712", 10, 25]} />
            </Suspense>
          </Canvas>

          {/* 覆盖层信息 */}
          <div className="absolute top-4 left-4 z-10">
            <div className="hud-panel px-4 py-2 inline-block">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                FORMATION MODE:{" "}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">
                LEADER-FOLLOWER
              </span>
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <div className="hud-panel px-4 py-2">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                TARGET:{" "}
              </span>
              <span className="text-[10px] text-red-400 font-mono font-bold">
                DYNAMIC
              </span>
            </div>
          </div>

          {/* 图例 */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-4">
            {[
              { color: "#22d3ee", label: "Leader" },
              { color: "#3b82f6", label: "Follower x4" },
              { color: "#ef4444", label: "Target" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] text-slate-600 font-mono">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
