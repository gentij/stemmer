<script setup lang="ts">
import { Cpu, Gauge, Zap } from "lucide-vue-next";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import type { AccelerationMode, PreferredProvider } from "@/stores/settings.store";

interface ProviderOption {
  value: PreferredProvider;
  label: string;
  hint: string;
}

interface Props {
  theme: CassetteTheme;
  accelerationMode: AccelerationMode;
  preferredProvider: PreferredProvider;
  providerOptions: ProviderOption[];
}

defineProps<Props>();

defineEmits<{
  (e: "accelerationModeChange", value: AccelerationMode): void;
  (e: "preferredProviderChange", value: PreferredProvider): void;
}>();

const modeCards: Array<{
  value: AccelerationMode;
  title: string;
  description: string;
  icon: typeof Gauge;
}> = [
  {
    value: "auto",
    title: "AUTO",
    description: "Recommended. Stemmer picks the best available acceleration path.",
    icon: Gauge,
  },
  {
    value: "cpu",
    title: "CPU ONLY",
    description: "Most stable option. Disables GPU/provider acceleration.",
    icon: Cpu,
  },
  {
    value: "provider",
    title: "PREFERRED PROVIDER",
    description: "Force one acceleration backend for comparison or debugging.",
    icon: Zap,
  },
];
</script>

<template>
  <div
    class="rounded-xl border-2 p-6"
    :style="{
      borderColor: theme.windowStroke,
      backgroundColor: theme.windowBg,
    }"
  >
    <div
      class="text-sm font-mono uppercase tracking-wider mb-6"
      :style="{ color: theme.tapeAccent }"
    >
      ACCELERATION
    </div>

    <div class="space-y-4">
      <button
        v-for="mode in modeCards"
        :key="mode.value"
        @click="$emit('accelerationModeChange', mode.value)"
        class="w-full rounded-xl border p-4 text-left transition-all hover:scale-[1.01] focus:outline-none"
        :style="{
          borderColor: accelerationMode === mode.value ? theme.borderColor : theme.controlBorder,
          backgroundColor: accelerationMode === mode.value ? `${theme.borderColor}18` : theme.controlBg,
        }"
      >
        <div class="flex items-start gap-3">
          <component
            :is="mode.icon"
            class="h-5 w-5 mt-0.5 flex-shrink-0"
            :style="{ color: accelerationMode === mode.value ? theme.tapeAccent : theme.borderColor }"
          />
          <div class="flex-1 min-w-0">
            <div class="font-mono text-sm font-medium mb-1" :style="{ color: theme.tapeAccent }">
              {{ mode.title }}
            </div>
            <div class="text-xs font-mono opacity-70" :style="{ color: theme.borderColor }">
              {{ mode.description }}
            </div>
          </div>
        </div>
      </button>

      <div
        v-if="accelerationMode === 'provider'"
        class="rounded-xl border p-4 space-y-3"
        :style="{
          borderColor: theme.controlBorder,
          backgroundColor: theme.controlBg,
        }"
      >
        <div class="font-mono text-xs uppercase tracking-wider" :style="{ color: theme.tapeAccent }">
          Preferred Provider
        </div>
        <select
          :value="preferredProvider"
          @change="$emit('preferredProviderChange', ($event.target as HTMLSelectElement).value as PreferredProvider)"
          class="w-full rounded-lg border px-3 py-3 font-mono text-xs bg-transparent focus:outline-none"
          :style="{
            borderColor: theme.borderColor,
            color: theme.tapeAccent,
          }"
        >
          <option
            v-for="provider in providerOptions"
            :key="provider.value"
            :value="provider.value"
          >
            {{ provider.label }}
          </option>
        </select>
        <p class="text-xs font-mono opacity-70" :style="{ color: theme.borderColor }">
          {{ providerOptions.find((provider) => provider.value === preferredProvider)?.hint }}
        </p>
      </div>

      <div
        class="rounded-lg border p-4"
        :style="{
          borderColor: theme.infoBorder,
          backgroundColor: theme.infoBg,
        }"
      >
        <div class="font-mono text-xs font-medium mb-2" :style="{ color: theme.tapeAccent }">
          RESTART REQUIRED
        </div>
        <p class="text-xs font-mono opacity-70" :style="{ color: theme.borderColor }">
          Acceleration changes are saved immediately, but you need to restart Stemmer before the next split for them to take effect.
        </p>
      </div>
    </div>
  </div>
</template>
