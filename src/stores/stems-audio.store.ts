import { defineStore } from "pinia";
import { useSplitterToolStore } from "./splitter-tool.store";
import { useAudioCoreStore } from "./audio-core.store";
import { useSettingsStore } from "./settings.store";
import { join, basename } from "@tauri-apps/api/path";
import { readFile } from "@tauri-apps/plugin-fs";

interface StemAudio {
  id: string;
  name: string;
  audio: HTMLAudioElement | null;
  volume: number;
  muted: boolean;
  blobUrl: string | null;
  handlers?: {
    loadedmetadata?: () => void;
    timeupdate?: () => void;
    ended?: () => void;
  };
}

export const useStemsAudioStore = defineStore("stemsAudio", {
  state: () => ({
    stems: {
      vocals: {
        id: "vocals",
        name: "Vocals",
        audio: null,
        volume: 0.8,
        muted: false,
        blobUrl: null,
      } as StemAudio,
      drums: {
        id: "drums",
        name: "Drums",
        audio: null,
        volume: 0.7,
        muted: false,
        blobUrl: null,
      } as StemAudio,
      bass: {
        id: "bass",
        name: "Bass",
        audio: null,
        volume: 0.75,
        muted: false,
        blobUrl: null,
      } as StemAudio,
      other: {
        id: "other",
        name: "Other",
        audio: null,
        volume: 0.65,
        muted: false,
        blobUrl: null,
      } as StemAudio,
    },
    isPlaying: false,
    isLoading: false,
    duration: 0,
    currentTime: 0,
    audioContext: null as AudioContext | null,
    startTime: 0, 
    pauseTime: 0, 
  }),

  getters: {
    allStemsLoaded: (state) => {
      return Object.values(state.stems).every((stem) => stem.audio !== null);
    },
  },

  actions: {
    async loadStems() {
      const splitterStore = useSplitterToolStore();
      const audioStore = useAudioCoreStore();
      let outputPath = splitterStore.outputPath;

      if (!outputPath) return;

      this.reset();

      if (audioStore.audioPath) {
        const inputFileName = await basename(audioStore.audioPath);
        const inputFileStem = inputFileName.replace(/\.[^/.]+$/, "");
        const outputDirName = outputPath ? await basename(outputPath) : null;

        if (inputFileStem && outputDirName && inputFileStem !== outputDirName) {
          const settingsStore = useSettingsStore();
          const baseOutputDir = settingsStore.outputDirectory;
          const correctedOutputPath = await join(baseOutputDir, inputFileStem);
          outputPath = correctedOutputPath;
        }
      }

      this.isLoading = true;

      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      try {
        const songName = await basename(outputPath);

        for (const stemId of Object.keys(this.stems) as Array<
          keyof typeof this.stems
        >) {
          const stemFileName = `${songName}_${stemId}.wav`;
          const stemPath = await join(outputPath, stemFileName);

          try {
            const fileData = await readFile(stemPath); 

            const blob = new Blob([fileData], { type: "audio/wav" });
            const audioUrl = URL.createObjectURL(blob);

            const audio = new Audio();
            audio.src = audioUrl;
            audio.volume = this.stems[stemId].volume;
            audio.muted = this.stems[stemId].muted;

            this.stems[stemId].blobUrl = audioUrl;
            this.stems[stemId].handlers = {};

            const onLoadedMetadata = () => {
              if (this.duration === 0 || audio.duration > this.duration) {
                this.duration = audio.duration;
              }
            };
            audio.addEventListener("loadedmetadata", onLoadedMetadata);
            this.stems[stemId].handlers!.loadedmetadata = onLoadedMetadata;

            if (stemId === "vocals") {
              const onTimeUpdate = () => {
                if (this.isPlaying) {
                  this.currentTime = audio.currentTime;
                }
              };
              audio.addEventListener("timeupdate", onTimeUpdate);
              this.stems[stemId].handlers!.timeupdate = onTimeUpdate;

              const onEnded = () => {
                this.isPlaying = false;
              };
              audio.addEventListener("ended", onEnded);
              this.stems[stemId].handlers!.ended = onEnded;
            }

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

    async play() {
      if (!this.allStemsLoaded || !this.audioContext) return;

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const targetTime = this.pauseTime;
      
      const audioElements = Object.values(this.stems)
        .map(stem => stem.audio)
        .filter(audio => audio !== null) as HTMLAudioElement[];

      audioElements.forEach(audio => {
        audio.currentTime = targetTime;
      });

      await Promise.all(audioElements.map(audio => {
        return new Promise<void>((resolve) => {
          if (audio.readyState >= 3) {
            resolve();
            return;
          }
          
          const onCanPlay = () => {
            audio.removeEventListener('canplay', onCanPlay);
            resolve();
          };
          audio.addEventListener('canplay', onCanPlay);
          
          setTimeout(() => {
            audio.removeEventListener('canplay', onCanPlay);
            resolve();
          }, 1000);
        });
      }));

      const playPromises = audioElements.map(audio => 
        audio.play().catch(e => {
          console.error('Play failed:', e);
          // throw e;
        })
      );

      try {
        await Promise.all(playPromises);
        this.startTime = this.audioContext.currentTime - targetTime;
        this.isPlaying = true;
      } catch (error) {
        console.error('Failed to start playback:', error);
        this.isPlaying = false;
        audioElements.forEach(audio => audio.pause());
      }
    },

    pause() {
      if (!this.allStemsLoaded) return;

      if (this.isPlaying) {
        this.pauseTime = this.currentTime;
      }

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
      const wasPlaying = this.isPlaying;

      if (wasPlaying) {
        this.pause();
      }
      
      this.pauseTime = clampedTime;
      this.currentTime = clampedTime;

      Object.values(this.stems).forEach((stem) => {
        if (stem.audio) {
          stem.audio.currentTime = clampedTime;
        }
      });

      if (wasPlaying) {
        setTimeout(() => this.play(), 20);
      }
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
          if (stem.handlers) {
            if (stem.handlers.loadedmetadata) stem.audio.removeEventListener("loadedmetadata", stem.handlers.loadedmetadata);
            if (stem.handlers.timeupdate) stem.audio.removeEventListener("timeupdate", stem.handlers.timeupdate);
            if (stem.handlers.ended) stem.audio.removeEventListener("ended", stem.handlers.ended);
          }
          stem.audio.src = "";
          stem.audio.load();
          stem.audio = null;
        }

        if (stem.blobUrl) {
          URL.revokeObjectURL(stem.blobUrl);
          stem.blobUrl = null;
        }
        stem.handlers = {};
      });

      this.isPlaying = false;
      this.isLoading = false;
      this.duration = 0;
      this.currentTime = 0;
      this.pauseTime = 0;
      this.startTime = 0;
    },
  },
});