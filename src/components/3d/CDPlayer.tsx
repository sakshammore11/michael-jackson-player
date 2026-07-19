"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useStore } from "@/store/useStore";
import * as THREE from "three";

export function CDPlayer() {
  const cdRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const speedRef = useRef(0);
  const { currentSong, isPlaying, isReadyToListen } = useStore();

  useFrame((state, delta) => {
    // Spin the vinyl record
    if (cdRef.current) {
      const targetSpeed = isPlaying ? 3 : (currentSong ? 0.5 : 0);
      speedRef.current = THREE.MathUtils.damp(speedRef.current, targetSpeed, 2, delta);
      cdRef.current.rotation.y -= delta * speedRef.current;
      
      // Wobble effect when spinning fast
      if (isPlaying) {
        cdRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.002;
        cdRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 8) * 0.002;
      } else {
        cdRef.current.rotation.z = THREE.MathUtils.damp(cdRef.current.rotation.z, 0, 4, delta);
        cdRef.current.rotation.x = THREE.MathUtils.damp(cdRef.current.rotation.x, 0, 4, delta);
      }
    }

    // Smoothly sweep tonearm over record when playing/ready
    if (armRef.current) {
      const target = isReadyToListen ? 0.45 : 0;
      armRef.current.rotation.y = THREE.MathUtils.damp(
        armRef.current.rotation.y,
        target,
        4,
        delta
      );
    }
  });

  const ledColor = isPlaying ? "#00ffaa" : "#ff4400";

  return (
    <group position={[0, -0.5, 0]}>
      {/* ── Turntable Plinth ── */}
      <RoundedBox
        args={[5.2, 0.35, 4.6]}
        radius={0.12}
        smoothness={4}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#0c0c0c"
          roughness={0.55}
          metalness={0.6}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* ── Metal Platter ── */}
      <mesh position={[-0.5, 0.23, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.85, 1.85, 0.09, 64]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* ── Vinyl Record (only when song is loaded) ── */}
      {currentSong && (
        <group position={[-0.5, 0.285, 0]} ref={cdRef}>
          {/* Main black vinyl */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[1.78, 1.78, 0.018, 64]} />
            <meshStandardMaterial color="#060606" roughness={0.2} metalness={0.95} />
          </mesh>
          {/* Inner groove area */}
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.65, 1.75, 0.003, 64]} />
            <meshStandardMaterial color="#121212" roughness={0.5} metalness={0.6} />
          </mesh>
          {/* Reflective groove highlight (anisotropic stripe - offset so it's visible when spinning) */}
          <mesh position={[1.1, 0.016, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 0.9]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
          </mesh>
          {/* Center label */}
          <mesh position={[0, 0.015, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.008, 64]} />
            <meshStandardMaterial color="#c8973a" roughness={0.9} metalness={0.05} />
          </mesh>
          {/* Label text stripe (offset white line — orbits visibly) */}
          <mesh position={[0.25, 0.025, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.06, 0.5]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
          </mesh>
          {/* Red speed dot offset from center */}
          <mesh position={[0.38, 0.026, 0.1]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#e63030" />
          </mesh>
          {/* Center spindle hole */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.038, 0.038, 0.025, 32]} />
            <meshBasicMaterial color="#000" />
          </mesh>
        </group>
      )}

      {/* ── Spindle Pin ── */}
      <mesh position={[-0.5, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.032, 0.12, 32]} />
        <meshStandardMaterial color="#ddd" metalness={1} roughness={0.05} />
      </mesh>

      {/* ── Tonearm Assembly ── */}
      <group position={[1.7, 0.2, -1.5]} ref={armRef}>
        {/* Pivot post */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.26, 0.24, 32]} />
          <meshStandardMaterial color="#1c1c1c" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Arm tube — angled horizontally toward record */}
        <mesh
          position={[-1.0, 0.22, 0.65]}
          rotation={[Math.PI / 2, 0, Math.PI / 2 + 0.42]}
          castShadow
        >
          <cylinderGeometry args={[0.028, 0.028, 2.4, 16]} />
          <meshStandardMaterial color="#aaa" metalness={1} roughness={0.15} />
        </mesh>

        {/* Counterweight end */}
        <mesh position={[0.5, 0.22, -0.3]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.28, 32]} />
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Headshell */}
        <mesh
          position={[-2.05, 0.21, 1.35]}
          rotation={[0, -0.42, 0]}
          castShadow
        >
          <boxGeometry args={[0.16, 0.07, 0.32]} />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Red stylus dot */}
        <mesh position={[-2.12, 0.17, 1.42]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshBasicMaterial color="#ff2200" />
        </mesh>
      </group>

      {/* ── Controls strip (right side of plinth) ── */}
      {/* Speed knob */}
      <mesh position={[2.0, 0.22, 0.8]} castShadow>
        <cylinderGeometry args={[0.13, 0.16, 0.12, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Volume knob */}
      <mesh position={[2.0, 0.22, 0.2]} castShadow>
        <cylinderGeometry args={[0.13, 0.16, 0.12, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* LED indicator */}
      <mesh position={[2.0, 0.22, -0.3]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={ledColor} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
