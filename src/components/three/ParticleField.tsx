"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleField({ count = 2000 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const neonColors = [
      [0, 0.94, 1], // cyan
      [0.66, 0.33, 0.97], // purple
      [0.93, 0.29, 0.6], // pink
      [0.06, 0.73, 0.51], // green
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 40;
      pos[i3 + 1] = (Math.random() - 0.5) * 40;
      pos[i3 + 2] = (Math.random() - 0.5) * 20;

      const color = neonColors[Math.floor(Math.random() * neonColors.length)];
      col[i3] = color[0];
      col[i3 + 1] = color[1];
      col[i3 + 2] = color[2];
    }

    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.02;
      points.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
