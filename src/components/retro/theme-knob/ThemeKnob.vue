<template>
  <div class="flex flex-col items-center">
    <div
      ref="knob"
      class="relative w-36 h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center cursor-grab select-none outline-none"
      :style="{ transform: `rotate(${angle}deg)` }"
      @pointerdown="onPointerDown"
      @keydown="onKeyDown"
      tabindex="0"
      role="slider"
      :aria-valuenow="currentIndex"
      :aria-valuetext="currentThemeName"
    >
      <div
        class="absolute inset-0 rounded-full shadow-inner flex items-center justify-center"
        :style="knobStyle"
      >
        <div
          class="w-3/4 h-3/4 rounded-full flex items-center justify-center"
          :style="innerStyle"
        >
          <div
            class="w-1 h-6 bg-white rounded-sm transform translate-y-[-40%]"
            :style="markerStyle"
          ></div>
        </div>
      </div>
    </div>
    <div class="mt-3 text-white font-medium text-sm">{{ currentThemeName }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from "vue";
import type { CassetteTheme } from "@/types/retro/cassete.interface";

const props = withDefaults(
  defineProps<{ themes: CassetteTheme[]; currentThemeId?: string }>(),
  {
    themes: () => [],
    currentThemeId: "",
  }
);

const emit = defineEmits<{
  (e: "change", themeId: string): void;
}>();

const knob = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const angle = ref(0);
const currentIndex = ref(0);
let center = { x: 0, y: 0 };

const themeCount = computed(() => props.themes.length || 1);
const segment = computed(() => 360 / themeCount.value);

const hoverIndex = computed(() => {
  if (!themeCount.value) return 0;
  return (
    Math.round((((angle.value % 360) + 360) % 360) / segment.value) %
    themeCount.value
  );
});

const displayIndex = computed(() =>
  isDragging.value ? hoverIndex.value : currentIndex.value
);

const currentThemeName = computed(() => {
  const t = props.themes[displayIndex.value];
  return t ? t.name : "";
});

watch(
  () => props.currentThemeId,
  (val) => {
    const idx = props.themes.findIndex((t) => t.id === val);
    if (idx >= 0) {
      currentIndex.value = idx;
      angle.value = idx * segment.value;
    }
  },
  { immediate: true }
);

onMounted(() => {
  nextTick(() => {
    if (knob.value) {
      const rect = knob.value.getBoundingClientRect();
      center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      angle.value = currentIndex.value * (360 / themeCount.value);
    }
  });
});

function getAngleFromEvent(e: any) {
  let clientX = 0;
  let clientY = 0;
  if (e && typeof e.clientX === "number" && typeof e.clientY === "number") {
    clientX = e.clientX;
    clientY = e.clientY;
  } else if (e && e.touches && e.touches[0]) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if (e && e.changedTouches && e.changedTouches[0]) {
    clientX = e.changedTouches[0].clientX;
    clientY = e.changedTouches[0].clientY;
  }
  const dx = clientX - center.x;
  const dy = clientY - center.y;
  const rad = Math.atan2(dy, dx);
  const deg = (rad * 180) / Math.PI + 90;
  return (deg + 360) % 360;
}

function onPointerDown(e: any) {
  if (e && typeof e.preventDefault === "function") e.preventDefault();
  
  if (knob.value) {
    const rect = knob.value.getBoundingClientRect();
    center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  try {
    const targetEl = (e && e.currentTarget) || knob.value;
    if (
      targetEl &&
      typeof targetEl.setPointerCapture === "function" &&
      e &&
      typeof e.pointerId !== "undefined"
    ) {
      targetEl.setPointerCapture(e.pointerId);
    }
  } catch (err) {
    // ignore
  }

  isDragging.value = true;
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);
  window.addEventListener("touchmove", onPointerMove);
  window.addEventListener("touchend", onPointerUp);
}

function onPointerMove(e: any) {
  if (!isDragging.value) return;
  const a = getAngleFromEvent(e);
  if (typeof a === "number" && !Number.isNaN(a)) angle.value = a;
}

function onPointerUp() {
  isDragging.value = false;
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("mousemove", onPointerMove);
  window.removeEventListener("mouseup", onPointerUp);
  window.removeEventListener("touchmove", onPointerMove);
  window.removeEventListener("touchend", onPointerUp);

  const idx = Math.round(angle.value / segment.value) % themeCount.value;
  currentIndex.value = idx;
  angle.value = idx * segment.value;
  emit("change", props.themes[idx].id);
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    currentIndex.value = (currentIndex.value + 1) % themeCount.value;
    angle.value = currentIndex.value * (360 / themeCount.value);
    emit("change", props.themes[currentIndex.value].id);
  } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    currentIndex.value =
      (currentIndex.value - 1 + themeCount.value) % themeCount.value;
    angle.value = currentIndex.value * (360 / themeCount.value);
    emit("change", props.themes[currentIndex.value].id);
  }
}

const knobStyle = computed(() => {
  const t = props.themes[displayIndex.value];
  return {
    background: `linear-gradient(180deg, ${t ? t.borderColor : "#d97fff"} 0%, ${t ? t.housingColor : "#301560"} 100%)`,
    border: `6px solid ${t ? t.borderColor : "#D97FFF"}`,
  };
});

const innerStyle = computed(() => {
  return {
    background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), rgba(0,0,0,0.22))`,
    borderRadius: "9999px",
  };
});

const markerStyle = computed(() => {
  const t = props.themes[displayIndex.value];
  return {
    backgroundColor: t ? t.tapeColor : "#fff",
  };
});
</script>
