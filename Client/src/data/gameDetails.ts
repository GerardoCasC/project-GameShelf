import gamesData from "./games.json";
import type { GameDetail } from "../types/game";

export const exampleGameDetail: GameDetail = {
  ...gamesData[0],

  description_raw:
    "Hollow Knight es un juego de acción y aventura " +
    "ambientado en Hallownest, un antiguo reino " +
    "subterráneo. Explora escenarios interconectados, " +
    "enfréntate a criaturas y descubre los secretos " +
    "que esconde este misterioso mundo.",

  developers: [
    {
      id: 1,
      name: "Team Cherry",
    },
  ],

  platforms: [
    {
      platform: {
        id: 4,
        name: "PC",
      },
    },
    {
      platform: {
        id: 7,
        name: "Nintendo Switch",
      },
    },
    {
      platform: {
        id: 18,
        name: "PlayStation 4",
      },
    },
  ],
};
