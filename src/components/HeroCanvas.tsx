'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

/* ── Particle cloud ─────────────────────────────────────── */
function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  const { mouse } = useThree()

  // Generate 3000 random particles in a sphere
  const positions = useMemo(() => {
    const count = 3000
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Distribute in a sphere using rejection sampling
      let x, y, z
      do {
        x = (Math.random() - 0.5) * 6
        y = (Math.random() - 0.5) * 6
        z = (Math.random() - 0.5) * 4
      } while (Math.sqrt(x * x + y * y + z * z) > 3)
      arr[i * 3]     = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()

    // Slow auto-rotation
    ref.current.rotation.y = t * 0.04
    ref.current.rotation.x = Math.sin(t * 0.02) * 0.15

    // Subtle mouse parallax
    ref.current.rotation.y += (mouse.x * 0.3 - ref.current.rotation.y) * 0.02
    ref.current.rotation.x += (-mouse.y * 0.15 - ref.current.rotation.x) * 0.02
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  )
}

/* ── Floating rings ─────────────────────────────────────── */
function FloatingRing({ radius, speed, yOffset, opacity }: {
  radius: number; speed: number; yOffset: number; opacity: number
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.x = t * speed
    ref.current.rotation.z = t * speed * 0.6
    ref.current.position.y = yOffset + Math.sin(t * 0.4) * 0.15
  })

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.004, 16, 120]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
    </mesh>
  )
}

/* ── Canvas export ──────────────────────────────────────── */
export default function HeroCanvas() {
  return (
    <Canvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 3.5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.5} />
      <ParticleField />
      <FloatingRing radius={1.8} speed={0.08} yOffset={0}    opacity={0.06} />
      <FloatingRing radius={2.4} speed={0.05} yOffset={0.3}  opacity={0.04} />
      <FloatingRing radius={1.2} speed={0.12} yOffset={-0.2} opacity={0.05} />
    </Canvas>
  )
}
