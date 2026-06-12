"use client";

import { useRef, useMemo, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import DroneModel from "./DroneModel";

// 3x scale — 编队占据更大视觉空间
const DRONE_CONFIGS = [
  { color: "#22d3ee", emissive: "#0891b2", orbit: 5.5, phase: 0, yBase: 1.5, scale: 3.5 },
  { color: "#3b82f6", emissive: "#1d4ed8", orbit: 3.8, phase: 1.2, yBase: 0.2, scale: 2.6 },
  { color: "#6366f1", emissive: "#4338ca", orbit: 3.8, phase: 2.4, yBase: 0.2, scale: 2.6 },
  { color: "#38bdf8", emissive: "#0284c7", orbit: 3.8, phase: 3.6, yBase: 0.2, scale: 2.6 },
  { color: "#818cf8", emissive: "#4f46e5", orbit: 3.8, phase: 4.8, yBase: 0.2, scale: 2.6 },
];

const TRAIL_LENGTH = 150;

export default function DroneTrailSystem({ cameraZ }: { cameraZ: MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const trailPositions = useRef<THREE.Vector3[][]>(
    Array.from({ length: 5 }, () => [])
  );
  const droneRefs = useRef<(THREE.Group | null)[]>([]);

  const trailLines = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const geo = new THREE.BufferGeometry();
      const arr = new Float32Array(TRAIL_LENGTH * 3);
      for (let j = 0; j < TRAIL_LENGTH; j++) {
        arr[j * 3] = 0;
        arr[j * 3 + 1] = -999;
        arr[j * 3 + 2] = 0;
      }
      geo.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
      geo.setDrawRange(0, 0);

      const mat = new THREE.LineBasicMaterial({
        color: DRONE_CONFIGS[i].color,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      return new THREE.Line(geo, mat);
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const z = (cameraZ as any)?.current ?? 0;

    droneRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const cfg = DRONE_CONFIGS[i];

      if (i === 0) {
        const x = Math.cos(t * 0.25 + cfg.phase) * cfg.orbit * 0.7;
        const zPos = Math.sin(t * 0.25 + cfg.phase) * cfg.orbit * 0.4;
        const y = cfg.yBase + Math.sin(t * 0.4) * 0.6;
        ref.position.set(x, y, zPos);
      } else {
        const leaderX = Math.cos(t * 0.25) * DRONE_CONFIGS[0].orbit * 0.7;
        const leaderZ = Math.sin(t * 0.25) * DRONE_CONFIGS[0].orbit * 0.4;
        const angle = t * 0.3 + cfg.phase;
        const x = leaderX + Math.cos(angle) * cfg.orbit * 0.55;
        const zPos = leaderZ + Math.sin(angle) * cfg.orbit * 0.35;
        const y = cfg.yBase + Math.sin(t * 0.35 + cfg.phase) * 0.5;
        ref.position.set(x, y, zPos);
      }

      ref.rotation.z = Math.sin(t * 0.5 + cfg.phase) * 0.05;
      ref.rotation.x = Math.cos(t * 0.4 + cfg.phase) * 0.03;

      trailPositions.current[i].push(ref.position.clone());
      if (trailPositions.current[i].length > TRAIL_LENGTH) {
        trailPositions.current[i].shift();
      }
    });

    trailLines.forEach((line, i) => {
      const pts = trailPositions.current[i];
      const arr = line.geometry.attributes.position.array as Float32Array;
      for (let j = 0; j < pts.length; j++) {
        arr[j * 3] = pts[j].x;
        arr[j * 3 + 1] = pts[j].y;
        arr[j * 3 + 2] = pts[j].z;
      }
      if (pts.length > 0 && pts.length < TRAIL_LENGTH) {
        const last = pts[pts.length - 1];
        for (let j = pts.length; j < TRAIL_LENGTH; j++) {
          arr[j * 3] = last.x;
          arr[j * 3 + 1] = last.y;
          arr[j * 3 + 2] = last.z;
        }
      }
      line.geometry.attributes.position.needsUpdate = true;
      line.geometry.setDrawRange(0, pts.length);
    });
  });

  return (
    <group ref={groupRef}>
      {trailLines.map((line, i) => (
        <primitive key={`trail-${i}`} object={line} />
      ))}

      {DRONE_CONFIGS.map((cfg, i) => (
        <group
          key={`drone-${i}`}
          ref={(el) => { droneRefs.current[i] = el; }}
        >
          <DroneModel color={cfg.color} emissive={cfg.emissive} scale={cfg.scale} />
        </group>
      ))}
    </group>
  );
}
