import { ref, onMounted, onBeforeUnmount, watch, type Ref } from "vue";
import WaveSurfer from "wavesurfer.js";
import type { WaveSurferOptions } from "wavesurfer.js";
import { useStemsAudioStore } from "@/stores/stems-audio.store";
import { storeToRefs } from "pinia";
import { convertFileSrc } from "@tauri-apps/api/core";

function resolveAudioSource(src: string): string {
  console.log("[useWaveform] resolveAudioSource: incoming", src);
  const lower = src.toLowerCase();

  const isAlreadyResolved =
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("file:") ||
    lower.startsWith("asset://") ||
    lower.startsWith("tauri://") ||
    lower.startsWith("data:");

  if (isAlreadyResolved) {
    console.log("[useWaveform] resolveAudioSource: already resolved", src);
    return src;
  }

  if (lower.startsWith("audio://")) {
    let path = src.replace(/^audio:\/\/localhost/i, "");
    if (/^\/[a-z]:/i.test(path)) {
      path = path.slice(1);
    }
    try {
      path = decodeURIComponent(path);
    } catch (error) {
      console.warn(
        "[useWaveform] resolveAudioSource: decodeURIComponent failed, using raw path",
        error
      );
    }
    const resolved = convertFileSrc(path);
    console.log("[useWaveform] resolveAudioSource: converted legacy audio://", {
      original: src,
      normalizedPath: path,
      resolved,
    });
    return resolved;
  }

  const resolved = convertFileSrc(src);
  console.log("[useWaveform] resolveAudioSource: converted file path", {
    original: src,
    resolved,
  });
  return resolved;
}

export interface WaveformOptions {
  audioSrc: string;
  colors?: {
    waveColor?: string;
    progressColor?: string;
    cursorColor?: string;
  };
  height?: number;
  waveSurferOptions?: Partial<WaveSurferOptions>;
  onSeek?: (time: number) => void;
  onLoad?: () => void;
  onError?: (error: unknown) => void;
}

export function useWaveform(
  containerRef: Ref<HTMLElement | null>,
  options: WaveformOptions
) {
  const {
    audioSrc,
    colors = {},
    height = 80,
    waveSurferOptions = {},
    onSeek,
    onLoad,
    onError,
  } = options;

  const wavesurfer = ref<WaveSurfer | null>(null);
  const isLoading = ref(true);
  const hasError = ref(false);

  const stemsAudioStore = useStemsAudioStore();
  const { currentTime } = storeToRefs(stemsAudioStore);

  async function initialize() {
    if (!containerRef.value) return;

    try {
      wavesurfer.value = WaveSurfer.create({
        container: containerRef.value,
        waveColor: colors.waveColor || "#4f46e540",
        progressColor: colors.progressColor || "#4f46e5",
        cursorColor: colors.cursorColor || "#ec4899",
        barWidth: 2,
        barGap: 1,
        height,
        normalize: true,
        fillParent: true,
        interact: true,
        hideScrollbar: true,
        backend: "WebAudio",
        ...waveSurferOptions,
      });

      await wavesurfer.value.load(resolveAudioSource(audioSrc));
      isLoading.value = false;
      hasError.value = false;
      onLoad?.();

      wavesurfer.value.on("click", handleClick);

      wavesurfer.value.on("ready", () => {
        wavesurfer.value?.pause();
      });
    } catch (error) {
      console.error("Failed to load waveform:", error);
      isLoading.value = false;
      hasError.value = true;
      onError?.(error);
    }
  }

  function handleClick(relativeX: number) {
    const duration = stemsAudioStore.duration;
    if (duration > 0) {
      const seekTime = relativeX * duration;

      if (onSeek) {
        onSeek(seekTime);
      } else {
        stemsAudioStore.seek(seekTime);
      }
    }
  }

  watch(currentTime, (newTime) => {
    if (wavesurfer.value && !isLoading.value) {
      const duration = wavesurfer.value.getDuration();
      if (duration > 0) {
        wavesurfer.value.setTime(newTime);
      }
    }
  });

  function seekTo(time: number) {
    if (wavesurfer.value) {
      wavesurfer.value.setTime(time);
    }
  }

  function setColors(newColors: WaveformOptions["colors"]) {
    if (!wavesurfer.value) return;

    if (newColors?.waveColor) {
      wavesurfer.value.setOptions({ waveColor: newColors.waveColor });
    }
    if (newColors?.progressColor) {
      wavesurfer.value.setOptions({ progressColor: newColors.progressColor });
    }
    if (newColors?.cursorColor) {
      wavesurfer.value.setOptions({ cursorColor: newColors.cursorColor });
    }
  }

  function reload() {
    if (wavesurfer.value && audioSrc) {
      isLoading.value = true;
      hasError.value = false;
      wavesurfer.value
        .load(resolveAudioSource(audioSrc))
        .then(() => {
          isLoading.value = false;
          onLoad?.();
        })
        .catch((error) => {
          isLoading.value = false;
          hasError.value = true;
          onError?.(error);
        });
    }
  }

  onMounted(() => {
    initialize();
  });

  onBeforeUnmount(() => {
    if (wavesurfer.value) {
      wavesurfer.value.destroy();
      wavesurfer.value = null;
    }
  });

  return {
    wavesurfer,
    isLoading,
    hasError,
    seekTo,
    setColors,
    reload,
  };
}
