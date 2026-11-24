import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

interface PdfToCrystalSceneProps {
  pulseSignal: number
}

const PARTICLE_COUNT = 5200

const PARTICLE_VERTEX_SHADER = /* glsl */ `
  attribute vec3 aScatterPos;
  attribute vec3 aCrystalPos;
  attribute vec3 aSeed;
  attribute float aSize;
  attribute float aRole; // 0 = PDF body, 1 = PDF border/fold, 2 = living core spark

  uniform float uTime;
  uniform float uMorph;
  uniform float uScatter;
  uniform float uExpand;
  uniform float uPulse;
  uniform float uPixelRatio;
  uniform vec2 uPointer;

  varying float vWarmth;
  varying float vAlpha;
  varying float vRole;

  float easeInOutCubic(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    // Staggered wave disintegration from bottom-right corner upward
    float delay = aSeed.x * 0.28;
    float localT = clamp((uMorph - delay * 0.65) / max(0.25, 1.0 - delay * 0.65), 0.0, 1.0);
    float smoothT = easeInOutCubic(localT);

    // Base interpolation from flat PDF to 3D crystal
    vec3 pdfPos = position;
    // Gentle paper breathing in hero phase
    float pdfWave = sin(pdfPos.x * 1.4 + uTime * 0.9 + aSeed.y * 2.0) * 0.045 * (1.0 - smoothT);
    pdfPos.z += pdfWave;

    vec3 crystalPos = aCrystalPos * (1.0 + uExpand * 0.22);
    // Subtle living pulse inside the crystal
    float breathe = sin(uTime * 1.5 + aSeed.z * 6.2831) * 0.04 * smoothT;
    crystalPos += normalize(crystalPos + vec3(0.0001)) * (breathe + uPulse * 0.24);

    vec3 pos = mix(pdfPos, crystalPos, smoothT);

    // Mid-transition vortex disintegration burst
    float bell = sin(smoothT * 3.14159265);
    float swirlAngle = bell * (1.6 + aSeed.y * 2.2) * (0.4 + uScatter);
    float cs = cos(swirlAngle);
    float sn = sin(swirlAngle);

    vec3 scatterOffset = aScatterPos * bell * (0.65 + uScatter * 0.85);
    vec2 spun = vec2(
      scatterOffset.x * cs - scatterOffset.z * sn,
      scatterOffset.x * sn + scatterOffset.z * cs
    );
    scatterOffset.x = spun.x;
    scatterOffset.z = spun.y;

    pos += scatterOffset;

    // Gentle pointer parallax / magnetic ripple
    vec3 pointerWorld = vec3(uPointer.x * 3.2, uPointer.y * 2.2, 0.4);
    vec3 toPointer = pos - pointerWorld;
    float dist = length(toPointer);
    float repel = smoothstep(1.9, 0.0, dist) * 0.32;
    pos += normalize(toPointer + vec3(0.0001)) * repel;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthScale = 16.0 / max(1.6, -mvPosition.z);
    float twinkle = 0.82 + 0.28 * sin(uTime * 2.2 + aSeed.x * 18.0);
    float pulseBoost = 1.0 + uPulse * 0.42;
    gl_PointSize = aSize * uPixelRatio * depthScale * twinkle * pulseBoost;

    // Color warmth: cold slate PDF -> molten copper vortex -> warm copper & champagne crystal
    float coreWarmth = step(1.5, aRole) * 0.85;
    vWarmth = clamp(max(coreWarmth, smoothT * 0.85 + bell * 0.55 + uPulse * 0.35), 0.0, 1.0);
    vAlpha = (0.42 + 0.42 * smoothT + 0.16 * bell) * (0.75 + 0.25 * twinkle);
    if (aRole > 1.5) {
      vAlpha = min(1.0, vAlpha + 0.25);
    }
    vRole = aRole;
  }
`

const PARTICLE_FRAGMENT_SHADER = /* glsl */ `
  varying float vWarmth;
  varying float vAlpha;
  varying float vRole;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    // Crisp luminous core with silky halo
    float core = smoothstep(0.5, 0.05, d);
    float glow = pow(core, 1.85);

    vec3 slatePdf = vec3(0.49, 0.47, 0.45);       // Cold archival PDF ash
    vec3 moltenCopper = vec3(0.88, 0.48, 0.28);   // Living copper accent #E07A47
    vec3 champagne = vec3(0.96, 0.80, 0.64);      // Warm champagne highlight #F2C094

    vec3 color = mix(slatePdf, moltenCopper, smoothstep(0.05, 0.72, vWarmth));
    color = mix(color, champagne, smoothstep(0.58, 1.0, vWarmth) * (0.45 + 0.55 * core));

    // Extra ivory brilliance in the very center of crystal sparks
    if (vRole > 1.5) {
      color = mix(color, vec3(1.0, 0.94, 0.86), core * 0.55);
    }

    gl_FragColor = vec4(color, glow * vAlpha * 0.86);
  }
`

const CRYSTAL_FACET_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`

const CRYSTAL_FACET_FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  uniform float uPulse;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.4);
    vec3 copper = vec3(0.88, 0.48, 0.28);
    vec3 champagne = vec3(0.96, 0.82, 0.68);
    vec3 color = mix(copper, champagne, fresnel);
    float alpha = (0.04 + fresnel * 0.24 + uPulse * 0.09) * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`

function buildPdfParticlePosition(index: number, total: number): {
  x: number
  y: number
  z: number
  role: number
} {
  const width = 2.45
  const height = 3.35
  const halfW = width * 0.5
  const halfH = height * 0.5
  const foldSize = 0.52

  const ratio = index / total

  // 1) Central living copper spark inside the flat PDF (6% of particles)
  if (ratio < 0.06) {
    const angle = Math.random() * Math.PI * 2
    const r = Math.pow(Math.random(), 1.6) * 0.38
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r - 0.05,
      z: (Math.random() - 0.5) * 0.14 + 0.05,
      role: 2,
    }
  }

  // 2) Crisp A4 border + folded top-right dog-ear corner (22% of particles)
  if (ratio < 0.28) {
    const seg = Math.random()
    let x = 0
    let y = 0
    if (seg < 0.25) {
      // Left edge
      x = -halfW
      y = (Math.random() - 0.5) * height
    } else if (seg < 0.5) {
      // Bottom edge
      x = (Math.random() - 0.5) * width
      y = -halfH
    } else if (seg < 0.72) {
      // Top edge up to fold
      x = -halfW + Math.random() * (width - foldSize)
      y = halfH
    } else if (seg < 0.92) {
      // Right edge below fold
      x = halfW
      y = -halfH + Math.random() * (height - foldSize)
    } else {
      // Folded corner diagonal
      const t = Math.random()
      x = halfW - foldSize + t * foldSize
      y = halfH - t * foldSize
    }
    return {
      x: x + (Math.random() - 0.5) * 0.025,
      y: y + (Math.random() - 0.5) * 0.025,
      z: (Math.random() - 0.5) * 0.03,
      role: 1,
    }
  }

  // 3) Structured "PDF document text lines" (72% of particles)
  const lineCount = 15
  const lineIdx = Math.floor(Math.random() * lineCount)
  const yNorm = 1 - (lineIdx + 0.5) / lineCount
  const y = -halfH + 0.34 + yNorm * (height - 0.72)

  // Make heading lines shorter & realistic paragraph breaks
  let lineWidth = width - 0.62
  if (lineIdx === 0) lineWidth *= 0.58
  else if (lineIdx === 1) lineWidth *= 0.42
  else if (lineIdx === 5 || lineIdx === 10 || lineIdx === 14) lineWidth *= 0.66
  else lineWidth *= 0.85 + Math.random() * 0.14

  // Avoid colliding with top-right folded corner
  if (lineIdx <= 1) {
    lineWidth = Math.min(lineWidth, width - foldSize - 0.5)
  }

  const x = -halfW + 0.31 + Math.random() * lineWidth
  const jitterY = (Math.random() - 0.5) * 0.032

  return {
    x,
    y: y + jitterY,
    z: (Math.random() - 0.5) * 0.04,
    role: 0,
  }
}

function buildCrystalParticlePosition(index: number, total: number): {
  x: number
  y: number
  z: number
} {
  const ratio = index / total

  // 1) Dense luminous neural core (18%)
  if (ratio < 0.18) {
    const u = Math.random()
    const v = Math.random()
    const theta = u * 2 * Math.PI
    const phi = Math.acos(2 * v - 1)
    const r = Math.pow(Math.random(), 0.7) * 0.68
    return {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
    }
  }

  // 2) Faceted icosahedral crystal shell (58%)
  if (ratio < 0.76) {
    const u = Math.random()
    const v = Math.random()
    const theta = u * 2 * Math.PI
    const phi = Math.acos(2 * v - 1)
    // Quantize slightly toward crystal symmetry planes
    const sx = Math.sin(phi) * Math.cos(theta)
    const sy = Math.sin(phi) * Math.sin(theta)
    const sz = Math.cos(phi)
    const facetPull = 1.0 + 0.18 * Math.cos(theta * 5.0) * Math.sin(phi * 3.0)
    const radius = (1.55 + (Math.random() - 0.5) * 0.14) * facetPull
    return {
      x: sx * radius,
      y: sy * radius * 1.18,
      z: sz * radius,
    }
  }

  // 3) Tilted orbital dialogue rings (24%)
  const ringSelect = index % 2 === 0 ? 1 : -1
  const angle = Math.random() * Math.PI * 2
  const radius = 2.18 + (Math.random() - 0.5) * 0.18
  const rx = Math.cos(angle) * radius
  const ry = (Math.random() - 0.5) * 0.08
  const rz = Math.sin(angle) * radius

  // Tilt ring in 3D space
  const tilt = ringSelect * 0.52
  const cosT = Math.cos(tilt)
  const sinT = Math.sin(tilt)
  return {
    x: rx,
    y: ry * cosT - rz * sinT,
    z: ry * sinT + rz * cosT,
  }
}

function createPdfOutlineGeometry(): THREE.BufferGeometry {
  const w = 2.45 * 0.5
  const h = 3.35 * 0.5
  const f = 0.52

  const pts: number[] = [
    // Outer sheet with folded corner
    -w, -h, 0,  w, -h, 0,
     w, -h, 0,  w, h - f, 0,
     w, h - f, 0,  w - f, h, 0,
     w - f, h, 0,  -w, h, 0,
    -w, h, 0,  -w, -h, 0,
    // Fold inner crease
     w - f, h, 0,  w - f, h - f, 0.02,
     w - f, h - f, 0.02,  w, h - f, 0,
  ]

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return geom
}

function createNeuralConnectionsGeometry(radius: number): THREE.BufferGeometry {
  const nodes: THREE.Vector3[] = []
  const nodeCount = 26
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < nodeCount; i++) {
    const y = 1 - (i / (nodeCount - 1)) * 2
    const rAtY = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = goldenAngle * i
    const r = radius * (0.68 + (i % 3) * 0.14)
    nodes.push(
      new THREE.Vector3(
        Math.cos(theta) * rAtY * r,
        y * r * 1.15,
        Math.sin(theta) * rAtY * r,
      ),
    )
  }

  const segments: number[] = []
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < radius * 1.15) {
        segments.push(
          nodes[i].x, nodes[i].y, nodes[i].z,
          nodes[j].x, nodes[j].y, nodes[j].z,
        )
      }
    }
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3))
  return geom
}

function shouldStartInFallback(): boolean {
  if (typeof window === 'undefined') return true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  try {
    const testCanvas = document.createElement('canvas')
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl')
    return !gl
  } catch {
    return true
  }
}

export function PdfToCrystalScene({ pulseSignal }: PdfToCrystalSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const pulseUniformRef = useRef<{ value: number } | null>(null)
  const [fallbackMode, setFallbackMode] = useState<boolean>(shouldStartInFallback)

  // Trigger a warm luminous ripple in 3D whenever the user interacts with the chat
  useEffect(() => {
    if (pulseSignal === 0 || !pulseUniformRef.current) return
    gsap.killTweensOf(pulseUniformRef.current)
    gsap.fromTo(
      pulseUniformRef.current,
      { value: 0.95 },
      { value: 0, duration: 1.35, ease: 'power3.out' },
    )
  }, [pulseSignal])

  useEffect(() => {
    if (fallbackMode) {
      return
    }

    const container = mountRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      queueMicrotask(() => setFallbackMode(true))
      return
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    )
    camera.position.set(0, 0.15, 7.6)

    const masterGroup = new THREE.Group()
    scene.add(masterGroup)

    // 1. Primary morphing particle cloud (PDF -> Vortex -> 3D Crystal)
    const particleGeo = new THREE.BufferGeometry()
    const pdfPositions = new Float32Array(PARTICLE_COUNT * 3)
    const scatterPositions = new Float32Array(PARTICLE_COUNT * 3)
    const crystalPositions = new Float32Array(PARTICLE_COUNT * 3)
    const seeds = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const roles = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const pdf = buildPdfParticlePosition(i, PARTICLE_COUNT)
      pdfPositions[i3] = pdf.x
      pdfPositions[i3 + 1] = pdf.y
      pdfPositions[i3 + 2] = pdf.z
      roles[i] = pdf.role

      const crystal = buildCrystalParticlePosition(i, PARTICLE_COUNT)
      crystalPositions[i3] = crystal.x
      crystalPositions[i3 + 1] = crystal.y
      crystalPositions[i3 + 2] = crystal.z

      // Explosion vector in 3D space
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const blastR = 1.4 + Math.random() * 2.8
      scatterPositions[i3] = Math.sin(phi) * Math.cos(theta) * blastR
      scatterPositions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * blastR * 0.85
      scatterPositions[i3 + 2] = Math.cos(phi) * blastR

      // Deterministic-feeling wave delay based on vertical PDF position + randomness
      const verticalDelay = 1.0 - (pdf.y + 1.675) / 3.35
      seeds[i3] = Math.min(1, Math.max(0, verticalDelay * 0.65 + Math.random() * 0.35))
      seeds[i3 + 1] = Math.random()
      seeds[i3 + 2] = Math.random()

      sizes[i] =
        pdf.role === 2
          ? 2.2 + Math.random() * 1.4
          : pdf.role === 1
            ? 1.55 + Math.random() * 0.9
            : 1.15 + Math.random() * 1.05
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pdfPositions, 3))
    particleGeo.setAttribute('aScatterPos', new THREE.BufferAttribute(scatterPositions, 3))
    particleGeo.setAttribute('aCrystalPos', new THREE.BufferAttribute(crystalPositions, 3))
    particleGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3))
    particleGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    particleGeo.setAttribute('aRole', new THREE.BufferAttribute(roles, 1))

    const uPulse = { value: 0 }
    pulseUniformRef.current = uPulse

    const particleMat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uScatter: { value: 0 },
        uExpand: { value: 0 },
        uPulse,
        uPixelRatio: { value: dpr },
        uPointer: { value: new THREE.Vector2(0, 0) },
      },
    })

    const particleCloud = new THREE.Points(particleGeo, particleMat)
    masterGroup.add(particleCloud)

    // 2. Architectural PDF wireframe outline (fades away as document disintegrates)
    const pdfOutlineGeo = createPdfOutlineGeometry()
    const pdfOutlineMat = new THREE.LineBasicMaterial({
      color: 0x8e867f,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    })
    const pdfOutline = new THREE.LineSegments(pdfOutlineGeo, pdfOutlineMat)
    masterGroup.add(pdfOutline)

    // 3. Faceted 3D Crystal core + edges + neural dialogue network (materializes on scroll)
    const crystalGroup = new THREE.Group()
    masterGroup.add(crystalGroup)

    const icoGeo = new THREE.IcosahedronGeometry(1.56, 1)
    icoGeo.scale(1, 1.18, 1)

    const crystalFacetMat = new THREE.ShaderMaterial({
      vertexShader: CRYSTAL_FACET_VERTEX,
      fragmentShader: CRYSTAL_FACET_FRAGMENT,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uOpacity: { value: 0 },
        uPulse,
      },
    })
    const crystalShell = new THREE.Mesh(icoGeo, crystalFacetMat)
    crystalGroup.add(crystalShell)

    const crystalEdgesGeo = new THREE.EdgesGeometry(icoGeo, 12)
    const crystalEdgesMat = new THREE.LineBasicMaterial({
      color: 0xe07a47,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const crystalEdges = new THREE.LineSegments(crystalEdgesGeo, crystalEdgesMat)
    crystalGroup.add(crystalEdges)

    const innerOctaGeo = new THREE.OctahedronGeometry(0.72, 0)
    const innerEdgesGeo = new THREE.EdgesGeometry(innerOctaGeo)
    const innerEdgesMat = new THREE.LineBasicMaterial({
      color: 0xf2c094,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const innerEdges = new THREE.LineSegments(innerEdgesGeo, innerEdgesMat)
    crystalGroup.add(innerEdges)

    const neuralGeo = createNeuralConnectionsGeometry(1.48)
    const neuralMat = new THREE.LineBasicMaterial({
      color: 0xf2c094,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const neuralLines = new THREE.LineSegments(neuralGeo, neuralMat)
    crystalGroup.add(neuralLines)

    // Scroll-driven choreography state (animated by GSAP ScrollTrigger)
    const story = {
      morph: 0,
      scatter: 0,
      expand: 0,
      orbit: 0,
      shiftX: -0.45,
      shiftY: 0.08,
      camZ: 7.6,
    }

    const gsapCtx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.9,
        },
      })

      // Phase 1: Hero PDF holds slightly, then begins disintegration on Comparison
      tl.to(
        story,
        {
          morph: 0.36,
          scatter: 1.0,
          orbit: 0.72,
          shiftX: 0.2,
          shiftY: -0.06,
          camZ: 7.0,
          duration: 0.32,
          ease: 'none',
        },
        0,
      )
      // Phase 2: Vortex condenses into luminous 3D Crystal on Concepts
      tl.to(
        story,
        {
          morph: 0.95,
          scatter: 0.14,
          orbit: 2.15,
          shiftX: 0.55,
          shiftY: 0.05,
          camZ: 6.45,
          duration: 0.36,
          ease: 'none',
        },
        0.32,
      )
      // Phase 3: Crystal opens into calm radiant neural dialogue on Process / About / Footer
      tl.to(
        story,
        {
          morph: 1.0,
          scatter: 0.0,
          expand: 0.75,
          orbit: 3.6,
          shiftX: -0.4,
          shiftY: 0.14,
          camZ: 7.35,
          duration: 0.32,
          ease: 'none',
        },
        0.68,
      )
    })

    // Pointer tracking (throttled smoothly in render loop, no per-frame allocations)
    const pointerTarget = { x: 0, y: 0 }
    const pointerCurrent = { x: 0, y: 0 }
    let lastPointerEvent = 0

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now()
      if (now - lastPointerEvent < 16) return
      lastPointerEvent = now
      pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1
      pointerTarget.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }

    const onWindowBlur = () => {
      pointerTarget.x = 0
      pointerTarget.y = 0
    }

    // Responsive sizing
    const onResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(nextDpr)
      renderer.setSize(width, height)
      particleMat.uniforms.uPixelRatio.value = nextDpr
    }

    // Pause when tab hidden or canvas offscreen
    let isVisible = !document.hidden
    let isInViewport = true
    let rafId = 0
    let lastTime = performance.now()
    let elapsed = 0

    const renderLoop = (now: number) => {
      if (!isVisible || !isInViewport) {
        rafId = 0
        return
      }
      rafId = window.requestAnimationFrame(renderLoop)

      const dt = Math.min((now - lastTime) * 0.001, 0.05)
      lastTime = now
      elapsed += dt

      // Smooth pointer lerp
      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.06
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.06

      particleMat.uniforms.uTime.value = elapsed
      particleMat.uniforms.uMorph.value = story.morph
      particleMat.uniforms.uScatter.value = story.scatter
      particleMat.uniforms.uExpand.value = story.expand
      particleMat.uniforms.uPointer.value.set(pointerCurrent.x, pointerCurrent.y)

      // Fade out flat PDF outline as soon as morph starts
      const pdfOpacity = Math.max(0, 1 - story.morph * 3.6)
      pdfOutlineMat.opacity = pdfOpacity * 0.34
      pdfOutline.visible = pdfOpacity > 0.01

      // Materialize faceted 3D crystal & neural rays once particles converge
      const crystalVis = THREE.MathUtils.smoothstep(story.morph, 0.42, 0.92)
      crystalGroup.visible = crystalVis > 0.01
      crystalFacetMat.uniforms.uOpacity.value = crystalVis
      crystalEdgesMat.opacity = crystalVis * 0.28
      innerEdgesMat.opacity = crystalVis * 0.44
      neuralMat.opacity = crystalVis * (0.2 + story.expand * 0.16)

      const crystalScale = 0.72 + crystalVis * 0.28 + story.expand * 0.14
      crystalGroup.scale.setScalar(crystalScale)
      innerEdges.rotation.y = -elapsed * 0.48
      innerEdges.rotation.x = elapsed * 0.32

      // Spatial framing: responsive mobile centering vs editorial desktop offset
      const isCompact = window.innerWidth < 1024
      const offsetX = isCompact ? 0 : story.shiftX
      masterGroup.position.x = offsetX + pointerCurrent.x * 0.22
      masterGroup.position.y = story.shiftY + pointerCurrent.y * 0.16

      // Smooth rotation: crisp slight tilt for PDF, continuous orbital flow for crystal
      const baseTiltY = 0.32 * (1 - crystalVis) + (elapsed * 0.14 + story.orbit) * crystalVis
      const baseTiltX = -0.1 * (1 - crystalVis) + Math.sin(elapsed * 0.35) * 0.12 * crystalVis

      masterGroup.rotation.y = baseTiltY + pointerCurrent.x * 0.24
      masterGroup.rotation.x = baseTiltX - pointerCurrent.y * 0.18
      masterGroup.rotation.z = Math.sin(elapsed * 0.22) * 0.04

      // Camera gentle orbital sway
      camera.position.z = isCompact ? story.camZ + 1.45 : story.camZ
      camera.position.x = Math.sin(story.orbit * 0.65) * 0.48
      camera.position.y = 0.12 + Math.cos(story.orbit * 0.5) * 0.22
      camera.lookAt(masterGroup.position.x * 0.35, masterGroup.position.y * 0.35, 0)

      renderer.render(scene, camera)
    }

    const startLoop = () => {
      if (!rafId && isVisible && isInViewport) {
        lastTime = performance.now()
        rafId = window.requestAnimationFrame(renderLoop)
      }
    }

    const onVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible) {
        startLoop()
      } else if (rafId) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        isInViewport = entries[0]?.isIntersecting ?? true
        if (isInViewport) {
          startLoop()
        } else if (rafId) {
          window.cancelAnimationFrame(rafId)
          rafId = 0
        }
      },
      { threshold: 0.01 },
    )
    observer.observe(container)

    const onContextLost = (event: Event) => {
      event.preventDefault()
      if (rafId) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
      setFallbackMode(true)
    }

    renderer.domElement.addEventListener('webglcontextlost', onContextLost)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('blur', onWindowBlur)
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    startLoop()

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      observer.disconnect()
      gsapCtx.revert()

      renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', onWindowBlur)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)

      particleGeo.dispose()
      particleMat.dispose()
      pdfOutlineGeo.dispose()
      pdfOutlineMat.dispose()
      icoGeo.dispose()
      crystalFacetMat.dispose()
      crystalEdgesGeo.dispose()
      crystalEdgesMat.dispose()
      innerOctaGeo.dispose()
      innerEdgesGeo.dispose()
      innerEdgesMat.dispose()
      neuralGeo.dispose()
      neuralMat.dispose()

      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      pulseUniformRef.current = null
    }
  }, [fallbackMode])

  if (fallbackMode) {
    return (
      <div
        aria-hidden="true"
        className="static-scene-poster pointer-events-none fixed inset-0 z-0"
      />
    )
  }

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-95"
    >
      {/* Subtle radial readability vignette keeping semantic copy crisp */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, transparent 25%, rgba(12, 11, 10, 0.72) 100%)',
        }}
      />
    </div>
  )
}
