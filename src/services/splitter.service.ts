import { invoke } from "@tauri-apps/api/core";
import type { AccelerationMode, PreferredProvider } from "@/stores/settings.store";

export interface SplitAccelerationSettings {
  mode: AccelerationMode;
  preferredProvider: PreferredProvider;
}

export interface SplitStemsParams {
  input: string;
  output: string;
  acceleration: SplitAccelerationSettings;
}

export const splitStems = async ({ input, output, acceleration }: SplitStemsParams): Promise<string> => {
  return await invoke("split_stems", { input, output, acceleration });
};
