"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard, Line } from "@react-three/drei";
import * as THREE from "three";

interface NodeData {
  name: string;
  color: string;
  offset: number;
}

const businesses: NodeData[] = [
  { name: "The Craft Kitchen", color: "#ffffff", offset: 0 },
  { name: "Byte & Brew", color: "#e5e5e5", offset: (Math.PI * 2) / 3 },
  { name: "Green Groove", color: "#d4d4d4", offset: (Math.PI * 4) / 3 },
];

function FloatingNode({ name, color, offset }: NodeData) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const radius = 4.5;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.3 + offset;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(t) * radius;
      groupRef.current.position.z = Math.sin(t) * radius;
      groupRef.current.position.y = Math.sin(t * 2) * 0.8;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      <Billboard position={[0, 0.7, 0]}>
        <Text
          fontSize={0.22}
          color={color}
          anchorX="center"
          anchorY="bottom"
          font={undefined}
        >
          {name}
        </Text>
      </Billboard>
    </group>
  );
}

function ConnectionLines() {
  const lineRef = useRef<THREE.Group>(null!);
  const positions = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 60;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(t) * 4.5, Math.sin(t * 3) * 0.3, Math.sin(t) * 4.5]);
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={lineRef}>
      <Line
        points={positions}
        color="#ffffff"
        lineWidth={0.5}
        transparent
        opacity={0.15}
      />
    </group>
  );
}

export default function FloatingNodes() {
  return (
    <group>
      {businesses.map((biz) => (
        <FloatingNode key={biz.name} {...biz} />
      ))}
      <ConnectionLines />
      <pointLight
        position={[0, 0, 0]}
        color="#ffffff"
        intensity={2}
        distance={15}
      />
    </group>
  );
}
