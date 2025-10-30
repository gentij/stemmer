<template>
  <div class="flex flex-col items-center">
    <KnobDial
      :angle="angle"
      :primary="activeTheme.borderColor"
      :secondary="activeTheme.housingColor"
      :marker="activeTheme.tapeColor"
      :aria-value-now="currentIndex"
      :aria-value-text="activeTheme.name"
      @update:angle="onAngle"
      @commit="onCommit"
      @step="onStep"
    />
    <div class="mt-3 text-white font-medium text-sm">
      {{ activeTheme.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import KnobDial from "./KnobDial.vue";
import type { CassetteTheme } from "@/types/retro/cassete.interface";

const props = withDefaults(
  defineProps<{ themes: CassetteTheme[]; currentThemeId?: string }>(),
  {
    themes: () => [],
    currentThemeId: "",
  }
);

const emit = defineEmits<{ (e: "change", themeId: string): void }>();

const currentIndex = ref(0);
const angle = ref(0);

const count = computed(() => (props.themes.length ? props.themes.length : 1));
const segment = computed(() => 360 / count.value);

const isDragging = ref(false);
const hoverIndex = computed(
  () =>
    Math.round((((angle.value % 360) + 360) % 360) / segment.value) %
    count.value
);

const activeTheme = computed(() => {
  const idx = isDragging.value ? hoverIndex.value : currentIndex.value;
  return props.themes[idx] ?? props.themes[0] ?? ({} as CassetteTheme);
});

watch(
  () => props.currentThemeId,
  (v) => {
    const idx = props.themes.findIndex((t) => t.id === v);
    if (idx >= 0) {
      currentIndex.value = idx;
      angle.value = idx * segment.value;
    }
  },
  { immediate: true }
);

function onAngle(a: number) {
  angle.value = a;
  isDragging.value = true;
}
function onCommit(a: number) {
  const idx = Math.round(a / segment.value) % count.value;
  currentIndex.value = idx;
  angle.value = idx * segment.value;
  isDragging.value = false;
  const id = props.themes[idx]?.id;
  if (id) emit("change", id);
}
function onStep(delta: number) {
  currentIndex.value = (currentIndex.value + delta + count.value) % count.value;
  angle.value = currentIndex.value * segment.value;
  const id = props.themes[currentIndex.value]?.id;
  if (id) emit("change", id);
}
</script>
