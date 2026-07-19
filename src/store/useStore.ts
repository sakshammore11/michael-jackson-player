import { create } from 'zustand';
import { type Song } from '../data/songs';

type StoreState = {
  currentSong: Song | null;
  isPlaying: boolean;
  lightingMode: 'Morning' | 'Sunset' | 'Rainy Night' | 'Midnight' | 'Thunderstorm' | 'Golden Hour';
  isPlayerOpen: boolean;
  launchSequenceActive: boolean;
  isReadyToListen: boolean;
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setLightingMode: (mode: StoreState['lightingMode']) => void;
  setIsPlayerOpen: (isOpen: boolean) => void;
  setLaunchSequenceActive: (isActive: boolean) => void;
  setIsReadyToListen: (isReady: boolean) => void;
};

export const useStore = create<StoreState>((set) => ({
  currentSong: null,
  isPlaying: false,
  lightingMode: 'Rainy Night',
  isPlayerOpen: true,
  launchSequenceActive: false,
  isReadyToListen: false,
  setCurrentSong: (song) => set({ currentSong: song, isPlayerOpen: false }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setLightingMode: (lightingMode) => set({ lightingMode }),
  setIsPlayerOpen: (isPlayerOpen) => set({ isPlayerOpen }),
  setLaunchSequenceActive: (isActive) => set({ launchSequenceActive: isActive }),
  setIsReadyToListen: (isReady) => set({ isReadyToListen: isReady }),
}));
