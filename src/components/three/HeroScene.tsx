"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import ParticleField from "./ParticleField";
import FloatingNodes from "./FloatingNodes";
import DataStream from "./DataStream";
import SceneLoading from "./SceneLoading";

export default function HeroScene() {
  return (
    <div className="w-full h-[55vh] relative">
      <Suspense fallback={<SceneLoading />}>
        <Canvas
          camera={{ position: [0, 2, 14], fov: 60 }}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} color="#ffffff" intensity={1.0} />
          <pointLight
            position={[-10, -10, -5]}
            color="#e0e0e0"
            intensity={0.5}
          />

          <ParticleField />
          <FloatingNodes />
          <DataStream />

          <OrbitControls
            autoRotate
            autoRotateSpeed={0.4}
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />

          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        </Canvas>
      </Suspense>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
