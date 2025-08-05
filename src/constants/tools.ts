import { Volume2, Scissors, TrendingUp, Search } from "lucide-vue-next";
import type { Component } from "vue";

export interface Tool {
  name: string;
  description: string;
  icon: Component;
  available: boolean;
}

export type ToolId = "remover" | "splitter" | "pitcher" | "key-bpm" | "cutter";

export const TOOLS: Record<ToolId, Tool> = {
  remover: {
    name: "Remover",
    description: "Remove vocals or instruments",
    icon: Volume2,
    available: false,
  },
  splitter: {
    name: "Splitter",
    description: "Split music into separated parts",
    icon: Scissors,
    available: true,
  },
  pitcher: {
    name: "Pitcher",
    description: "Change pitch and tempo",
    icon: TrendingUp,
    available: false,
  },
  "key-bpm": {
    name: "Key & BPM Finder",
    description: "Detect key and BPM",
    icon: Search,
    available: false,
  },
  cutter: {
    name: "Cutter",
    description: "Cut and trim audio",
    icon: Scissors,
    available: false,
  },
};

// Extended descriptions for ComingSoon component
export const TOOL_DESCRIPTIONS: Record<ToolId, string> = {
  remover: "Remove vocals or instruments from your audio tracks",
  splitter: "Split music into separated parts with AI-powered algorithms",
  pitcher: "Change pitch and tempo without affecting quality",
  "key-bpm": "Automatically detect musical key and BPM",
  cutter: "Cut and trim your audio files with precision",
};

export const DEFAULT_TOOL: ToolId = "splitter";
