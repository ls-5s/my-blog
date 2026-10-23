// @ts-nocheck
const TAU = Math.PI * 2;
const LOCK_TIME = 1750;
const HANDOFF_TIME = 2150;
const GATE_DURATION = 340;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (start, end, amount) => start + (end - start) * amount;
const random = (min, max) => min + Math.random() * (max - min);
const smoothstep = (start, end, value) => {
  const normalized = clamp((value - start) / (end - start));
  return normalized * normalized * (3 - 2 * normalized);
};
const easeOutCubic = (value) => 1 - Math.pow(1 - clamp(value), 3);
const easeInOutCubic = (value) => {
  const normalized = clamp(value);
  return normalized < 0.5
    ? 4 * normalized * normalized * normalized
    : 1 - Math.pow(-2 * normalized + 2, 3) / 2;
};

const GLOW_SPRITE_SIZE = 32;

function createGlowSprite(color) {
  const sprite = document.createElement("canvas");
  sprite.width = GLOW_SPRITE_SIZE;
  sprite.height = GLOW_SPRITE_SIZE;
  const spriteContext = sprite.getContext("2d");
  if (!spriteContext) return null;

  const center = GLOW_SPRITE_SIZE / 2;
  const glow = spriteContext.createRadialGradient(center, center, 0, center, center, center);
  glow.addColorStop(0, `rgba(${color}, 1)`);
  glow.addColorStop(0.18, `rgba(${color}, 0.82)`);
  glow.addColorStop(0.48, `rgba(${color}, 0.2)`);
  glow.addColorStop(1, `rgba(${color}, 0)`);
  spriteContext.fillStyle = glow;
  spriteContext.fillRect(0, 0, GLOW_SPRITE_SIZE, GLOW_SPRITE_SIZE);
  return sprite;
}

function createGlowSprites() {
  return {
    cyan: createGlowSprite("184, 252, 255"),
    violet: createGlowSprite("187, 165, 255"),
  };
}

function createStar(width, height, spawnAnywhere = true) {
  return {
    x: random(-1, 1),
    y: random(-1, 1),
    z: spawnAnywhere ? random(0.22, 1.65) : 1.65,
    previousX: width / 2,
    previousY: height / 2,
    size: random(0.45, 1.65),
    color: Math.random() < 0.12 ? "green" : Math.random() < 0.72 ? "cyan" : "violet",
  };
}

function createParticleTargets(width, height) {
  const sample = document.createElement("canvas");
  const sampleWidth = 620;
  const sampleHeight = 340;
  sample.width = sampleWidth;
  sample.height = sampleHeight;

  const context = sample.getContext("2d", { willReadFrequently: true });
  if (!context) return [];

  context.clearRect(0, 0, sampleWidth, sampleHeight);
  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font =
    '800 246px "Arial Narrow", "Aptos Display", "PingFang SC", "Microsoft YaHei", sans-serif';
  context.fillText("LY", sampleWidth / 2, sampleHeight / 2);

  const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;
  const points = [];
  const step = width < 720 ? 6 : 4;
  for (let y = 0; y < sampleHeight; y += step) {
    for (let x = 0; x < sampleWidth; x += step) {
      if (pixels[(y * sampleWidth + x) * 4 + 3] < 128) continue;
      points.push({ x, y });
    }
  }

  for (let index = points.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [points[index], points[swapIndex]] = [points[swapIndex], points[index]];
  }

  const limit = width < 720 ? 120 : 220;
  const desiredWidth = Math.min(width * 0.34, height * 0.34, 270);
  const scale = desiredWidth / 390;
  const centerX = width / 2;
  const centerY = height * 0.47;

  return points.slice(0, limit).map((point) => ({
    x: centerX + (point.x - sampleWidth / 2) * scale,
    y: centerY + (point.y - sampleHeight / 2) * scale,
  }));
}

export function createBootSequence({ canvas, reducedMotion = false }) {
  const root = canvas.closest(".boot-screen");
  const status = root?.querySelector("#boot-status");
  const context = canvas.getContext("2d", { alpha: false });

  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let particles = [];
  let loadingProgress = 0;
  let startedAt = 0;
  let pausedAt = 0;
  let pauseDuration = 0;
  let previousFrameAt = 0;
  let frameId = 0;
  let running = false;
  let destroyed = false;
  let glowSprites = null;
  let locked = false;
  let enterRequested = false;
  let gateStarted = false;
  let gateStartedAt = 0;
  let enterPromise = null;
  let resolveEnter = null;
  let lastStatus = "";

  function now() {
    return performance.now() - startedAt - pauseDuration;
  }

  function setStatus(value) {
    if (!status || value === lastStatus) return;
    lastStatus = value;
    status.textContent = value;
  }

  function drawGlow(x, y, radius, sprite, alpha) {
    if (!sprite) {
      context.globalAlpha = alpha;
      context.beginPath();
      context.arc(x, y, radius, 0, TAU);
      context.fill();
      return;
    }
    const size = Math.max(5, radius * 5.5);
    context.globalAlpha = alpha;
    context.drawImage(sprite, x - size / 2, y - size / 2, size, size);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (reducedMotion) {
      stars = [];
      particles = [];
      drawStaticFrame();
      return;
    }

    const starCount = width < 720 ? 150 : 300;
    stars = Array.from({ length: starCount }, () => createStar(width, height));
    const targets = createParticleTargets(width, height);
    particles = targets.map((target, index) => {
      const angle = random(0, TAU);
      const radius = Math.min(width, height) * random(0.18, 0.42);
      return {
        ...target,
        startX: width / 2 + Math.cos(angle) * radius,
        startY: height * 0.47 + Math.sin(angle) * radius * 0.72,
        previousX: width / 2,
        previousY: height * 0.47,
        size: random(0.6, 1.8),
        phase: random(0, TAU),
        tone: index % 5 === 0 ? "violet" : "cyan",
      };
    });

  }

  function projectStar(star) {
    const perspective = Math.min(width, height) * 1.15;
    return {
      x: width / 2 + (star.x / star.z) * perspective,
      y: height / 2 + (star.y / star.z) * perspective,
      depth: clamp(1.7 - star.z, 0, 1.6),
    };
  }

  function drawStarField(time, warp, delta) {
    const speed = 0.22 + warp * 2.7 + loadingProgress * 0.14;
    context.globalCompositeOperation = "lighter";
    context.lineCap = "round";

    stars.forEach((star) => {
      const before = projectStar(star);
      star.z -= speed * delta;
      star.previousX = before.x;
      star.previousY = before.y;

      if (star.z < 0.08) {
        Object.assign(star, createStar(width, height, false));
        return;
      }

      const after = projectStar(star);
      const intensity = clamp(1 - star.z / 1.7);
      const trail = clamp(0.6 + warp * 19, 1, 24);
      const color =
        star.color === "violet"
          ? "154, 117, 255"
          : star.color === "green"
            ? "184, 255, 122"
            : "125, 247, 255";

      context.beginPath();
      context.moveTo(
        lerp(after.x, star.previousX, 0.08 * trail),
        lerp(after.y, star.previousY, 0.08 * trail)
      );
      context.lineTo(after.x, after.y);
      context.strokeStyle = `rgba(${color}, ${(0.12 + intensity * 0.72) * (0.35 + warp)})`;
      context.lineWidth = star.size * (0.42 + intensity * 0.75);
      context.stroke();

      if (intensity > 0.42) {
        context.beginPath();
        context.arc(after.x, after.y, star.size * (0.55 + intensity), 0, TAU);
        context.fillStyle = `rgba(${color}, ${intensity * 0.55})`;
        context.fill();
      }
    });

    context.globalCompositeOperation = "source-over";
  }

  function drawPortal(time, warp) {
    const centerX = width / 2;
    const centerY = height / 2;
    const base = Math.min(width, height) * (width < 720 ? 0.245 : 0.22);
    const pulse = 1 + Math.sin(time * 2.8) * 0.012 + warp * 0.06;

    context.save();
    context.translate(centerX, centerY);
    context.globalCompositeOperation = "lighter";

    const glow = context.createRadialGradient(0, 0, 0, 0, 0, base * 1.8);
    glow.addColorStop(0, `rgba(218, 254, 255, ${0.17 + warp * 0.13})`);
    glow.addColorStop(0.23, `rgba(80, 218, 255, ${0.12 + warp * 0.08})`);
    glow.addColorStop(0.55, "rgba(92, 54, 190, 0.08)");
    glow.addColorStop(1, "rgba(4, 8, 20, 0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(0, 0, base * 1.8, 0, TAU);
    context.fill();

    for (let index = 0; index < 4; index += 1) {
      const radius = base * (0.72 + index * 0.23) * pulse;
      const rotation = time * (0.12 + index * 0.035) * (index % 2 === 0 ? 1 : -1);
      const tilt = 0.22 + index * 0.045;
      context.save();
      context.rotate(rotation);
      context.scale(1, tilt);
      context.setLineDash(index === 0 ? [] : [2, 10 + index * 5]);
      context.lineDashOffset = -time * (12 + index * 5);
      context.lineWidth = index === 0 ? 1.1 : 0.8;
      context.strokeStyle =
        index % 2 === 0
          ? `rgba(145, 247, 255, ${0.15 + index * 0.045})`
          : `rgba(168, 137, 255, ${0.1 + index * 0.04})`;
      context.beginPath();
      context.arc(0, 0, radius, 0, TAU);
      context.stroke();
      context.restore();
    }

    for (let index = 0; index < 3; index += 1) {
      const angle = time * (0.55 + index * 0.12) + (index / 3) * TAU;
      const radius = base * (0.72 + index * 0.23);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * (0.22 + index * 0.045);
      const sprite = index === 1 ? glowSprites?.green : glowSprites?.cyan;
      context.fillStyle = index === 1 ? "rgba(184, 255, 122, 0.9)" : "rgba(216, 254, 255, 0.82)";
      drawGlow(x, y, 1.2 + index * 0.3, sprite, 0.88);
    }

    context.globalAlpha = 1;
    context.restore();
  }

  function drawParticles(time, warp) {
    const morph = easeInOutCubic(clamp((time - 1.2) / 0.55));
    if (morph <= 0) return;

    const settle = smoothstep(1.5, 1.75, time);
    const alpha = smoothstep(1.08, 1.3, time);
    context.globalCompositeOperation = "lighter";
    context.lineCap = "round";

    particles.forEach((particle) => {
      const orbit = (1 - morph) * Math.sin(time * 4.5 + particle.phase) * 18;
      const x =
        lerp(particle.startX, particle.x, morph) +
        Math.cos(time * 1.4 + particle.phase) * 2.4 * settle +
        orbit;
      const y =
        lerp(particle.startY, particle.y, morph) +
        Math.sin(time * 1.4 + particle.phase) * 2.4 * settle +
        orbit * 0.42;
      const color = particle.tone === "violet" ? "187, 165, 255" : "184, 252, 255";
      const particleAlpha = alpha * (0.4 + morph * 0.52);

      context.beginPath();
      context.moveTo(particle.previousX, particle.previousY);
      context.lineTo(x, y);
      context.strokeStyle = `rgba(${color}, ${particleAlpha * 0.3})`;
      context.lineWidth = particle.size * (0.6 + warp);
      context.stroke();

      context.fillStyle = `rgba(${color}, ${particleAlpha})`;
      const sprite = particle.tone === "violet" ? glowSprites?.violet : glowSprites?.cyan;
      drawGlow(x, y, particle.size, sprite, particleAlpha);

      particle.previousX = x;
      particle.previousY = y;
    });

    context.globalAlpha = 1;
    context.globalCompositeOperation = "source-over";
  }

  function drawGate(finalElapsed) {
    const progress = easeOutCubic(clamp(finalElapsed / GATE_DURATION));
    const maxRadius = Math.hypot(width, height) * 0.58;
    const radius = lerp(4, maxRadius, progress);
    const centerX = width / 2;
    const centerY = height / 2;
    const gradient = context.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      Math.max(1, radius)
    );
    gradient.addColorStop(0, `rgba(232, 255, 255, ${0.92 - progress * 0.35})`);
    gradient.addColorStop(0.16, `rgba(125, 247, 255, ${0.76 - progress * 0.2})`);
    gradient.addColorStop(0.48, `rgba(113, 76, 255, ${0.24 + progress * 0.12})`);
    gradient.addColorStop(0.82, `rgba(33, 176, 255, ${0.08 + progress * 0.1})`);
    gradient.addColorStop(1, "rgba(2, 4, 10, 0)");

    context.globalCompositeOperation = "lighter";
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, TAU);
    context.fill();

    context.strokeStyle = `rgba(224, 254, 255, ${0.72 * (1 - progress)})`;
    context.lineWidth = 1.4;
    context.beginPath();
    context.arc(centerX, centerY, radius * 0.86, 0, TAU);
    context.stroke();
    context.globalCompositeOperation = "source-over";
  }

  function drawStaticFrame() {
    if (!context || destroyed) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.fillStyle = "#02040a";
    context.fillRect(0, 0, width, height);
    drawPortal(1.2, 0.18);

    const size = Math.min(width, height) * (width < 720 ? 0.24 : 0.2);
    context.fillStyle = "#f1fdff";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font =
      `800 ${size}px "Arial Narrow", "Aptos Display", "PingFang SC", "Microsoft YaHei", sans-serif`;
    context.shadowColor = "rgba(125, 247, 255, 0.55)";
    context.shadowBlur = 28;
    context.fillText("LY", width / 2, height * 0.47);
    context.shadowBlur = 0;
    root?.classList.add("is-locked");
    setStatus("VISUAL / STATIC");
  }

  function render(timestamp) {
    if (!running || destroyed) return;

    const elapsed = now();
    const time = elapsed / 1000;
    const warp = smoothstep(0.35, 1.2, time);
    const lockedNow = time >= LOCK_TIME / 1000;
    const delta = previousFrameAt ? clamp((timestamp - previousFrameAt) / 1000, 0, 0.05) : 1 / 60;
    previousFrameAt = timestamp;

    if (lockedNow && !locked) {
      locked = true;
      root?.classList.add("is-locked");
      setStatus(enterRequested ? "CORE / LOCKED" : "FIELD / CALIBRATING");
    } else if (!locked && !gateStarted) {
      setStatus(warp > 0.45 ? "WARP / ENGAGED" : "PORTAL / ARMED");
    }

    if (enterRequested && !gateStarted && elapsed >= HANDOFF_TIME) {
      gateStarted = true;
      gateStartedAt = now();
      root?.classList.add("is-entering");
      setStatus("GATE / OPEN");
      resolveEnter?.();
      resolveEnter = null;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.fillStyle = "#02040a";
    context.fillRect(0, 0, width, height);
    drawPortal(time, warp);
    drawStarField(time, warp, delta);
    drawParticles(time, warp);

    if (gateStarted) {
      drawGate(now() - gateStartedAt);
    }

    frameId = window.requestAnimationFrame(render);
  }

  function handleVisibility() {
    if (document.hidden) {
      pausedAt = performance.now();
      return;
    }
    if (pausedAt) {
      pauseDuration += performance.now() - pausedAt;
      pausedAt = 0;
      previousFrameAt = 0;
    }
  }

  return {
    start() {
      if (running || destroyed) return;
      running = true;
      startedAt = performance.now();
      glowSprites = reducedMotion
        ? null
        : {
            ...createGlowSprites(),
            green: createGlowSprite("184, 255, 122"),
          };
      resize();
      root?.classList.add("is-active");
      window.addEventListener("resize", resize, { passive: true });
      document.addEventListener("visibilitychange", handleVisibility);

      if (reducedMotion) {
        drawStaticFrame();
      } else {
        frameId = window.requestAnimationFrame(render);
      }
    },

    setProgress(routeProgress) {
      loadingProgress = clamp(Number(routeProgress) || 0);
    },

    enter() {
      if (reducedMotion) {
        root?.classList.add("is-entering");
        setStatus("GATE / OPEN");
        return Promise.resolve();
      }
      if (enterPromise) return enterPromise;
      enterPromise = new Promise((resolve) => {
        resolveEnter = resolve;
      });
      enterRequested = true;
      return enterPromise;
    },

    destroy() {
      if (destroyed) return;
      destroyed = true;
      running = false;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      context.clearRect(0, 0, width, height);
      canvas.width = 0;
      canvas.height = 0;
    },
  };
}
