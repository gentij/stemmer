export enum THEME_IDS {
  retro_cassette = "retro_cassette",
}

export type THEME = {
  id: THEME_IDS;
  name: string;
  route: string;
};

export const THEMES: THEME[] = [
  {
    id: THEME_IDS.retro_cassette,
    name: "Retro Cassette",
    route: "/retro-cassette",
  },
];