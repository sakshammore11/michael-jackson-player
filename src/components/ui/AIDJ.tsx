"use client";

import { useState, useRef, useEffect } from "react";
import { getAIDJRecommendation, type ConversationMessage } from "@/lib/openrouter";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Music, MessageCircle, ChevronDown, Trash2 } from "lucide-react";

type HistoryEntry = {
  id: string;
  userQuery: string;
  recommendation: {
    title: string;
    reason: string;
    nextSongs: string[];
  };
};

export function AIDJ() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  // Conversation context for the API (role/content pairs)
  const [apiHistory, setApiHistory] = useState<ConversationMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest entry without shifting the whole page
  useEffect(() => {
    if (history.length > 0 && scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;

    const userQuery = mood;
    setLoading(true);
    setMood("");

    try {
      const result = await getAIDJRecommendation(userQuery, apiHistory);

      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        userQuery,
        recommendation: result.recommendation,
      };

      // Add to visible history
      setHistory(prev => [...prev, newEntry]);

      // Update API history with this turn
      setApiHistory(prev => [
        ...prev,
        { role: "user", content: userQuery },
        { role: "assistant", content: result.rawAssistantMessage },
      ]);
    } catch (error) {
      console.error(error);
      const fallback: HistoryEntry = {
        id: Date.now().toString(),
        userQuery,
        recommendation: {
          title: "Human Nature",
          reason: "Lost signal for a moment — but Human Nature is always a safe harbour.",
          nextSongs: ["Stranger in Moscow", "Speechless", "Earth Song"],
        },
      };
      setHistory(prev => [...prev, fallback]);
    }
    setLoading(false);
  };

  const clearHistory = () => {
    setHistory([]);
    setApiHistory([]);
  };

  const latestEntry = history[history.length - 1];
  const pastEntries = history.slice(0, -1);

  return (
    <div className="flex flex-col space-y-4">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass self-start p-3 rounded-full hover:bg-white/10 transition-colors"
      >
        <MessageCircle size={20} className="text-white/80" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="glass rounded-2xl flex flex-col shadow-2xl backdrop-blur-xl relative overflow-hidden"
            style={{ width: "350px" }}
          >
            {/* Ambient glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-zinc-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 relative z-10">
              <h2 className="text-white/90 font-medium flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-white/10">
                  <Music size={14} />
                </div>
                <span className="tracking-wide">AI DJ</span>
                {history.length > 0 && (
                  <span className="text-[10px] text-white/30 ml-1">
                    {history.length} {history.length === 1 ? "pick" : "picks"}
                  </span>
                )}
              </h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-white/20 hover:text-white/50 transition-colors p-1"
                  title="Clear history"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            {/* Scrollable history area */}
            <div
              ref={scrollContainerRef}
              className="overflow-y-auto custom-scrollbar relative z-10 px-5"
              style={{ maxHeight: "360px" }}
            >
              {/* Past entries (collapsed) */}
              {pastEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 pb-4 border-b border-white/6"
                >
                  {/* User query */}
                  <p className="text-[10px] text-white/30 mb-1 italic">"{entry.userQuery}"</p>
                  {/* Compact previous pick */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/25 block">Past Pick</span>
                      <span className="text-white/60 text-sm font-light">{entry.recommendation.title}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end max-w-[140px]">
                      {entry.recommendation.nextSongs.slice(0, 2).map((song, i) => (
                        <span key={i} className="text-[9px] text-white/25 bg-white/5 px-2 py-0.5 rounded-full">
                          {song.length > 15 ? song.slice(0, 14) + "…" : song}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Latest / current recommendation */}
              {latestEntry && (
                <motion.div
                  key={latestEntry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="space-y-4 pb-4"
                >
                  {/* User query bubble */}
                  <div className="flex justify-end">
                    <span className="text-[11px] text-white/40 bg-white/5 border border-white/8 px-3 py-1.5 rounded-2xl rounded-br-sm italic">
                      "{latestEntry.userQuery}"
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-1">Tonight's Pick</span>
                    <span className="text-white text-xl font-light tracking-wide">{latestEntry.recommendation.title}</span>
                  </div>

                  <div className="leading-relaxed border-l-[3px] border-white/20 pl-4 py-1 text-white/70 italic text-sm">
                    {latestEntry.recommendation.reason.split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.03), duration: 0.3 }}
                        className="inline-block mr-1"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-2">Up Next</span>
                    <div className="flex flex-wrap gap-2">
                      {latestEntry.recommendation.nextSongs?.map((song: string, i: number) => (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + (i * 0.1) }}
                          key={i}
                          className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs hover:bg-white/10 transition-colors cursor-default"
                        >
                          {song}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Loading state */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2 pb-4 text-white/40 text-sm"
                >
                  <Loader2 size={14} className="animate-spin" />
                  <span>Finding the right track…</span>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="relative px-5 pb-5 pt-3 z-10 border-t border-white/6">
              <input
                type="text"
                placeholder={history.length > 0 ? "Ask for another…" : "How are you feeling tonight?"}
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                disabled={loading}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 transition-all disabled:opacity-50 shadow-inner"
              />
              {loading && (
                <div className="absolute right-8 top-6">
                  <Loader2 size={18} className="animate-spin text-white/50" />
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
