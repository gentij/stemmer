import { ref, onBeforeUnmount } from "vue";

export interface VolumeControlOptions {
  initialVolume: number;
  onVolumeChange?: (volume: number) => void;
  onVolumeFinal?: (volume: number) => void;
}

export function useVolumeControl(options: VolumeControlOptions) {
  const { initialVolume, onVolumeChange, onVolumeFinal } = options;

  const displayVolume = ref(initialVolume);
  const isDragging = ref(false);
  let rafId: number | null = null;
  let lastEmittedVolume = initialVolume;

  function handleVolumeInput(value: number) {
    displayVolume.value = value;

    if (isDragging.value && Math.abs(value - lastEmittedVolume) >= 1) {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        onVolumeChange?.(value);
        lastEmittedVolume = value;
        rafId = null;
      });
    }
  }

  function startDrag() {
    isDragging.value = true;
  }

  function endDrag(finalValue: number) {
    isDragging.value = false;

    onVolumeFinal?.(finalValue);
    lastEmittedVolume = finalValue;

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function syncVolume(newVolume: number) {
    if (!isDragging.value) {
      displayVolume.value = newVolume;
      lastEmittedVolume = newVolume;
    }
  }

  onBeforeUnmount(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  });

  return {
    displayVolume,
    isDragging,
    handleVolumeInput,
    startDrag,
    endDrag,
    syncVolume,
  };
}

