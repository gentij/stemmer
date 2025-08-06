import { formatTime } from "@/lib/utils";
import { splitStems, SplitStemsParams } from "@/services/splitStems";
import { defineStore } from "pinia";
import type WaveSurfer from "wavesurfer.js";

export const useStemStore = defineStore("stem", {
  state: () => ({
    audioPath: null as string | null,
    audioFile: null as File | null,
    wavesurfer: null as WaveSurfer | null,
    isPlaying: false,
    isLoading: false,
    duration: 0,
    currentTime: 0,
    volume: 0.7,
    isReady: false,
  }),

  getters: {
    progress: (state) => {
      if (state.duration === 0) return 0;
      return (state.currentTime / state.duration) * 100;
    },
    formattedCurrentTime: (state) => {
      return formatTime(state.currentTime);
    },
    formattedDuration: (state) => {
      return formatTime(state.duration);
    },
  },

  actions: {
    loadFile(file: File, path?: string) {
      this.audioFile = file;
      this.audioPath = path || null;
      this.isLoading = true;
      this.isReady = false;
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 0;
    },

    setWavesurfer(ws: WaveSurfer) {
      if (this.wavesurfer) {
        this.wavesurfer.destroy();
      }

      this.wavesurfer = ws;
      this.setupWaveSurferEvents();
    },

    setupWaveSurferEvents() {
      if (!this.wavesurfer) return;

      this.wavesurfer.unAll();

      this.wavesurfer.on("ready", () => {
        this.isLoading = false;
        this.isReady = true;
        this.duration = this.wavesurfer?.getDuration() || 0;
      });

      this.wavesurfer.on("loading", (progress: number) => { });

      this.wavesurfer.on("error", (error: any) => {
        console.error("WaveSurfer error:", error);
        this.isLoading = false;
        this.isReady = false;
      });

      this.wavesurfer.on("play", () => {
        this.isPlaying = true;
      });

      this.wavesurfer.on("pause", () => {
        this.isPlaying = false;
      });

      this.wavesurfer.on("timeupdate", (currentTime: number) => {
        this.currentTime = currentTime;
      });

      this.wavesurfer.on("seeking", (currentTime: number) => {
        this.currentTime = currentTime;
      });
    },

    play() {
      this.wavesurfer?.play();
    },

    pause() {
      this.wavesurfer?.pause();
    },

    togglePlayPause() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    },

    seek(time: number) {
      this.wavesurfer?.seekTo(time / this.duration);
    },

    setVolume(volume: number) {
      this.volume = Math.max(0, Math.min(1, volume));
      this.wavesurfer?.setVolume(this.volume);
    },

    skipForward(seconds: number = 10) {
      const newTime = Math.min(this.currentTime + seconds, this.duration);
      this.seek(newTime);
    },

    skipBackward(seconds: number = 10) {
      const newTime = Math.max(this.currentTime - seconds, 0);
      this.seek(newTime);
    },

    async spliStems() {
      if (this.audioPath) {
        try {
          const result = await splitStems({ input: this.audioPath, output: "output" });
          console.log("✅ Done:", result);
        } catch (err) {
          console.error("❌ Split failed:", err);
        }
      }
    },

    reset() {
      this.wavesurfer?.destroy();
      this.wavesurfer = null;
      this.audioPath = null;
      this.audioFile = null;
      this.isPlaying = false;
      this.isLoading = false;
      this.duration = 0;
      this.currentTime = 0;
      this.isReady = false;
    },
  },
});
