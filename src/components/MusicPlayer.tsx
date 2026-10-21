"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Radio,
  Music,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "framer-motion";
import GlitchBeatVisualizer from "./GlitchBeatVisualizer";
import { useTheme } from "@/context/ThemeContext";

const TRACK = {
  title: "Shelter",
  artist: "Porter Robinson & Madeon",
  album: "SHELTER EP - 2016",
  src: "/assets/shelter.mp3",
  fallbackSrc: "/shelter.mp3",
  defaultDuration: 40, // 40 detik
};

function formatTime(secs: number) {
  if (isNaN(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const { isDark } = useTheme();

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(40);

  // Beat & Glitch state (Neo-Brutalist Audio Reactive)
  const [bassLevel, setBassLevel] = useState(0);
  const [isBeat, setIsBeat] = useState(false);
  const [frequencies, setFrequencies] = useState<number[]>([0.2, 0.4, 0.6, 0.3, 0.5, 0.7, 0.4]);

  // Audio & Web Audio API refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const prevBassRef = useRef<number>(0);
  const lastBeatTimeRef = useRef<number>(0);

  // Setup Web Audio API Analyser saat pertama kali Play ditekan
  const setupAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Cepat & responsif untuk beat detection
      analyser.smoothingTimeConstant = 0.75;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
    } catch (err) {
      console.warn("Web Audio API connection failed, using audio fallback:", err);
    }
  }, []);

  // Loop analisis frekuensi audio untuk efek Glitch Beat
  const updateAudioAnalysis = useCallback(() => {
    if (!analyserRef.current || !isPlaying) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Ambil bass dari frekuensi rendah (bin 1-4)
    const bassSum = dataArray[1] + dataArray[2] + dataArray[3] + dataArray[4];
    const currentBass = bassSum / (4 * 255); // Nilai 0 sampai 1

    // Deteksi beat kick jika terjadi lonjakan bass
    const bassDiff = currentBass - prevBassRef.current;
    const isKick = currentBass > 0.62 && bassDiff > 0.08;
    setIsBeat(isKick);
    setBassLevel(currentBass);
    prevBassRef.current = currentBass * 0.9;

    // Normalisasi 7 titik frekuensi untuk visualizer bar
    const step = Math.floor(dataArray.length / 7);
    const newFreqs = Array.from({ length: 7 }, (_, i) => {
      const val = dataArray[i * step] || 0;
      return Math.max(0.1, val / 255);
    });
    setFrequencies(newFreqs);

    // Kirim event beat HANYA saat kick terjadi (dibatasi 180ms agar cursor tetap 60fps bebas lag!)
    const now = performance.now();
    if (isKick && now - lastBeatTimeRef.current > 180) {
      lastBeatTimeRef.current = now;
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("music-beat", {
            detail: {
              isPlaying: true,
              isBeat: true,
              bassLevel: currentBass,
            },
          })
        );
      }
    }

    animationFrameRef.current = requestAnimationFrame(updateAudioAnalysis);
  }, [isPlaying]);

  // Efek loop requestAnimationFrame
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("music-play-state", {
          detail: { isPlaying },
        })
      );
    }

    if (isPlaying) {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
      animationFrameRef.current = requestAnimationFrame(updateAudioAnalysis);
    } else {
      setIsBeat(false);
      setBassLevel(0);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, updateAudioAnalysis]);

  // Handle Play / Pause
  const togglePlay = async () => {
    if (!audioRef.current) return;

    setupAudioContext();

    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio playback error:", err);
      }
    }
  };

  // Skip waktu (Forward / Rewind)
  const skipTime = (seconds: number) => {
    if (!audioRef.current) return;
    const maxDur = Math.min(40, duration);
    const newTime = Math.max(0, Math.min(maxDur, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Seek bar klik
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const maxDur = Math.min(40, duration);
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * maxDur;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const maxDuration = Math.min(40, duration);
  const progress = maxDuration > 0 ? currentTime / maxDuration : 0;

  return (
    <div className="relative w-full max-w-[480px] mx-auto select-none">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        loop={isRepeat}
        muted={isMuted}
        onTimeUpdate={() => {
          if (audioRef.current) {
            const cur = audioRef.current.currentTime;
            if (cur >= 40) {
              if (isRepeat) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
                audioRef.current.play();
              } else {
                audioRef.current.pause();
                audioRef.current.currentTime = 40;
                setCurrentTime(40);
                setIsPlaying(false);
              }
            } else {
              setCurrentTime(cur);
            }
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && !isNaN(audioRef.current.duration)) {
            setDuration(Math.min(40, audioRef.current.duration));
          } else {
            setDuration(40);
          }
        }}
        onEnded={() => {
          if (!isRepeat) setIsPlaying(false);
        }}
        onError={() => {
          // Fallback coba path alternatif jika /assets/shelter.mp3 gagal
          if (audioRef.current && audioRef.current.src.includes("/assets/")) {
            audioRef.current.src = TRACK.fallbackSrc;
            audioRef.current.load();
          }
        }}
      >
        <source src={TRACK.src} type="audio/mpeg" />
        <source src={TRACK.fallbackSrc} type="audio/mpeg" />
      </audio>

      {/* ── Neo-Brutalist Hard Glitch Shadow Layer ── */}
      <motion.div
        animate={
          isPlaying && isBeat
            ? {
                x: [8, 14, 6, 10],
                y: [8, 12, 10, 8],
                backgroundColor: ["#A855F7", "#FF0055", "#00F0FF", "#10B981"],
              }
            : {
                x: 8,
                y: 8,
                backgroundColor: isDark ? "#A855F7" : "#FFB800",
              }
        }
        transition={{ duration: 0.12 }}
        className="absolute inset-0 rounded-[20px] sm:rounded-[24px] pointer-events-none transition-colors"
        style={{
          border: "2.5px solid #000",
        }}
      />

      {/* ── Main Music Player Card ── */}
      <motion.div
        animate={
          isPlaying && isBeat
            ? {
                x: [-2, 3, -1, 0],
                y: [1, -2, 1, 0],
              }
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.1 }}
        className={`relative w-full rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 flex flex-col gap-2.5 sm:gap-3 border-[2.5px] border-black transition-colors ${
          isDark ? "bg-[#282D37] text-white" : "bg-[#FFECC7] text-[#141414]"
        }`}
        style={{
          fontFamily: "var(--font-fredoka), cursive, sans-serif",
        }}
      >
        {/* Top Header: Radio Badge & Mute Toggle */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white shadow-[1.5px_1.5px_0px_#000] border border-black ${
              isDark ? "bg-[#20242D]" : "bg-[#141414]"
            }`}
          >
            <motion.div
              animate={isPlaying ? { scale: [1, 1.35, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <Radio size={12} className="text-[#22C55E]" strokeWidth={2.5} />
            </motion.div>
            FM 88.7 SHELTER RADIO
          </span>

          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-7 h-7 rounded-full border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] hover:scale-105 active:scale-95 transition-all cursor-pointer ${
              isDark ? "bg-[#353B4B]" : "bg-white"
            }`}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX size={13} strokeWidth={2.5} className="text-red-500" />
            ) : (
              <Volume2 size={13} strokeWidth={2.5} className={isDark ? "text-slate-200" : "text-neutral-800"} />
            )}
          </button>
        </div>

        {/* NOW PLAYING Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[5px] border-[1.5px] border-black shadow-[1px_1px_0px_#000] ${isDark ? "bg-[#A855F7] text-white" : "bg-[#FFD600] text-[#141414]"}`}
          >
            <motion.div
              animate={isPlaying ? { rotate: [0, 360] } : {}}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <Play size={10} className={isDark ? "fill-[#C084FC] text-[#C084FC]" : "fill-[#FF5C00] text-[#FF5C00]"} strokeWidth={2.5} />
            </motion.div>
            {isPlaying ? "NOW PLAYING" : "READY TO PLAY"}
          </span>
        </div>

        {/* Title & Artist with Beat-Reactive Glitch Effect */}
        <div className="mt-0.5 relative">
          <motion.h3
            animate={
              isPlaying && isBeat
                ? {
                    textShadow: [
                      "-2px 0px 0px #00F0FF, 2px 0px 0px #FF0055",
                      "2px -1px 0px #00F0FF, -2px 1px 0px #FF0055",
                      "none",
                    ],
                    x: [-1, 2, -1, 0],
                  }
                : { textShadow: "none", x: 0 }
            }
            transition={{ duration: 0.15 }}
            className={`text-[28px] sm:text-[34px] md:text-[38px] font-black leading-[1.05] tracking-tight transition-colors ${
              isDark ? "text-white" : "text-[#141414]"
            }`}
          >
            {TRACK.title}
          </motion.h3>

          <p
            className={`text-[13px] sm:text-[15px] font-medium mt-0.5 sm:mt-1 truncate transition-colors ${
              isDark ? "text-slate-300" : "text-[#6B7280]"
            }`}
          >
            {TRACK.artist}
          </p>
        </div>

        {/* Album Badge */}
        <div>
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[5px] border-[1.5px] border-black shadow-[1px_1px_0px_#000] ${isDark ? "bg-[#C084FC] text-white" : "bg-[#FFD600] text-[#141414]"}`}
          >
            <Music size={11} strokeWidth={2.5} className={isDark ? "text-white" : "text-[#141414]"} />
            {TRACK.album}
          </span>
        </div>

        {/* ── SEPARATE GLITCH BEAT VISUALIZER COMPONENT ── */}
        <div className="my-0.5">
          <GlitchBeatVisualizer
            isPlaying={isPlaying}
            bassLevel={bassLevel}
            isBeat={isBeat}
            frequencyData={frequencies}
          />
        </div>

        {/* Progress Bar & Timers */}
        <div className="flex flex-col gap-1.5">
          <div
            className={`w-full h-[7px] rounded-full overflow-hidden cursor-pointer border border-black/30 relative ${
              isDark ? "bg-[#353B4B]" : "bg-[#D1D5DB]"
            }`}
            onClick={handleSeek}
            title="Click to seek"
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: isPlaying && isBeat ? (isDark ? "#A855F7" : "#FF5C00") : (isDark ? "#F8FAFC" : "#141414"),
              }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.15, ease: "linear" }}
            />
          </div>
          <div className={`flex justify-between text-[11px] font-mono font-bold transition-colors ${
            isDark ? "text-slate-300" : "text-[#6B7280]"
          }`}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(maxDuration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-0.5">
          {/* Shuffle Toggle */}
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94, x: 1, y: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={() => setIsShuffle(!isShuffle)}
            aria-label="Shuffle"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-[12px] flex items-center justify-center cursor-pointer shrink-0 border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
            style={{
              backgroundColor: isShuffle ? (isDark ? "#10B981" : "#FFD600") : (isDark ? "#353B4B" : "#fff"),
            }}
          >
            <Shuffle size={16} strokeWidth={2.5} className={isDark && !isShuffle ? "text-slate-200" : "text-[#141414]"} />
          </motion.button>

          {/* Previous (-10s) */}
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94, x: 1, y: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            aria-label="Rewind 10s"
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-[12px] flex items-center justify-center cursor-pointer shrink-0 border-2 border-black shadow-[2px_2px_0px_#000] transition-colors ${
              isDark ? "bg-[#353B4B] hover:bg-[#404759]" : "bg-white hover:bg-neutral-50"
            }`}
            onClick={() => skipTime(-10)}
          >
            <SkipBack size={16} strokeWidth={2.5} className={isDark ? "fill-white text-white" : "fill-[#141414] text-[#141414]"} />
          </motion.button>

          {/* Master Play / Pause Button */}
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.92, x: 2, y: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white cursor-pointer shrink-0 border-[2.5px] border-black transition-all"
            style={{
              backgroundColor: isPlaying && isBeat ? (isDark ? "#A855F7" : "#FF5C00") : (isDark ? "#9333EA" : "#141414"),
              boxShadow: isPlaying ? (isDark ? "3px 3px 0px #A855F7" : "3px 3px 0px #FF5C00") : (isDark ? "3px 3px 0px #A855F7" : "3px 3px 0px #FFB800"),
            }}
          >
            {isPlaying ? (
              <Pause size={22} strokeWidth={2.5} className="fill-white text-white" />
            ) : (
              <Play size={22} strokeWidth={2.5} className="fill-white text-white ml-0.5" />
            )}
          </motion.button>

          {/* Next (+10s) */}
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94, x: 1, y: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            aria-label="Forward 10s"
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-[12px] flex items-center justify-center cursor-pointer shrink-0 border-2 border-black shadow-[2px_2px_0px_#000] transition-colors ${
              isDark ? "bg-[#353B4B] hover:bg-[#404759]" : "bg-white hover:bg-neutral-50"
            }`}
            onClick={() => skipTime(10)}
          >
            <SkipForward size={16} strokeWidth={2.5} className={isDark ? "fill-white text-white" : "fill-[#141414] text-[#141414]"} />
          </motion.button>

          {/* Repeat Toggle */}
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.94, x: 1, y: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={setIsRepeat.bind(null, !isRepeat)}
            aria-label="Repeat"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] sm:rounded-[12px] flex items-center justify-center cursor-pointer shrink-0 border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
            style={{
              backgroundColor: isRepeat ? (isDark ? "#9333EA" : "#C084FC") : (isDark ? "#353B4B" : "#fff"),
            }}
          >
            <Repeat
              size={16}
              strokeWidth={2.5}
              className={isRepeat ? "text-white" : (isDark ? "text-slate-200" : "text-[#141414]")}
            />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
