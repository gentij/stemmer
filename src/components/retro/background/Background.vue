<template>
  <svg
    viewBox="0 0 1600 900"
    preserveAspectRatio="xMidYMid slice"
    aria-label="Synthwave sunset with neon grid"
    :style="styleVars"
  >
    <defs>
      <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--sky-top, #0b0b1e)" />
        <stop offset="55%" stop-color="var(--sky-mid, #28124b)" />
        <stop offset="100%" stop-color="var(--sky-bottom, #0a1b3e)" />
      </linearGradient>

      <radialGradient id="gSun" cx="50%" cy="55%" r="55%">
        <stop offset="0%" stop-color="var(--sun-core, #ffbf5e)" />
        <stop offset="65%" stop-color="var(--sun-core, #ffbf5e)" />
        <stop offset="100%" stop-color="var(--sun-edge, #ff347f)" />
      </radialGradient>

      <mask id="mScan">
        <rect width="100%" height="100%" fill="#fff" />
        <g fill="#000" opacity="0.8">
          <rect x="500" y="365" width="600" height="10" />
          <rect x="480" y="395" width="640" height="10" />
          <rect x="465" y="425" width="670" height="10" />
          <rect x="455" y="455" width="690" height="10" />
          <rect x="445" y="485" width="710" height="10" />
          <rect x="440" y="515" width="720" height="10" />
          <rect x="440" y="545" width="720" height="10" />
          <rect x="445" y="575" width="710" height="10" />
          <rect x="455" y="605" width="690" height="10" />
          <rect x="465" y="635" width="670" height="10" />
        </g>
      </mask>

      <linearGradient id="gHorizon" x1="0" y1="0" x2="0" y2="1">
        <stop
          offset="0%"
          stop-color="var(--horizon-top, rgba(255,255,255,0.9))"
        />
        <stop
          offset="100%"
          stop-color="var(--horizon-bottom, rgba(255,255,255,0))"
        />
      </linearGradient>

      <pattern id="pGrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path
          d="M 40 0 L 0 0 0 40"
          fill="none"
          stroke="var(--grid-line, #5bd0ff)"
          stroke-width="1"
        />
      </pattern>

      <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="18" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="b1" />
        <feMerge>
          <feMergeNode in="b1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <clipPath id="clipGround">
        <path d="M 0 520 L 800 480 L 1600 520 L 1600 900 L 0 900 Z" />
      </clipPath>
    </defs>

    <rect width="100%" height="100%" fill="url(#gSky)" />

    <circle
      cx="800"
      cy="540"
      r="240"
      fill="url(#gSun)"
      filter="url(#softGlow)"
      opacity="0.45"
    />
    <g mask="url(#mScan)">
      <circle cx="800" cy="540" r="220" fill="url(#gSun)" />
    </g>

    <g>
      <path
        d="M 0 540 C 180 520, 260 500, 360 520 S 560 560, 640 540 S 760 500, 820 520 L 820 900 L 0 900 Z"
        :fill="cssVar('--mtn-fill', '#1b0f33')"
      />
      <path
        d="M 1600 540 C 1420 520, 1340 500, 1240 520 S 1040 560, 960 540 S 840 500, 780 520 L 780 900 L 1600 900 Z"
        :fill="cssVar('--mtn-fill', '#1b0f33')"
      />
      <path
        d="M 0 540 C 180 520, 260 500, 360 520 S 560 560, 640 540 S 760 500, 820 520"
        fill="none"
        stroke="var(--mtn-rim, #ff4db3)"
        stroke-width="3"
        filter="url(#neonGlow)"
        opacity="0.8"
      />
      <path
        d="M 1600 540 C 1420 520, 1340 500, 1240 520 S 1040 560, 960 540 S 840 500, 780 520"
        fill="none"
        stroke="var(--mtn-rim, #ff4db3)"
        stroke-width="3"
        filter="url(#neonGlow)"
        opacity="0.8"
      />
    </g>

    <rect
      x="0"
      y="520"
      width="1600"
      height="20"
      fill="url(#gHorizon)"
      opacity="0.7"
    />

    <g clip-path="url(#clipGround)">
      <rect
        x="-200"
        y="480"
        width="2000"
        height="500"
        fill="url(#pGrid)"
        opacity="0.5"
        transform="matrix(1 0 -0.55 0.28 300 400)"
      />
      <line
        x1="0"
        y1="520"
        x2="1600"
        y2="520"
        stroke="var(--grid-glow, #77e0ff)"
        stroke-width="2.5"
        filter="url(#neonGlow)"
      />
      <g
        stroke="var(--grid-glow, #77e0ff)"
        stroke-width="1.5"
        opacity="0.55"
        filter="url(#neonGlow)"
      >
        <line x1="0" y1="900" x2="800" y2="520" />
        <line x1="130" y1="900" x2="800" y2="520" />
        <line x1="260" y1="900" x2="800" y2="520" />
        <line x1="390" y1="900" x2="800" y2="520" />
        <line x1="520" y1="900" x2="800" y2="520" />
        <line x1="650" y1="900" x2="800" y2="520" />
        <line x1="950" y1="900" x2="800" y2="520" />
        <line x1="1080" y1="900" x2="800" y2="520" />
        <line x1="1210" y1="900" x2="800" y2="520" />
        <line x1="1340" y1="900" x2="800" y2="520" />
        <line x1="1470" y1="900" x2="800" y2="520" />
        <line x1="1600" y1="900" x2="800" y2="520" />
      </g>
    </g>

    <defs>
      <radialGradient id="gVig" cx="50%" cy="55%" r="75%">
        <stop offset="70%" stop-color="rgba(0,0,0,0)" />
        <stop offset="100%" stop-color="rgba(0,0,0,0.45)" />
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#gVig)" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CassetteTheme } from "@/types/retro/cassete.interface";

interface Props {
  theme: CassetteTheme;
}
const props = defineProps<Props>();

function clamp(n: number, min = 0, max = 255) {
  return Math.min(max, Math.max(min, n));
}
function hex(n: number) {
  return n.toString(16).padStart(2, "0");
}
function hexToRgb(c: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
  if (!m) return { r: 11, g: 11, b: 30 }; // fallback
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}
function shade(c: string, amount = -30) {
  const { r, g, b } = hexToRgb(c);
  return `#${hex(clamp(r + amount))}${hex(clamp(g + amount))}${hex(
    clamp(b + amount)
  )}`;
}
function mix(a: string, b: string, p = 0.5) {
  const A = hexToRgb(a),
    B = hexToRgb(b);
  const r = Math.round(A.r * (1 - p) + B.r * p);
  const g = Math.round(A.g * (1 - p) + B.g * p);
  const b2 = Math.round(A.b * (1 - p) + B.b * p);
  return `#${hex(r)}${hex(g)}${hex(b2)}`;
}

const styleVars = computed<Record<string, string>>(() => {
  const accent = props.theme.tapeAccent;
  const base = props.theme.tapeColor;
  const border = props.theme.borderColor;

  const skyTop = shade(mix(base, "#0b0b1e", 0.7), -10);
  const skyMid = shade(mix(base, border, 0.5), -20);
  const skyBottom = shade(mix(base, "#0a1b3e", 0.6), -25);

  const mtnFill = shade(skyMid, -25);

  return {
    "--sun-core": accent,
    "--sun-edge": base,

    "--sky-top": skyTop,
    "--sky-mid": skyMid,
    "--sky-bottom": skyBottom,

    "--grid-line": border,
    "--grid-glow": border,

    "--mtn-fill": mtnFill,
    "--mtn-rim": border,

    "--horizon-top": "rgba(255,255,255,0.85)",
    "--horizon-bottom": "rgba(255,255,255,0)",
  };
});

function cssVar(name: string, fallback: string) {
  return `var(${name}, ${fallback})`;
}
</script>

<style scoped>
svg {
  width: 100%;
  height: 100%;
  display: block;
  filter: blur(1.5px);
  transition: ease-in 0.3s;
  position: fixed;
}
</style>
