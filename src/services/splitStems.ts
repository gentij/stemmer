import { invoke } from "@tauri-apps/api/core";

export const splitStems = async (): Promise<string> => {
  return await invoke("split_stems");
};
