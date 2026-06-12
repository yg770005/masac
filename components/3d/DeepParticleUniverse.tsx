"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DeepParticleUniverseProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

export default function DeepParticleUniverse({ mouseRef }: DeepParticleUniverseProps) {
  const layer1Ref = useRef<THREE.Points>(null);
  const layer2Ref = useRef<THREE.Points>(null);
  const layer3Ref = useRef<THREE.Points>(null);

  const L1 = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sizes[i] = Math.random() * 0.03 + 0.005;
    }
    return { pos, sizes, count };
  }, []);

  const L2 = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      sizes[i] = Math.random() * 0.06 + 0.015;
    }
    return { pos, sizes, count };
  }, []);

  const L3 = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      sizes[i] = Math.random() * 0.1 + 0.03;
    }
    return { pos, sizes, count };
  }, []);

  useFrame((_, delta) => {
    const mx = mouseRef.current?.x ?? 0;
    const my = mouseRef.current?.y ?? 0;

    if (layer1Ref.current) {
      layer1Ref.current.rotation.y += delta * 0.02;
      layer1Ref.current.rotation.x += delta * 0.01;
      layer1Ref.current.position.x += (mx * 0.6 - layer1Ref.current.position.x) * 0.02;
      layer1Ref.current.position.y += (-my * 0.4 - layer1Ref.current.position.y) * 0.02;
    }
    if (layer2Ref.current) {
      layer2Ref.current.rotation.y -= delta * 0.04;
      layer2Ref.current.rotation.z += delta * 0.02;
      layer2Ref.current.position.x += (mx * 1.0 - layer2Ref.current.position.x) * 0.03;
      layer2Ref.current.position.y += (-my * 0.6 - layer2Ref.current.position.y) * 0.03;
    }
    if (layer3Ref.current) {
      layer3Ref.current.rotation.y += delta * 0.06;
      layer3Ref.current.rotation.x -= delta * 0.03;
      layer3Ref.current.position.x += (mx * 1.5 - layer3Ref.current.position.x) * 0.04;
      layer3Ref.current.position.y += (-my * 0.9 - layer3Ref.current.position.y) * 0.04;
    }
  });

  return (
    <group>
      <points ref={layer1Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={L1.count} array={L1.pos} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={L1.count} array={L1.sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#1e3a5f"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      <points ref={layer2Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={L2.count} array={L2.pos} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={L2.count} array={L2.sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#3b82f6"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      <points ref={layer3Ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={L3.count} array={L3.pos} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={L3.count} array={L3.sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#22d3ee"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
