"use client";

import { useDrag } from "react-dnd";
import { songs } from "@/data/songs";
import { motion } from "framer-motion";
import { Disc } from "lucide-react";

export function CDShelf() {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
      <h2 className="text-white/90 font-medium flex items-center space-x-2 sticky top-0 bg-black/20 backdrop-blur-md p-2 rounded-lg z-10">
        <Disc size={16} />
        <span>Collection</span>
      </h2>
      <div className="grid grid-cols-2 gap-4 pt-2">
        {songs.map((song) => (
          <CDItem key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}

function CDItem({ song }: { song: typeof songs[0] }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "CD",
    item: song,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={dragRef as any}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.05)" }}
      whileTap={{ scale: 0.92, y: 0, boxShadow: "0 5px 10px rgba(0,0,0,0.4)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`glass rounded-xl p-4 flex flex-col items-center justify-center space-y-3 cursor-grab active:cursor-grabbing transition-opacity ${
        isDragging ? "opacity-30 scale-95" : "opacity-100"
      }`}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-zinc-800 via-zinc-600 to-zinc-900 border border-white/10 shadow-inner flex items-center justify-center relative overflow-hidden group-hover:rotate-12 transition-transform duration-500">
        <div className="w-4 h-4 rounded-full bg-black border border-white/20 z-10" />
        {/* Mock CD Reflection (shiny vinyl effect) */}
        <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.3) 45deg, transparent 90deg, rgba(255,255,255,0.3) 225deg, transparent 270deg)' }} />
      </div>
      <div className="text-center w-full">
        <p className="text-xs text-white/90 font-medium line-clamp-1 truncate">{song.title}</p>
        <p className="text-[10px] text-white/40 truncate">{song.album}</p>
      </div>
    </motion.div>
  );
}
