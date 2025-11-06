import { convertFileSrc } from "@tauri-apps/api/core";

export async function makeAudioBlobUrlFromPath(path: string): Promise<string> {
  const audioUrl = convertFileSrc(path);
  const res = await fetch(audioUrl);

  if (!res.ok) throw new Error(`Failed to fetch audio: ${res.status}`);

  const contentType = res.headers.get("content-type") || "audio/mpeg";
  const buf = await res.arrayBuffer();
  const blob = new Blob([buf], { type: contentType });

  return URL.createObjectURL(blob);
}
