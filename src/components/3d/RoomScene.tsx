"use client";
import { Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { Environment, PresentationControls } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from "@react-three/postprocessing";
import { CDPlayer } from "./CDPlayer";
import { EnvironmentLighting } from "./EnvironmentLighting";

export default function RoomScene() {
  return (
    <div className="w-full h-full relative touch-none">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={['#050505']} />
        
        <Suspense fallback={null}>
          <EnvironmentLighting />
          
          {/* Soft studio environment map for reflections */}
          <Environment preset="city" blur={0.8} />

          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-0.1, 0.1]}
            azimuth={[-0.2, 0.2]}
            config={{ mass: 2, tension: 400, friction: 40 }}
          >
            {/* Sleek, dark table */}
            <mesh position={[0, -0.85, 0]} receiveShadow>
              <boxGeometry args={[16, 0.5, 12]} />
              <meshPhysicalMaterial 
                color="#050505" 
                metalness={0.3}
                roughness={0.7} 
                clearcoat={0.1}
                envMapIntensity={0.5}
              />
            </mesh>

            <CDPlayer />
          </PresentationControls>

          <EffectComposer disableNormalPass multisampling={4}>
            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={0.8} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
