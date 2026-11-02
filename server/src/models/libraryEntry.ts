import { Schema, model, Types } from "mongoose";
import { gameSchema } from "./game.js";
import type { IGameSnapshot } from "./game.js";

export type GameStatus = "pending" | "playing" | "completed" | "abandoned";

export interface ILibraryEntry {
  owner: Types.ObjectId;
  game: IGameSnapshot;
  status: GameStatus;
}

const libraryEntrySchema = new Schema<ILibraryEntry>(
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
    status: {
      type: String,
      enum: ["pending", "playing", "completed", "abandoned"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true },
);

libraryEntrySchema.index({ owner: 1, "game.id": 1 }, { unique: true });

export const LibraryEntry = model<ILibraryEntry>(
  "LibraryEntry",
  libraryEntrySchema,
);
