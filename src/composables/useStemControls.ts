import { computed } from "vue";
import { useStemsAudioStore } from "@/stores/stems-audio.store";

export interface StemControlsOptions {
  stemId: string;
}

export function useStemControls(options: StemControlsOptions) {
  const { stemId } = options;
  const stemsAudioStore = useStemsAudioStore();

  const stemData = computed(() => 
    stemsAudioStore.stems[stemId as keyof typeof stemsAudioStore.stems]
  );

  const audioSrc = computed(() => stemData.value?.audio?.src || null);

  function setVolumeDirectly(volume: number) {
    if (stemData.value?.audio) {
      stemData.value.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  function setVolume(volume: number) {
    stemsAudioStore.setStemVolume(stemId, volume);
  }

  function toggleMute() {
    if (stemData.value) {
      stemsAudioStore.setStemMuted(stemId, !stemData.value.muted);
    }
  }

  function setMuted(muted: boolean) {
    stemsAudioStore.setStemMuted(stemId, muted);
  }

  return {
    stemData,
    audioSrc,
    setVolumeDirectly,
    setVolume,
    toggleMute,
    setMuted,
  };
}

