import { formatTime } from "@/lib/utils";
import { splitStems } from "@/services/splitStems";
import { defineStore } from "pinia";
import type WaveSurfer from "wavesurfer.js";

function convertToAudioProtocol(filePath: string): string {
  return `audio://localhost${filePath}`;
}

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
    _loadIntoWaveSurfer(src: string) {
      if (!this.wavesurfer) {
        console.log(
          "Wavesurfer not ready, deferring load. Saving to _pendingSrc"
        );
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
        const audioUrl = convertToAudioProtocol(path);
        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.status}`);
        }

        // Convert to blob with explicit MIME type
        const arrayBuffer = await response.arrayBuffer();
        const contentType =
          response.headers.get("content-type") || "audio/mpeg";
        const blob = new Blob([arrayBuffer], { type: contentType });

        const blobUrl = URL.createObjectURL(blob);
        this._objectUrl = blobUrl;

        this._loadIntoWaveSurfer(blobUrl);
      } catch (error) {
        console.error("❌ Failed to load audio file:", error);
        this.isLoading = false;
        this.isReady = false;
      }
    },

    setWavesurfer(ws: WaveSurfer) {
      if (this.wavesurfer) {
        this.wavesurfer.destroy();
      }

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
        console.log("Done:", result);
      } catch (err) {
        console.error("Split failed:", err);
      }
    },

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
