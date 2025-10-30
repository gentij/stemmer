import { Stem } from "@/types/stems.interface";

export const defaultStems: Stem[] = [
  { id: "vocals", name: "Vocals", volume: 80, muted: false, color: "#D97FFF" },
  { id: "drums", name: "Drums", volume: 70, muted: false, color: "#F9D4FF" },
  { id: "bass", name: "Bass", volume: 75, muted: false, color: "#F6C2FF" },
  { id: "other", name: "Other", volume: 65, muted: false, color: "#A57C10" },
];
