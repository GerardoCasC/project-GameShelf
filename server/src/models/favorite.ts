import { Schema, model, Types } from "mongoose";
import { gameSchema } from "./game.js";
import type { IGameSnapshot } from "./game.js";

export interface IFavorite {
  owner: Types.ObjectId;
  game: IGameSnapshot;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    game: {
      type: gameSchema,
      required: true,
    },
  },
  { timestamps: true },
);

favoriteSchema.index({ owner: 1, "game.id": 1 }, { unique: true });

export const Favorite = model<IFavorite>("Favorite", favoriteSchema);
