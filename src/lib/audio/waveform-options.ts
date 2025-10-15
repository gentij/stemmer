import type { WaveSurferOptions } from "wavesurfer.js";
export const DEFAULT_WAVEFORM_OPTS: Partial<WaveSurferOptions> = {
  waveColor: "#4f46e5",
  progressColor: "#8b5cf6",
  cursorColor: "#ec4899",
  barWidth: 2,
  barGap: 1,
  height: 100,
  normalize: true,
  fillParent: true,
};
