"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DataStream() {
  const groupRef = useRef<THREE.Group>(null!);

  const streams = useMemo(() => {
    const result: {
      curve: THREE.CatmullRomCurve3;
      color: string;
      speed: number;
    }[] = [];
    const colors = ["#ffffff", "#e0e0e0", "#c0c0c0", "#a0a0a0"];

    for (let i = 0; i < 8; i++) {
      const points: THREE.Vector3[] = [];
      const angle = (i / 8) * Math.PI * 2;
      const radius = 6 + Math.random() * 2;

      for (let j = 0; j < 5; j++) {
        const t = j / 4;
        points.push(
          new THREE.Vector3(
            Math.cos(angle + t * 0.5) * radius * (1 - t * 0.7),
            (Math.random() - 0.5) * 4,
            Math.sin(angle + t * 0.5) * radius * (1 - t * 0.7),
          ),
        );
      }

      result.push({
        curve: new THREE.CatmullRomCurve3(points),
        color: colors[i % colors.length],
        speed: 0.2 + Math.random() * 0.3,
      });
    }

    return result;
  }, []);

  return (
    <group ref={groupRef}>
      {streams.map((stream, i) => (
        <StreamLine key={i} {...stream} />
      ))}
    </group>
  );
}

function StreamLine({
  curve,
  color,
  speed,
}: {
  curve: THREE.CatmullRomCurve3;
  color: string;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const trailRef = useRef<THREE.Line>(null!);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.02, 8, false);
  }, [curve]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = (clock.getElapsedTime() * speed) % 1;
      const position = curve.getPointAt(t);
      meshRef.current.position.copy(position);
    }
  });

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
