"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// 无人机3D模型 - 使用几何体构建
function DroneBody({
  color,
  emissive,
  scale = 1,
}: {
  color: string;
  emissive: string;
  scale?: number;
}) {
  const bodyRef = useRef<THREE.Group>(null);
  const propRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    if (!bodyRef.current) return;
    // 螺旋桨旋转
    propRefs.current.forEach((p, i) => {
      if (p) p.rotation.y += delta * 15 * (i % 2 === 0 ? 1 : -1);
    });
  });

  return (
    <group ref={bodyRef} scale={scale}>
      {/* 机身 - X形框架 */}
      <group>
        {/* 中心体 */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.25, 0.06, 0.2]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* 上盖 */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.04, 16]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* 传感器模块 */}
        <mesh position={[0, -0.04, 0.08]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.8} />
        </mesh>

        {/* 前臂 */}
        <mesh position={[0.18, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.16, 0.02, 0.04]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 前臂螺旋桨护圈 */}
        <mesh position={[0.28, 0.04, 0]}>
          <torusGeometry args={[0.07, 0.01, 8, 16]} />
          <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* 前臂螺旋桨 */}
        <mesh
          ref={(el) => { propRefs.current[0] = el; }}
          position={[0.28, 0.04, 0]}
        >
          <boxGeometry args={[0.12, 0.005, 0.03]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.3} metalness={0.4} roughness={0.6} />
        </mesh>

        {/* 后臂 */}
        <mesh position={[-0.18, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.16, 0.02, 0.04]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 后臂螺旋桨护圈 */}
        <mesh position={[-0.28, 0.04, 0]}>
          <torusGeometry args={[0.07, 0.01, 8, 16]} />
          <meshStandardMaterial color="#555" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* 后臂螺旋桨 */}
        <mesh
          ref={(el) => { propRefs.current[1] = el; }}
          position={[-0.28, 0.04, 0]}
        >
          <boxGeometry args={[0.12, 0.005, 0.03]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.3} metalness={0.4} roughness={0.6} />
        </mesh>

        {/* 左臂 */}
        <mesh position={[0, 0, 0.18]}>
          <boxGeometry args={[0.04, 0.02, 0.16]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 左臂螺旋桨 */}
        <mesh
          ref={(el) => { propRefs.current[2] = el; }}
          position={[0, 0.04, 0.28]}
        >
          <boxGeometry args={[0.03, 0.005, 0.12]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.3} metalness={0.4} roughness={0.6} />
        </mesh>

        {/* 右臂 */}
        <mesh position={[0, 0, -0.18]}>
          <boxGeometry args={[0.04, 0.02, 0.16]} />
          <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 右臂螺旋桨 */}
        <mesh
          ref={(el) => { propRefs.current[3] = el; }}
          position={[0, 0.04, -0.28]}
        >
          <boxGeometry args={[0.03, 0.005, 0.12]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.3} metalness={0.4} roughness={0.6} />
        </mesh>

        {/* 起落架 */}
        <mesh position={[0.08, -0.06, 0.06]}>
          <cylinderGeometry args={[0.01, 0.01, 0.06, 6]} />
          <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0.08, -0.06, -0.06]}>
          <cylinderGeometry args={[0.01, 0.01, 0.06, 6]} />
          <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[-0.08, -0.06, 0.06]}>
          <cylinderGeometry args={[0.01, 0.01, 0.06, 6]} />
          <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[-0.08, -0.06, -0.06]}>
          <cylinderGeometry args={[0.01, 0.01, 0.06, 6]} />
          <meshStandardMaterial color="#444" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export default function DroneModel({
  color = "#22d3ee",
  emissive = "#0891b2",
  scale,
}: {
  color?: string;
  emissive?: string;
  scale?: number;
}) {
  return <DroneBody color={color} emissive={emissive} scale={scale} />;
}
