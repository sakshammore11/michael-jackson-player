"use client";

import { useDrop } from "react-dnd";
import { useStore } from "@/store/useStore";
import { type Song } from "@/data/songs";
import { motion, AnimatePresence } from "framer-motion";
import { Disc3 } from "lucide-react";

export function TurntableDropZone() {
  const { setCurrentSong, setIsPlaying, currentSong, isPlaying } = useStore();

  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: "CD",
    drop: (item: Song) => {
      const { setLaunchSequenceActive, setIsReadyToListen, setCurrentSong, setIsPlaying } = useStore.getState();
      
      setLaunchSequenceActive(true);
      setCurrentSong(item);
      setIsPlaying(false);
      setIsReadyToListen(false);
      
      // Step 1: Needle drops (1s)
      setTimeout(() => setIsReadyToListen(true), 1000);

      // Step 2: Spin starts and crackle plays (2.5s)
      setTimeout(() => setIsPlaying(true), 2500);

      // Step 3: Open Spotify and close overlay (5s)
      setTimeout(() => {
        window.open(`https://open.spotify.com/search/${encodeURIComponent(item.spotifyQuery)}`, "_blank");
        setLaunchSequenceActive(false);
      }, 5000);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={dropRef as any}
      className="relative w-[340px] h-[340px] flex items-center justify-center"
      style={{ cursor: canDrop ? "copy" : "default" }}
    >
      {/* Animated ring that pulses when hovering */}
      <AnimatePresence>
        {isOver && (
          <motion.div
            key="drop-ring"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute inset-0 rounded-full border-2 border-white/40"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
              boxShadow: "0 0 40px rgba(255,255,255,0.15), inset 0 0 40px rgba(255,255,255,0.05)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Center hint label — only shown when dragging and no song */}
      {canDrop && !currentSong && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-2 pointer-events-none"
        >
          <Disc3 size={32} className="text-white/60 animate-spin" style={{ animationDuration: "3s" }} />
          <span className="text-white/60 text-sm tracking-widest uppercase">Drop Here</span>
        </motion.div>
      )}

      {/* Subtle drop hint ring always visible when can drop */}
      {canDrop && (
        <div
          className="absolute inset-0 rounded-full border border-dashed border-white/20 pointer-events-none"
        />
      )}
    </div>
  );
}
