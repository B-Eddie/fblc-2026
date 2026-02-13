"use client";

export default function SceneLoading() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neon-cyan/60 font-mono text-sm tracking-wider">
          INITIALIZING NEURAL MESH
        </p>
      </div>
    </div>
  );
}
