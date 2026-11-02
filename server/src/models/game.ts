import { Schema } from "mongoose";

export interface IGameSnapshot {
  id: number;
  name: string;
  background_image: string | null;
  released?: string | null;
  rating?: number;
  genres?: {
    id: number;
    name: string;
  }[];
}

const genreSchema = new Schema(
  {
    id: { type: Number, required: true, min: 1 },
    name: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const gameSchema = new Schema<IGameSnapshot>(
  {
    id: { type: Number, required: true, min: 1 },
    name: { type: String, required: true, trim: true },
    background_image: { type: String, default: null },
    released: { type: String, default: null },
    rating: { type: Number, min: 0, max: 5 },
    genres: { type: [genreSchema], default: [] },
  },
  { _id: false },
);
