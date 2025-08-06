import { invoke } from "@tauri-apps/api/core";

export interface SplitStemsParams {
  input: string,
  output: string
}

export const splitStems = async ({ input, output }: SplitStemsParams): Promise<string> => {
  return await invoke("split_stems", { input, output });
};
