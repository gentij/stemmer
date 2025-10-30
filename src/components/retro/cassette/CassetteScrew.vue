<template>
  <div class="w-4 h-4">
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="8"
        cy="8"
        r="7.5"
        :fill="theme.screwBg"
        :stroke="theme.screwStroke"
      />
      <circle
        cx="8"
        cy="8"
        r="6"
        :fill="`url(#screw-gradient-${gradientId})`"
      />
      <path
        d="M8 4.25C8.199 4.25 8.3897 4.329 8.5304 4.4697C8.671 4.6103 8.75 4.801 8.75 5V7.25H11C11.199 7.25 11.3897 7.329 11.5304 7.4697C11.671 7.6103 11.75 7.801 11.75 8C11.75 8.199 11.671 8.3897 11.5304 8.5303C11.3897 8.671 11.199 8.75 11 8.75L9.005 8.7152L8.75 8.7103V11C8.75 11.199 8.671 11.3897 8.5304 11.5303C8.3897 11.671 8.199 11.75 8 11.75C7.801 11.75 7.6103 11.671 7.4697 11.5303C7.3299 11.3906 7.251 11.2015 7.25 11.004L7.2851 8.969L7.29 8.7103L7.0312 8.7152L5 8.75C4.801 8.7497 4.6107 8.671 4.4697 8.5303C4.329 8.3897 4.25 8.199 4.25 8L4.2646 7.8529C4.2935 7.709 4.3643 7.5755 4.4697 7.4697C4.6103 7.329 4.801 7.25 5 7.25H7.29L7.2851 6.9955L7.25 5C7.25 4.801 7.329 4.6103 7.4697 4.4697C7.5751 4.3643 7.7085 4.2935 7.8525 4.2646L8 4.25Z"
        :fill="theme.screwBg"
        :stroke="theme.screwStroke"
        stroke-width="0.5"
      />
      <defs>
        <linearGradient
          :id="`screw-gradient-${gradientId}`"
          x1="8"
          y1="2"
          x2="8"
          y2="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop :stop-color="theme.screwGradientStart" />
          <stop offset="1" :stop-color="theme.screwGradientEnd" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";

defineProps<{ theme: CassetteTheme; gradientId: string }>();
</script>
