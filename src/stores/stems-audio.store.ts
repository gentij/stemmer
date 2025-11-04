import { defineStore } from "pinia";
import { useSplitterToolStore } from "./splitter-tool.store";
import { join, basename } from "@tauri-apps/api/path";

interface StemAudio {
  id: string;
  name: string;
  audio: HTMLAudioElement | null;
  volume: number;
  muted: boolean;
}

export const useStemsAudioStore = defineStore("stemsAudio", {
  state: () => ({
    stems: {
      vocals: { id: "vocals", name: "Vocals", audio: null, volume: 0.8, muted: false } as StemAudio,
      drums: { id: "drums", name: "Drums", audio: null, volume: 0.7, muted: false } as StemAudio,
      bass: { id: "bass", name: "Bass", audio: null, volume: 0.75, muted: false } as StemAudio,
      other: { id: "other", name: "Other", audio: null, volume: 0.65, muted: false } as StemAudio,
    },
    isPlaying: false,
    isLoading: false,
    duration: 0,
    currentTime: 0,
  }),

  getters: {
    allStemsLoaded: (state) => {
      return Object.values(state.stems).every((stem) => stem.audio !== null);
    },
  },

  actions: {
    async loadStems() {
      const splitterStore = useSplitterToolStore();
      const outputPath = splitterStore.outputPath;

      if (!outputPath) return;

      this.isLoading = true;

      try {
        const songName = await basename(outputPath);

        for (const stemId of Object.keys(this.stems) as Array<keyof typeof this.stems>) {
          const stemFileName = `${songName}_${stemId}.wav`;
          const stemPath = await join(outputPath, stemFileName);

          try {
            const audioUrl = `audio://localhost${stemPath}`;
            
            const audio = new Audio();
            audio.src = audioUrl;
            audio.volume = this.stems[stemId].volume;
            audio.muted = this.stems[stemId].muted;

            audio.addEventListener("loadedmetadata", () => {
              if (this.duration === 0 || audio.duration > this.duration) {
                this.duration = audio.duration;
              }
            });

            audio.addEventListener("timeupdate", () => {
              this.currentTime = audio.currentTime;
            });

            audio.addEventListener("ended", () => {
              this.isPlaying = false;
            });

            this.stems[stemId].audio = audio;
          } catch (error) {
            console.error(`Failed to load stem ${stemId}:`, error);
          }
        }

        this.isLoading = false;
      } catch (error) {
        console.error("Failed to load stems:", error);
        this.isLoading = false;
      }
    },

    play() {
      if (!this.allStemsLoaded) return;

      Object.values(this.stems).forEach((stem) => {
        stem.audio?.play();
      });
      this.isPlaying = true;
    },

    pause() {
      if (!this.allStemsLoaded) return;

      Object.values(this.stems).forEach((stem) => {
        stem.audio?.pause();
      });
      this.isPlaying = false;
    },

    togglePlayPause() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },

    seek(time: number) {
      if (!this.allStemsLoaded) return;

      const clampedTime = Math.max(0, Math.min(time, this.duration));
      Object.values(this.stems).forEach((stem) => {
        if (stem.audio) {
          stem.audio.currentTime = clampedTime;
        }
      });
      this.currentTime = clampedTime;
    },

    skipForward(seconds = 10) {
      this.seek(this.currentTime + seconds);
    },

    skipBackward(seconds = 10) {
      this.seek(this.currentTime - seconds);
    },

    setStemVolume(stemId: string, volume: number) {
      const stem = this.stems[stemId as keyof typeof this.stems];
      if (stem && stem.audio) {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        stem.volume = clampedVolume;
        stem.audio.volume = clampedVolume;
      }
    },

    setStemMuted(stemId: string, muted: boolean) {
      const stem = this.stems[stemId as keyof typeof this.stems];
      if (stem && stem.audio) {
        stem.muted = muted;
        stem.audio.muted = muted;
      }
    },

    reset() {
      Object.values(this.stems).forEach((stem) => {
        if (stem.audio) {
          stem.audio.pause();
          stem.audio.src = "";
          stem.audio = null;
        }
      });

      this.isPlaying = false;
      this.isLoading = false;
      this.duration = 0;
      this.currentTime = 0;
    },
  },
});

