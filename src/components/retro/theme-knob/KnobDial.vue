<template>
  <div
    ref="root"
    class="relative rounded-full flex items-center justify-center cursor-grab select-none outline-none"
    :class="sizeClasses"
    :style="{ transform: `rotate(${localAngle}deg)` }"
    @pointerdown="onPointerDown"
    @keydown="onKeyDown"
    tabindex="0"
    role="slider"
    :aria-valuenow="ariaValueNow"
    :aria-valuetext="ariaValueText"
  >
    <div
      class="absolute inset-0 rounded-full shadow-inner flex items-center justify-center"
      :style="outerStyle"
    >
      <div
        class="w-3/4 h-3/4 rounded-full flex items-center justify-center"
        :style="innerStyle"
      >
        <div
          class="w-1 h-6 bg-white rounded-sm translate-y-[-40%]"
          :style="markerStyle"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";

const props = withDefaults(
  defineProps<{
    angle: number;
    primary: string;
    secondary: string;
    marker: string;
    size?: "md" | "lg";
    ariaValueNow?: number;
    ariaValueText?: string;
  }>(),
  { size: "lg" }
);

const emit = defineEmits<{
  (e: "update:angle", angle: number): void;
  (e: "commit", angle: number): void;
  (e: "step", delta: number): void;
}>();

const root = ref<HTMLElement | null>(null);
const localAngle = ref(props.angle);

watch(
  () => props.angle,
  (v) => {
    localAngle.value = v;
  }
);

const sizeClasses = computed(() =>
  props.size === "md" ? "w-36 h-36" : "w-44 h-44"
);

const outerStyle = computed(() => ({
  background: `linear-gradient(180deg, ${props.primary} 0%, ${props.secondary} 100%)`,
  border: `6px solid ${props.primary}`,
}));
const innerStyle = computed(() => ({
  background:
    "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), rgba(0,0,0,0.22))",
}));
const markerStyle = computed(() => ({ backgroundColor: props.marker }));

let center = { x: 0, y: 0 };
const isDragging = ref(false);

function updateCenter() {
  if (!root.value) return;
  const rect = root.value.getBoundingClientRect();
  center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function eventAngle(e: PointerEvent | MouseEvent | TouchEvent | any) {
  const pt =
    "touches" in e && e.touches?.[0]
      ? e.touches[0]
      : "changedTouches" in e && e.changedTouches?.[0]
      ? e.changedTouches[0]
      : e;
  const dx = pt.clientX - center.x;
  const dy = pt.clientY - center.y;
  const rad = Math.atan2(dy, dx);
  const deg = (rad * 180) / Math.PI + 90;
  return (deg + 360) % 360;
}

function onPointerDown(e: PointerEvent | MouseEvent | TouchEvent | any) {
  e?.preventDefault?.();
  updateCenter();
  try {
    (e.currentTarget as any)?.setPointerCapture?.((e as any).pointerId);
  } catch {}
  isDragging.value = true;
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);
  window.addEventListener("touchmove", onPointerMove, { passive: false });
  window.addEventListener("touchend", onPointerUp);
}

function onPointerMove(e: any) {
  if (!isDragging.value) return;
  const a = eventAngle(e);
  if (!Number.isNaN(a)) {
    localAngle.value = a;
    emit("update:angle", a);
  }
}

function onPointerUp() {
  isDragging.value = false;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("mousemove", onPointerMove);
  window.removeEventListener("mouseup", onPointerUp);
  window.removeEventListener("touchmove", onPointerMove);
  window.removeEventListener("touchend", onPointerUp);
  emit("commit", localAngle.value);
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    emit("step", 1);
  } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    emit("step", -1);
  }
}

onMounted(() => nextTick(updateCenter));
</script>

<style scoped>
div {
  display: block;
}
</style>
