import RetroCassetteView from "@/views/retro-cassette/RetroCassetteView.vue";
import { Component } from "vue";

export enum THEME_IDS {
    retro_cassette = "retro_cassette"
}

export type THEME = {
    id: THEME_IDS; 
    name: string;
    view: Component
} 

export const THEMES: THEME[] = [
    {
        id: THEME_IDS.retro_cassette,
        name: "Retro Cassette",
        view: RetroCassetteView
    }
]