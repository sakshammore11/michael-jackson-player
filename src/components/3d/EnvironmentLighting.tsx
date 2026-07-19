"use client";

import { useStore } from "@/store/useStore";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function EnvironmentLighting() {
  const { currentSong } = useStore();
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);

  const albumThemes: Record<string, any> = {
    'Thriller': { ambient: '#0d1321', intensity: 0.5, dir: '#2c7da0', dirInt: 1.5, spot: '#4a6fa5' },
    'Bad': { ambient: '#1a0505', intensity: 0.6, dir: '#8a0303', dirInt: 1.8, spot: '#ff1a1a' },
    'Dangerous': { ambient: '#1f1a10', intensity: 0.5, dir: '#d4af37', dirInt: 2.0, spot: '#f9a03f' },
    'Off the Wall': { ambient: '#261410', intensity: 0.6, dir: '#e66b1a', dirInt: 1.5, spot: '#ffaa00' },
    'HIStory: Past, Present and Future, Book I': { ambient: '#141414', intensity: 0.5, dir: '#d9d9d9', dirInt: 2.0, spot: '#ffffff' },
    'Default': { ambient: '#080a0c', intensity: 0.3, dir: '#2a3b4c', dirInt: 1.0, spot: '#ffaa00' }
  };

  const { scene } = useThree();

  useFrame((state, delta) => {
    if (!ambientRef.current || !directionalRef.current) return;
    
    // Determine target config based on album
    let config = albumThemes['Default'];
    if (currentSong && currentSong.album) {
      // Find matching theme or fallback to Default
      const albumName = currentSong.album.toLowerCase();
      if (albumName.includes('thriller')) config = albumThemes['Thriller'];
      else if (albumName.includes('bad')) config = albumThemes['Bad'];
      else if (albumName.includes('dangerous')) config = albumThemes['Dangerous'];
      else if (albumName.includes('off the wall')) config = albumThemes['Off the Wall'];
      else if (albumName.includes('history')) config = albumThemes['HIStory: Past, Present and Future, Book I'];
    }
    
    // Smooth transition for lights
    ambientRef.current.color.lerp(new THREE.Color(config.ambient), delta * 1.5);
    ambientRef.current.intensity = THREE.MathUtils.damp(ambientRef.current.intensity, config.intensity, 2, delta);
    
    directionalRef.current.color.lerp(new THREE.Color(config.dir), delta * 1.5);
    directionalRef.current.intensity = THREE.MathUtils.damp(directionalRef.current.intensity, config.dirInt, 2, delta);

    // Smooth transition for scene background
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(new THREE.Color(config.ambient), delta * 1.5);
    } else {
      scene.background = new THREE.Color(config.ambient);
    }

    // Occasional lightning if Thriller
    if (currentSong?.album.toLowerCase().includes('thriller') && Math.random() > 0.995) {
      directionalRef.current.intensity = 8;
      if (scene.background instanceof THREE.Color) {
        scene.background.setHex(0xffffff); // Lightning flash on background
      }
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} color="#4a5568" intensity={0.2} />
      <directionalLight 
        ref={directionalRef} 
        color="#718096" 
        intensity={0.5} 
        position={[5, 5, 5]} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight color="#ffaa00" intensity={0.5} position={[-2, 1, -2]} distance={5} />
    </>
  );
}
