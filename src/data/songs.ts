export type Song = {
  id: string;
  title: string;
  album: string;
  artist?: string;
  energy: number;
  mood: string[];
  spotifyQuery: string;
  duration: string;
};

import songsData from './songs.json';
export const songs: Song[] = songsData as Song[];
