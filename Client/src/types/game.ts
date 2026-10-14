export interface Game {
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
