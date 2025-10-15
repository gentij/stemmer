import { formatTime } from "@/lib/utils";
import { defineStore } from "pinia";
import type WaveSurfer from "wavesurfer.js";
import { makeAudioBlobUrlFromPath } from "@/lib/audio/source-adapters";
// ^ wraps your current convertToAudioProtocol + fetch/blob creation

export const useAudioCoreStore = defineStore("audioCore", {
  state: () => ({
    audioPath: null as string | null,
    audioFile: null as File | null,
    wavesurfer: null as WaveSurfer | null,

    isPlaying: false,
    isLoading: false,
    isReady: false,

    duration: 0,
    currentTime: 0,
    volume: 0.7,

    _objectUrl: null as string | null,
    _pendingSrc: null as string | null,
  }),

  getters: {
    progress: (s) =>
      s.duration === 0 ? 0 : (s.currentTime / s.duration) * 100,
    formattedCurrentTime: (s) => formatTime(s.currentTime),
    formattedDuration: (s) => formatTime(s.duration),

    // Optional aliases for future readability (keep current names too)
    isWaveformReady: (s) => s.isReady,
    isWaveformLoading: (s) => s.isLoading,
    hasSource: (s) => !!s.audioFile || !!s.audioPath,
  },

  actions: {
    _loadIntoWaveSurfer(src: string) {
      if (!this.wavesurfer) {
        this._pendingSrc = src;
        return;
      }
      this.isLoading = true;
      this.isReady = false;
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 0;

      this.wavesurfer.load(src);
    },

    loadFile(file: File, path?: string) {
      if (this._objectUrl) {
        URL.revokeObjectURL(this._objectUrl);
        this._objectUrl = null;
      }

      this.audioFile = file;
      this.audioPath = path || null;

      const url = URL.createObjectURL(file);
      this._objectUrl = url;

      this._loadIntoWaveSurfer(url);
    },

    async loadFileFromPath(path: string) {
      if (this._objectUrl) {
        URL.revokeObjectURL(this._objectUrl);
        this._objectUrl = null;
      }

      this.audioPath = path;
      this.audioFile = null;

      try {
        const blobUrl = await makeAudioBlobUrlFromPath(path);
        this._objectUrl = blobUrl;

        this._loadIntoWaveSurfer(blobUrl);
      } catch (error) {
        console.error("❌ Failed to load audio file:", error);

        this.isLoading = false;
        this.isReady = false;
      }
    },

    setWavesurfer(ws: WaveSurfer) {
      if (this.wavesurfer) this.wavesurfer.destroy();

      this.wavesurfer = ws;
      this.wavesurfer.setVolume(this.volume);
      this.setupWaveSurferEvents();

      if (this._pendingSrc) {
        const src = this._pendingSrc;
        this._pendingSrc = null;
        this._loadIntoWaveSurfer(src);
      }
    },

    setupWaveSurferEvents() {
      if (!this.wavesurfer) return;

      this.wavesurfer.unAll();

      this.wavesurfer.on("ready", () => {
        this.isLoading = false;
        this.isReady = true;
        this.duration = this.wavesurfer?.getDuration() || 0;
      });

      this.wavesurfer.on("loading", () => {
        this.isLoading = true;
      });

      this.wavesurfer.on("error", (e: any) => {
        console.error("WaveSurfer error:", e);
        this.isLoading = false;
        this.isReady = false;
      });

      this.wavesurfer.on("play", () => (this.isPlaying = true));

      this.wavesurfer.on("pause", () => (this.isPlaying = false));

      this.wavesurfer.on("timeupdate", (t: number) => (this.currentTime = t));

      this.wavesurfer.on("seeking", (t: number) => (this.currentTime = t));
    },

    play() {
      this.wavesurfer?.play();
    },

    pause() {
      this.wavesurfer?.pause();
    },

    togglePlayPause() {
      this.isPlaying ? this.pause() : this.play();
    },

    seek(time: number) {
      if (!this.wavesurfer || this.duration <= 0) return;

      const clamped = Math.max(0, Math.min(time, this.duration));
      this.wavesurfer.seekTo(clamped / this.duration);
    },

    setVolume(volume: number) {
      this.volume = Math.max(0, Math.min(1, volume));
      this.wavesurfer?.setVolume(this.volume);
    },

    skipForward(sec = 10) {
      this.seek(this.currentTime + sec);
    },

    skipBackward(sec = 10) {
      this.seek(this.currentTime - sec);
    },

    // NOTE: removed tool action from core; keep it in a tool store/service.
    // (If you must keep it for now, keep it; you can deprecate later.)

    reset() {
      this.wavesurfer?.destroy();
      this.wavesurfer = null;

      if (this._objectUrl) {
        URL.revokeObjectURL(this._objectUrl);
        this._objectUrl = null;
      }

      this._pendingSrc = null;
      this.audioPath = null;
      this.audioFile = null;
      this.isPlaying = false;
      this.isLoading = false;
      this.isReady = false;
      this.duration = 0;
      this.currentTime = 0;
      this.volume = 0.7;
    },
  },
});
