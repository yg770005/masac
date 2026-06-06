"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function StarField() {
  const starsRef = useRef<THREE.Points>(null);

  const positions = useRef<Float32Array | null>(null);

  if (!positions.current) {
    const count = 1500;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    positions.current = arr;
  }

  useFrame((_, delta) => {
    if (!starsRef.current) return;
    starsRef.current.rotation.y += delta * 0.005;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1500}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
