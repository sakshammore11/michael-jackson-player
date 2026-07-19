"use client";

import { useStore } from "@/store/useStore";
import { AIDJ } from "./AIDJ";
import { CDShelf } from "./CDShelf";
import { TurntableDropZone } from "./TurntableDropZone";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, Moon, Sun, CloudLightning, Maximize, Minimize } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export function LayoutOverlay() {
  const { currentSong, isPlaying, lightingMode, setLightingMode, launchSequenceActive } = useStore();
  const [rainIntensity, setRainIntensity] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Clock tick & Hydration fix
  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Ambient & Crackle Audio
  useEffect(() => {
    const crackle = new Audio('https://www.soundjay.com/misc/sounds/record-crackle-1.mp3');
    crackle.loop = true;
    crackle.volume = 0.3;

    if (isPlaying) {
      crackle.play().catch(() => {});
    } else {
      crackle.pause();
    }
    
    return () => {
      crackle.pause();
      crackle.src = '';
    };
  }, [isPlaying]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleRainClick = () => {
    setRainIntensity((prev) => (prev > 3 ? 1 : prev + 1));
  };

  const cycleLighting = () => {
    const modes: typeof lightingMode[] = ['Morning', 'Sunset', 'Rainy Night', 'Midnight', 'Thunderstorm', 'Golden Hour'];
    const nextIdx = (modes.indexOf(lightingMode) + 1) % modes.length;
    setLightingMode(modes[nextIdx]);
  };

  return (
    <div className="w-full h-full relative">
      {/* Top Left: Logo & Clock */}
      <div className="absolute top-8 left-8 pointer-events-auto flex items-center space-x-6">
        <h1 className="text-white/80 text-xl tracking-[0.2em] font-light uppercase">Moonwalk</h1>
        <div className="text-white/40 text-sm tracking-widest font-mono border-l border-white/20 pl-6 py-1">
          {mounted && time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
        </div>
        <AnimatePresence mode="popLayout">
          {currentSong && (
            <motion.div
              key={currentSong.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass px-4 py-2 rounded-full flex items-center space-x-3"
            >
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={isPlaying ? { height: ["4px", "16px", "4px"] } : { height: "4px" }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-1 bg-white/60 rounded-full"
                  />
                ))}
              </div>
              <span className="text-white/90 text-sm">{currentSong.title}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Right: Environment Controls */}
      <div className="absolute top-8 right-8 pointer-events-auto flex space-x-3">
        <button 
          onClick={cycleLighting}
          className="glass p-3 rounded-full hover:bg-white/10 transition-colors"
          title={`Lighting: ${lightingMode}`}
        >
          {lightingMode === 'Rainy Night' ? <CloudRain size={20} /> :
           lightingMode === 'Morning' ? <Sun size={20} /> :
           lightingMode === 'Thunderstorm' ? <CloudLightning size={20} /> :
           <Moon size={20} />}
        </button>

        <motion.button
          onClick={toggleFullscreen}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="glass p-3 rounded-full hover:bg-white/10 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isFullscreen ? (
              <motion.div
                key="minimize"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Minimize size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="maximize"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Maximize size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Center: 2D Drop Zone over the 3D turntable */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto" style={{ marginBottom: "5vh", marginRight: "10vw" }}>
          <TurntableDropZone />
        </div>
      </div>

      {/* Bottom Left: AI DJ */}
      <div className="absolute bottom-8 left-8 pointer-events-auto w-[350px]">
        <AIDJ />
      </div>

      {/* Bottom Right: CD Shelf */}
      <div className="absolute bottom-8 right-8 pointer-events-auto w-[400px]">
        <CDShelf />
      </div>

      {/* Ready To Listen Overlay */}
      <AnimatePresence>
        {launchSequenceActive && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 1 } }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 20, delay: 2.5 }}
              className="flex flex-col items-center space-y-6"
            >
              {currentSong && (
                <>
                  <div className="text-white/50 text-sm tracking-[0.3em] uppercase">Now Preparing</div>
                  <div className="text-4xl font-light text-white tracking-wide text-center max-w-lg leading-tight">
                    {currentSong.title}
                  </div>
                  <div className="text-white/40 text-sm">Opening Spotify...</div>
                  
                  {/* Audio wave animation */}
                  <div className="flex space-x-1 mt-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: ["8px", "24px", "8px"] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                        className="w-1.5 bg-white/60 rounded-full"
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
