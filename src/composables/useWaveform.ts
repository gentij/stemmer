import { ref, watch, onMounted, onBeforeUnmount, type Ref } from "vue";
import WaveSurfer from "wavesurfer.js";
import type { WaveSurferOptions } from "wavesurfer.js";
import { useStemsAudioStore } from "@/stores/stems-audio.store";
import { storeToRefs } from "pinia";

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

export function useWaveform(containerRef: Ref<HTMLElement | null>, options: WaveformOptions) {
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
  const { currentTime, isPlaying } = storeToRefs(stemsAudioStore);
  
  let animationFrameId: number | null = null;
  let lastSyncedTime = -1;

  async function initialize() {
    if (!containerRef.value) return;

    try {
      const mediaElement = document.createElement('audio');
      mediaElement.preload = 'metadata';
      
      wavesurfer.value = WaveSurfer.create({
        container: containerRef.value,
        waveColor: colors.waveColor || "#4f46e540",
        progressColor: colors.progressColor || "#4f46e5",
        cursorColor: colors.cursorColor || "#ec4899",
        barWidth: 3,
        barGap: 2,
        barRadius: 2,
        height,
        normalize: true,
        fillParent: true,
        interact: true,
        hideScrollbar: true,
        media: mediaElement,
        minPxPerSec: 1,
        autoScroll: false,
        autoCenter: false,
        ...waveSurferOptions,
      });

      await wavesurfer.value.load(audioSrc);
      isLoading.value = false;
      hasError.value = false;
      onLoad?.();

      wavesurfer.value.on('click', handleClick);

      wavesurfer.value.on('ready', () => {
        wavesurfer.value?.pause();
      });
    } catch (error) {
      console.error('Failed to load waveform:', error);
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

  function startProgressAnimation() {
    if (animationFrameId !== null) return;
    
    function updateProgress() {
      if (!stemsAudioStore.isPlaying) {
        animationFrameId = null;
        return;
      }
      
      if (wavesurfer.value && !isLoading.value) {
        const duration = wavesurfer.value.getDuration();
        if (duration > 0) {
          const time = stemsAudioStore.currentTime;
          if (Math.abs(time - lastSyncedTime) > 0.03) {
            wavesurfer.value.setTime(time);
            lastSyncedTime = time;
          }
        }
      }
      animationFrameId = requestAnimationFrame(updateProgress);
    }
    
    animationFrameId = requestAnimationFrame(updateProgress);
  }

  function stopProgressAnimation() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  watch(
    [currentTime, isPlaying],
    ([newTime, playing], [, wasPlaying]) => {
      if (playing && !wasPlaying) {
        startProgressAnimation();
      } else if (!playing && wavesurfer.value && !isLoading.value) {
        if (Math.abs(newTime - lastSyncedTime) > 0.05) {
          const duration = wavesurfer.value.getDuration();
          if (duration > 0) {
            wavesurfer.value.setTime(newTime);
            lastSyncedTime = newTime;
          }
        }
      }
    }
  );

  function seekTo(time: number) {
    if (wavesurfer.value) {
      wavesurfer.value.setTime(time);
    }
  }

  function setColors(newColors: WaveformOptions['colors']) {
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
      wavesurfer.value.load(audioSrc)
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

  watch(() => audioSrc, (newSrc, oldSrc) => {
    if (newSrc && newSrc !== oldSrc && wavesurfer.value) {
      reload();
    }
  }, { immediate: false });

  onMounted(() => {
    initialize();
  });

  onBeforeUnmount(() => {
    stopProgressAnimation();
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

