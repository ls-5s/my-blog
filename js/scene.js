import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const palettes = {
  dark: {
    coreA: new THREE.Color("#18c8ff"),
    coreB: new THREE.Color("#6f3cff"),
    coreC: new THREE.Color("#8ff9ff"),
    stars: new THREE.Color("#79dfff"),
    ringA: new THREE.Color("#70f5ff"),
    ringB: new THREE.Color("#8f73ff"),
    shard: new THREE.Color("#b9faff"),
    exposure: 0.86,
    bloom: 0.68,
  },
  light: {
    coreA: new THREE.Color("#00798b"),
    coreB: new THREE.Color("#5743bd"),
    coreC: new THREE.Color("#69e9ed"),
    stars: new THREE.Color("#287f9b"),
    ringA: new THREE.Color("#008ca0"),
    ringB: new THREE.Color("#6b5bd7"),
    shard: new THREE.Color("#136f85"),
    exposure: 0.96,
    bloom: 0.28,
  },
};

const coreVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vNoise;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
          mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
          mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z
    );
  }

  void main() {
    vec3 direction = normalize(position);
    float flow = noise(direction * 2.55 + vec3(0.0, uTime * 0.16, uTime * 0.08));
    float ridges = noise(direction * 6.2 - vec3(uTime * 0.07, uTime * 0.11, 0.0));
    float displacement = (flow - 0.5) * 0.24 + (ridges - 0.5) * (0.045 + uEnergy * 0.035);
    vec3 transformed = position + normal * displacement;

    vec4 modelViewPosition = modelViewMatrix * vec4(transformed, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPosition = -modelViewPosition.xyz;
    vNoise = flow;
    gl_Position = projectionMatrix * modelViewPosition;
  }
`;

const coreFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vNoise;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vViewPosition);
    float fresnel = pow(1.0 - clamp(abs(dot(normal, viewDirection)), 0.0, 1.0), 2.15);
    float aurora = 0.5 + 0.5 * sin(vNoise * 11.0 + uTime * 0.55 + vViewPosition.y * 0.72);
    float energyLine = pow(0.5 + 0.5 * sin(vNoise * 24.0 - uTime * 0.72), 12.0);
    vec3 color = mix(uColorA, uColorB, smoothstep(0.12, 0.92, vNoise + aurora * 0.18));
    color = mix(color, uColorC, fresnel * 0.42);
    color += uColorC * energyLine * (0.13 + uEnergy * 0.08);
    color += uColorA * fresnel * 0.26;
    float alpha = clamp(0.68 + fresnel * 0.27, 0.0, 0.98);
    gl_FragColor = vec4(color, alpha);
  }
`;

const auraVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPosition = -modelViewPosition.xyz;
    gl_Position = projectionMatrix * modelViewPosition;
  }
`;

const auraFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uEnergy;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vViewPosition);
    float fresnel = pow(1.0 - clamp(abs(dot(normal, viewDirection)), 0.0, 1.0), 3.6);
    gl_FragColor = vec4(uColor, fresnel * (0.065 + uEnergy * 0.025));
  }
`;

const particleVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTwinkle;
  varying float vPhase;

  void main() {
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    float shimmer = 0.58 + 0.42 * sin(uTime * 0.65 + aPhase * 6.2831);
    gl_PointSize = aSize * uPixelRatio * (42.0 / max(0.7, -modelViewPosition.z)) * (0.7 + shimmer * 0.42);
    gl_Position = projectionMatrix * modelViewPosition;
    vTwinkle = shimmer;
    vPhase = aPhase;
  }
`;

const particleFragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vTwinkle;
  varying float vPhase;

  void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));
    if (distanceToCenter > 0.5) discard;
    float glow = pow(1.0 - distanceToCenter * 2.0, 2.4);
    vec3 color = mix(uColorA, uColorB, step(0.58, vPhase));
    gl_FragColor = vec4(color, glow * (0.34 + vTwinkle * 0.62));
  }
`;

function createParticleField(count, radiusMin, radiusMax) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const radius = THREE.MathUtils.lerp(radiusMin, radiusMax, Math.cbrt(Math.random()));
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
    positions[index * 3 + 2] = radius * Math.cos(phi);
    sizes[index] = THREE.MathUtils.randFloat(0.55, 2.4);
    phases[index] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  return geometry;
}

export function createNebulaScene({ canvas, initialTheme = "dark", reducedMotion = false }) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = palettes[initialTheme].exposure;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 30);
  camera.position.set(0, 0, 7.6);

  const world = new THREE.Group();
  scene.add(world);

  const system = new THREE.Group();
  system.rotation.x = -0.1;
  world.add(system);

  const coreGroup = new THREE.Group();
  system.add(coreGroup);

  const uniforms = {
    uTime: { value: 0 },
    uEnergy: { value: 0 },
    uColorA: { value: palettes[initialTheme].coreA.clone() },
    uColorB: { value: palettes[initialTheme].coreB.clone() },
    uColorC: { value: palettes[initialTheme].coreC.clone() },
  };

  const coreGeometry = new THREE.IcosahedronGeometry(1.5, 5);
  const coreMaterial = new THREE.ShaderMaterial({
    vertexShader: coreVertexShader,
    fragmentShader: coreFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: true,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.rotation.set(0.25, -0.15, 0.3);
  coreGroup.add(core);

  const auraMaterial = new THREE.ShaderMaterial({
    vertexShader: auraVertexShader,
    fragmentShader: auraFragmentShader,
    uniforms: {
      uColor: { value: palettes[initialTheme].coreA.clone() },
      uEnergy: { value: 0 },
    },
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const aura = new THREE.Mesh(new THREE.SphereGeometry(2.18, 48, 48), auraMaterial);
  coreGroup.add(aura);

  const shellMaterial = new THREE.MeshBasicMaterial({
    color: palettes[initialTheme].coreC,
    wireframe: true,
    transparent: true,
    opacity: 0.24,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.74, 2), shellMaterial);
  coreGroup.add(shell);

  const innerGeometry = new THREE.PlaneGeometry(5.2, 5.2, 28, 28);
  const innerPositions = innerGeometry.attributes.position;
  for (let index = 0; index < innerPositions.count; index += 1) {
    const x = innerPositions.getX(index);
    const y = innerPositions.getY(index);
    const distance = Math.sqrt(x * x + y * y);
    innerPositions.setZ(index, Math.sin(distance * 4.8) * Math.exp(-distance * 0.45) * 0.2);
  }
  const gridMaterial = new THREE.MeshBasicMaterial({
    color: palettes[initialTheme].ringA,
    wireframe: true,
    transparent: true,
    opacity: 0.045,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const energyGrid = new THREE.Mesh(innerGeometry, gridMaterial);
  energyGrid.rotation.set(1.18, 0.2, 0.35);
  system.add(energyGrid);

  const ringGroup = new THREE.Group();
  coreGroup.add(ringGroup);

  const ringMaterials = [];
  const ringSpecs = [
    { radius: 2.35, tube: 0.008, rotation: [1.26, 0.05, -0.2], opacity: 0.62, color: "ringA" },
    { radius: 2.72, tube: 0.006, rotation: [1.42, 0.45, 0.5], opacity: 0.32, color: "ringB" },
    { radius: 1.96, tube: 0.004, rotation: [1.02, -0.5, 0.1], opacity: 0.42, color: "ringA" },
  ];

  ringSpecs.forEach((spec) => {
    const material = new THREE.MeshBasicMaterial({
      color: palettes[initialTheme][spec.color],
      transparent: true,
      opacity: spec.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    ringMaterials.push(material);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(spec.radius, spec.tube, 8, 220), material);
    ring.rotation.set(...spec.rotation);
    ringGroup.add(ring);
  });

  const orbitDotGeometry = new THREE.SphereGeometry(0.035, 12, 12);
  const orbitDots = [];
  [
    { radius: 2.35, color: "ringA", rotation: [1.26, 0.05, -0.2], speed: 0.12 },
    { radius: 2.72, color: "ringB", rotation: [1.42, 0.45, 0.5], speed: -0.075 },
  ].forEach((spec, dotIndex) => {
    for (let index = 0; index < 3; index += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: palettes[initialTheme][spec.color],
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      ringMaterials.push(material);
      const dot = new THREE.Mesh(orbitDotGeometry, material);
      dot.userData = {
        radius: spec.radius,
        phase: (index / 3) * Math.PI * 2 + dotIndex * 0.42,
        speed: spec.speed,
        tiltX: spec.rotation[0],
        tiltY: spec.rotation[1],
        tiltZ: spec.rotation[2],
      };
      ringGroup.add(dot);
      orbitDots.push(dot);
    }
  });

  const shardGroup = new THREE.Group();
  const shardMaterials = [];
  const shardGeometry = new THREE.TetrahedronGeometry(0.06, 0);
  for (let index = 0; index < 34; index += 1) {
    const material = new THREE.MeshBasicMaterial({
      color: palettes[initialTheme].shard,
      transparent: true,
      opacity: THREE.MathUtils.randFloat(0.18, 0.72),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    shardMaterials.push(material);
    const shard = new THREE.Mesh(shardGeometry, material);
    const radius = THREE.MathUtils.randFloat(2.05, 4.2);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
    shard.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi) * 0.8,
      radius * Math.sin(phi) * Math.sin(theta)
    );
    const scale = THREE.MathUtils.randFloat(0.5, 2.1);
    shard.scale.setScalar(scale);
    shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    shard.userData = {
      baseY: shard.position.y,
      phase: Math.random() * Math.PI * 2,
      speed: THREE.MathUtils.randFloat(0.25, 0.65),
    };
    shardGroup.add(shard);
  }
  system.add(shardGroup);

  const particleUniforms = {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uColorA: { value: palettes[initialTheme].stars.clone() },
    uColorB: { value: palettes[initialTheme].coreB.clone() },
  };
  const particleCount = window.innerWidth < 720 ? 1500 : 3900;
  const particleGeometry = createParticleField(particleCount, 2.7, 8.8);
  const particleMaterial = new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms: particleUniforms,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  world.add(particles);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    palettes[initialTheme].bloom,
    0.42,
    0.26
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  const pointer = new THREE.Vector2(0, 0);
  const smoothPointer = new THREE.Vector2(0, 0);
  let targetPalette = palettes[initialTheme];
  let currentTheme = initialTheme;
  let targetEnergy = 0;
  let smoothEnergy = 0;
  let scroll = 0;
  let elapsed = 0;
  let paused = false;
  let destroyed = false;
  let lastFrame = performance.now();
  let resizeTimer = 0;
  let hasRendered = false;

  function getLayout() {
    const width = window.innerWidth;
    if (width <= 640) {
      return { x: 0.25, y: -1.35, scale: 0.87 };
    }
    if (width <= 880) {
      return { x: 1.05, y: -0.7, scale: 0.94 };
    }
    return { x: 2.35, y: 0.08, scale: 1.08 };
  }

  function applyBaseLayout() {
    const layout = getLayout();
    world.position.set(layout.x, layout.y, 0);
    world.scale.setScalar(layout.scale);
  }

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, width < 720 ? 1.45 : 1.8);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    particleUniforms.uPixelRatio.value = pixelRatio;
    bloomPass.strength = targetPalette.bloom * (width < 720 ? 0.62 : 1);
    applyBaseLayout();
    if (reducedMotion) {
      renderStatic();
    }
  }

  function resizeDebounced() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 120);
  }

  function renderStatic() {
    composer.render();
  }

  function animate(now) {
    if (destroyed || paused) return;
    const delta = Math.min((now - lastFrame) / 1000, 0.05);
    const isNarrow = window.innerWidth < 720;
    if (isNarrow && now - lastFrame < 27) {
      renderer.setAnimationLoop(animate);
      return;
    }
    lastFrame = now;
    elapsed += delta;

    smoothPointer.lerp(pointer, 0.055);
    smoothEnergy += (targetEnergy - smoothEnergy) * 0.055;
    uniforms.uTime.value = elapsed;
    uniforms.uEnergy.value = smoothEnergy;
    auraMaterial.uniforms.uEnergy.value = smoothEnergy;
    particleUniforms.uTime.value = elapsed;

    const scrollAmount = THREE.MathUtils.smoothstep(scroll, 0, 0.24);
    world.position.y += (getLayout().y - scrollAmount * 2.15 - world.position.y) * 0.045;
    world.rotation.y += (smoothPointer.x * 0.19 - world.rotation.y) * 0.035;
    world.rotation.x += (-smoothPointer.y * 0.12 - world.rotation.x) * 0.035;
    world.rotation.z = Math.sin(elapsed * 0.09) * 0.025 + scroll * 0.18;

    core.rotation.y += delta * (0.12 + smoothEnergy * 0.12);
    core.rotation.x = Math.sin(elapsed * 0.18) * 0.09;
    shell.rotation.y -= delta * 0.075;
    shell.rotation.z += delta * 0.025;
    energyGrid.rotation.z += delta * 0.012;
    shardGroup.rotation.y += delta * 0.018;
    coreGroup.position.x = smoothPointer.x * 0.055;
    coreGroup.position.y = smoothPointer.y * 0.035 + Math.sin(elapsed * 0.55) * 0.035;
    coreGroup.rotation.z = smoothPointer.x * 0.035;

    orbitDots.forEach((dot) => {
      const { radius, phase, speed, tiltX, tiltY, tiltZ } = dot.userData;
      const angle = phase + elapsed * speed;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const vector = new THREE.Vector3(x, y, 0);
      vector.applyEuler(new THREE.Euler(tiltX, tiltY, tiltZ));
      dot.position.copy(vector);
    });

    shardGroup.children.forEach((shard, index) => {
      const { baseY, phase, speed } = shard.userData;
      shard.position.y = baseY + Math.sin(elapsed * speed + phase) * 0.13;
      shard.rotation.x += delta * (0.13 + index * 0.001);
      shard.rotation.y += delta * 0.09;
    });

    particles.rotation.y = elapsed * 0.012 + smoothPointer.x * 0.035;
    particles.rotation.x = smoothPointer.y * 0.025;

    uniforms.uColorA.value.lerp(targetPalette.coreA, 0.035);
    uniforms.uColorB.value.lerp(targetPalette.coreB, 0.035);
    uniforms.uColorC.value.lerp(targetPalette.coreC, 0.035);
    auraMaterial.uniforms.uColor.value.lerp(targetPalette.coreA, 0.035);
    particleUniforms.uColorA.value.lerp(targetPalette.stars, 0.035);
    particleUniforms.uColorB.value.lerp(targetPalette.coreB, 0.035);
    shellMaterial.color.lerp(targetPalette.coreC, 0.035);
    gridMaterial.color.lerp(targetPalette.ringA, 0.035);
    renderer.toneMappingExposure += (targetPalette.exposure - renderer.toneMappingExposure) * 0.035;
    bloomPass.strength +=
      (targetPalette.bloom * (window.innerWidth < 720 ? 0.62 : 1) - bloomPass.strength) * 0.035;

    ringMaterials.forEach((material, index) => {
      const target = targetPalette[index % 3 === 1 ? "ringB" : "ringA"];
      material.color.lerp(target, 0.035);
    });
    shardMaterials.forEach((material) => material.color.lerp(targetPalette.shard, 0.035));

    composer.render();
    if (!hasRendered) {
      hasRendered = true;
      canvas.closest("body")?.classList.add("has-webgl");
    }
  }

  function handleVisibility() {
    paused = document.hidden;
    if (!paused) {
      lastFrame = performance.now();
      if (reducedMotion) renderStatic();
    }
  }

  applyBaseLayout();
  resize();
  window.addEventListener("resize", resizeDebounced, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);

  if (reducedMotion) {
    renderStatic();
    canvas.closest("body")?.classList.add("has-webgl");
  } else {
    renderer.setAnimationLoop(animate);
  }

  return {
    setPointer(normalizedX, normalizedY) {
      pointer.x = THREE.MathUtils.clamp(normalizedX, -1, 1);
      pointer.y = THREE.MathUtils.clamp(normalizedY, -1, 1);
    },
    setScroll(progress) {
      scroll = THREE.MathUtils.clamp(progress, 0, 1);
      if (reducedMotion) renderStatic();
    },
    setEnergy(value) {
      targetEnergy = THREE.MathUtils.clamp(value, 0, 1);
    },
    setTheme(theme) {
      if (!palettes[theme]) return;
      currentTheme = theme;
      targetPalette = palettes[theme];
      if (reducedMotion) {
        uniforms.uColorA.value.copy(palettes[theme].coreA);
        uniforms.uColorB.value.copy(palettes[theme].coreB);
        uniforms.uColorC.value.copy(palettes[theme].coreC);
        auraMaterial.uniforms.uColor.value.copy(palettes[theme].coreA);
        particleUniforms.uColorA.value.copy(palettes[theme].stars);
        particleUniforms.uColorB.value.copy(palettes[theme].coreB);
        shellMaterial.color.copy(palettes[theme].coreC);
        gridMaterial.color.copy(palettes[theme].ringA);
        ringMaterials.forEach((material, index) => {
          material.color.copy(palettes[theme][index % 3 === 1 ? "ringB" : "ringA"]);
        });
        shardMaterials.forEach((material) => material.color.copy(palettes[theme].shard));
        renderer.toneMappingExposure = palettes[theme].exposure;
        bloomPass.strength = palettes[theme].bloom;
        renderStatic();
      }
    },
    getTheme() {
      return currentTheme;
    },
    destroy() {
      destroyed = true;
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resizeDebounced);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.clearTimeout(resizeTimer);
      scene.traverse((object) => {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material?.dispose();
        }
      });
      composer.dispose();
      renderer.dispose();
    },
  };
}
