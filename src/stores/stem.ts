import { formatTime } from "@/lib/utils";
import { splitStems } from "@/services/splitStems";
import { defineStore } from "pinia";
import type WaveSurfer from "wavesurfer.js";

// ✅ Tauri helper to turn an absolute FS path into a URL the WebView can load
import { convertFileSrc } from "@tauri-apps/api/core";

export const useStemStore = defineStore("stem", {
  state: () => ({
    audioPath: null as string | null, // absolute path (Tauri)
    audioFile: null as File | null, // browser File (if used)
    wavesurfer: null as WaveSurfer | null,

    isPlaying: false,
    isLoading: false,
    isReady: false,

    duration: 0,
    currentTime: 0,
    volume: 0.7,

    // internal: track the current object URL so we can revoke it
    _objectUrl: null as string | null,
    // internal: if wavesurfer not set yet, remember what to load
    _pendingSrc: null as string | null,
  }),

  getters: {
    progress: (state) => {
      if (state.duration === 0) return 0;
      return (state.currentTime / state.duration) * 100;
    },
    formattedCurrentTime: (state) => formatTime(state.currentTime),
    formattedDuration: (state) => formatTime(state.duration),
  },

  actions: {
    // ---- Source loading helpers -------------------------------------------
    _loadIntoWaveSurfer(src: string) {
      // If wavesurfer isn't ready yet, defer load
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

    // Load from a File (browser input). In Tauri you might still use this for previews.
    loadFile(file: File, path?: string) {
      // Clean up old object URL if any
      if (this._objectUrl) {
        URL.revokeObjectURL(this._objectUrl);
        this._objectUrl = null;
      }

      this.audioFile = file;
      this.audioPath = path || null; // optional hint if provided from Tauri

      const url = URL.createObjectURL(file);
      this._objectUrl = url;

      this._loadIntoWaveSurfer(url);
    },

    // Load directly from an absolute filesystem path (Tauri best path)
    loadFileFromPath(path: string) {
      // Clean up any existing object URL
      if (this._objectUrl) {
        URL.revokeObjectURL(this._objectUrl);
        this._objectUrl = null;
      }

      this.audioPath = path;
      this.audioFile = null;

      // convert absolute path to a tauri://-style URL usable by the WebView
      const src = convertFileSrc(path);
      this._loadIntoWaveSurfer(src);
    },

    // ---- Wavesurfer lifecycle ---------------------------------------------
    setWavesurfer(ws: WaveSurfer) {
      if (this.wavesurfer) {
        this.wavesurfer.destroy();
      }

      this.wavesurfer = ws;
      this.wavesurfer.setVolume(this.volume);
      this.setupWaveSurferEvents();

      // If we had a source queued before WS existed, load it now
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

      this.wavesurfer.on("loading", (_progress: number) => {
        this.isLoading = true;
      });

      this.wavesurfer.on("error", (error: any) => {
        console.error("WaveSurfer error:", error);
        this.isLoading = false;
        this.isReady = false;
      });

      this.wavesurfer.on("play", () => (this.isPlaying = true));
      this.wavesurfer.on("pause", () => (this.isPlaying = false));

      this.wavesurfer.on("timeupdate", (t: number) => (this.currentTime = t));
      this.wavesurfer.on("seeking", (t: number) => (this.currentTime = t));
    },

    // ---- Transport ---------------------------------------------------------
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
      this.wavesurfer.seekTo(clamped / this.duration); // expects 0..1
    },

    setVolume(volume: number) {
      this.volume = Math.max(0, Math.min(1, volume));
      this.wavesurfer?.setVolume(this.volume);
    },

    skipForward(seconds: number = 10) {
      this.seek(this.currentTime + seconds);
    },

    skipBackward(seconds: number = 10) {
      this.seek(this.currentTime - seconds);
    },

    // ---- Split (fix typo) --------------------------------------------------
    async splitStems() {
      if (!this.audioPath) {
        console.warn("No audioPath set; split requires a filesystem path.");
        return;
      }

      try {
        const result = await splitStems({
          input: this.audioPath,
          output: "output",
        });
        console.log("✅ Done:", result);
      } catch (err) {
        console.error("❌ Split failed:", err);
      }
    },

    // ---- Reset / cleanup ---------------------------------------------------
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
