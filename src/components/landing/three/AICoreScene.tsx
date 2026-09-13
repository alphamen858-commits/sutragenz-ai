"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Icosahedron, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Deterministic particle field around the core — same approach as the 2D
// starfield (seeded, not Math.random()) so it's stable across renders.
function seededPoints(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    const r = radius * (0.6 + rand() * 0.4);
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function Core({ reduced }: { reduced: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!meshRef.current || !wireRef.current) return;

    if (!reduced) {
      meshRef.current.rotation.y += delta * 0.15;
      wireRef.current.rotation.y -= delta * 0.1;
      wireRef.current.rotation.x += delta * 0.05;
    }

    // Gentle parallax toward the pointer, always active (small motion,
    // not disorienting) — this is the "interactive" part of the core.
    target.current.x = pointer.y * 0.25;
    target.current.y = pointer.x * 0.25;
    meshRef.current.rotation.x += (target.current.x - meshRef.current.rotation.x) * 0.04;
    wireRef.current.rotation.x = meshRef.current.rotation.x;
  });

  return (
    <group>
      <Icosahedron ref={meshRef} args={[1.3, 2]}>
        <meshStandardMaterial
          color="#0F0F1C"
          emissive="#2E6BFF"
          emissiveIntensity={0.4}
          roughness={0.25}
          metalness={0.6}
        />
      </Icosahedron>
      <Icosahedron ref={wireRef} args={[1.65, 1]}>
        <meshBasicMaterial color="#00F5FF" wireframe transparent opacity={0.35} />
      </Icosahedron>
    </group>
  );
}

function Particles() {
  const [positions] = useState(() => seededPoints(220, 3.4));
  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial size={0.02} color="#9B5CFF" transparent opacity={0.6} depthWrite={false} />
    </Points>
  );
}

export function AICoreScene({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 5]} intensity={1.2} color="#00F5FF" />
      <pointLight position={[-4, -2, -3]} intensity={0.8} color="#9B5CFF" />
      <Core reduced={reduced} />
      <Particles />
    </Canvas>
  );
}
