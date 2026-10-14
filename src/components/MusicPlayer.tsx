"use client";

import { useState, useRef, useEffect } from "react";
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Radio, Music } from "lucide-react";
import { motion } from "framer-motion";

const TRACK = {
  title: "Shelter",
  artist: "Porter Robinson & Madeon",
  album: "SHELTER EP - 2016",
  duration: 338,
};

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [elapsed, setElapsed] = useState(138); // start at 2:18 like the design
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= TRACK.duration) {
            if (isRepeat) return 0;
            setIsPlaying(false);
            return TRACK.duration;
          }
          return e + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isRepeat]);

  const progress = elapsed / TRACK.duration;

  return (
    <div className="relative">
      <div
        className="absolute inset-0 rounded-[24px] translate-x-[8px] translate-y-[8px]"
        style={{ backgroundColor: "#FFB800", border: "2.5px solid #000" }}
      />
      <div
        className="relative w-[480px] rounded-[24px] p-5 flex flex-col gap-2.5"
        style={{
          backgroundColor: "#FFECC7",
          border: "2.5px solid #000000",
          fontFamily: "var(--font-fredoka), cursive, sans-serif",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: "#141414" }}
          >
            <motion.div
              animate={isPlaying ? { scale: [1, 1.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <Radio size={12} className="text-[#22C55E]" strokeWidth={2.5} />
            </motion.div>
            FM 88.7 SHELTER RADIO
          </span>
        </div>

        <div>
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px]"
            style={{
              backgroundColor: "#FFD600",
              color: "#141414",
              border: "1.5px solid #000",
            }}
          >
            <Play size={10} className="fill-[#FF5C00] text-[#FF5C00]" strokeWidth={2.5} />
            NOW PLAYING
          </span>
        </div>

        <div className="mt-0">
          <h3 className="text-[38px] font-bold text-[#141414] leading-[1]">
            {TRACK.title}
          </h3>
          <p className="text-[15px] font-medium text-[#6B7280] mt-1">
            {TRACK.artist}
          </p>
        </div>

        <div>
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px]"
            style={{
              backgroundColor: "#FFD600",
              color: "#141414",
              border: "1.5px solid #000",
            }}
          >
            <Music size={11} strokeWidth={2.5} className="text-[#141414]" />
            {TRACK.album}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div
            className="w-full h-[6px] rounded-full overflow-hidden cursor-pointer"
            style={{ backgroundColor: "#D1D5DB" }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              setElapsed(Math.floor(ratio * TRACK.duration));
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "#141414" }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.25, ease: "linear" }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#6B7280] font-medium">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(TRACK.duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-0">
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94, x: 1, y: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={() => setIsShuffle(!isShuffle)}
            aria-label="Shuffle"
            className="w-10 h-10 rounded-[12px] flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: isShuffle ? "#FFD600" : "#fff",
              border: "2px solid #000",
              boxShadow: "2px 2px 0 0 #000",
            }}
          >
            <Shuffle size={17} strokeWidth={2.5} className="text-[#141414]" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94, x: 1, y: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            aria-label="Previous"
            className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center cursor-pointer"
            style={{ border: "2px solid #000", boxShadow: "2px 2px 0 #000" }}
            onClick={() => setElapsed((prev) => Math.max(0, prev - 10))}
          >
            <SkipBack size={18} strokeWidth={2.5} className="fill-[#141414] text-[#141414]" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92, x: 2, y: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white cursor-pointer"
            style={{
              backgroundColor: "#141414",
              border: "2px solid #000",
              boxShadow: "3px 3px 0 #FFB800",
            }}
          >
            {isPlaying ? (
              <Pause size={22} strokeWidth={2.5} className="fill-white text-white" />
            ) : (
              <Play size={22} strokeWidth={2.5} className="fill-white text-white ml-0.5" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94, x: 1, y: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            aria-label="Next"
            className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center cursor-pointer"
            style={{ border: "2px solid #000", boxShadow: "2px 2px 0 #000" }}
            onClick={() => setElapsed((prev) => Math.min(TRACK.duration, prev + 10))}
          >
            <SkipForward size={18} strokeWidth={2.5} className="fill-[#141414] text-[#141414]" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94, x: 1, y: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={() => setIsRepeat(!isRepeat)}
            aria-label="Repeat"
            className="w-10 h-10 rounded-[12px] flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: isRepeat ? "#C084FC" : "#fff",
              border: "2px solid #000",
              boxShadow: "2px 2px 0 0 #000",
            }}
          >
            <Repeat
              size={17}
              strokeWidth={2.5}
              className={isRepeat ? "text-white" : "text-[#141414]"}
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
