"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import MusicPlayer from "./MusicPlayer";
import { useTheme } from "@/context/ThemeContext";

export default function Hero() {
  const { isDark } = useTheme();

  return (
    <section
      id="home"
      className="w-full min-h-[calc(100vh-76px)] sm:min-h-[calc(100vh-82px)] flex items-center px-4 sm:px-10 lg:px-[88px] pt-6 sm:pt-8 pb-16 sm:pb-24 overflow-hidden"
    >
      <div className="w-full max-w-[1104px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Column Content */}
        <motion.div
          className="flex flex-col gap-6"
          style={{ fontFamily: "var(--font-fredoka), cursive, sans-serif" }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
              },
            },
          }}
        >
          <div className="flex flex-col gap-1">
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 260, damping: 20 },
                },
              }}
              className={`text-[48px] leading-[1.15] tracking-tight transition-colors ${
                isDark ? "text-white" : "text-[#000000]"
              }`}
              style={{
                fontFamily: "var(--font-fredoka), cursive, sans-serif",
                fontWeight: 700,
              }}
            >
              Website{" "}
              <span className={`${isDark ? "text-[#A855F7]" : "text-[#FF5C00]"}`} style={{ fontWeight: 700 }}>
                Portofolio
              </span>
            </motion.h1>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8, rotate: -3 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 280,
                    damping: 18,
                  },
                },
              }}
              whileHover={{ scale: 1.03, rotate: 1 }}
              className="flex items-center gap-0 mt-0 cursor-default self-start"
            >
              <span
                className={`text-[48px] leading-[1.15] px-3 py-0.5 rounded-[8px] inline-block shadow-[3px_3px_0px_#000] border-[2.5px] border-black transition-colors ${isDark ? "bg-[#A855F7] text-white" : "bg-[#FFB800] text-[#141414]"}`}
                style={{
                  fontFamily: "var(--font-fredoka), cursive, sans-serif",
                  fontWeight: 700,
                }}
              >
                Padly Padilah
              </span>
            </motion.div>
          </div>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
            className={`text-[17px] leading-[26px] max-w-[480px] transition-colors ${
              isDark ? "text-slate-300" : "text-[#374151]"
            }`}
            style={{
              fontFamily: "var(--font-fredoka), cursive, sans-serif",
              fontWeight: 400,
            }}
          >
            I build whatever I enjoy creating, love Music &amp; Model-kits &amp;
            Audiophile
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 260, damping: 20 },
              },
            }}
            className="flex flex-wrap gap-4 mt-2"
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96, x: 2, y: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Link
                href="#projects"
                className={`h-[52px] px-7 rounded-full flex items-center gap-2 text-[16px] text-white shadow-[3px_3px_0px_#000] border-2 border-black transition-colors ${isDark ? "bg-[#9333EA] hover:bg-[#7E22CE]" : "bg-[#FF5C00] hover:bg-[#FF4500]"}`}
                style={{
                  fontFamily: "var(--font-fredoka), cursive, sans-serif",
                  fontWeight: 600,
                }}
              >
                <span>View Projects</span>
                <ArrowDown size={18} strokeWidth={2.5} />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96, x: 2, y: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Link
                href="#contact"
                className={`h-[52px] px-7 rounded-full flex items-center gap-2 text-[16px] border-2 border-black shadow-[3px_3px_0px_#000] transition-colors ${
                  isDark
                    ? "bg-[#282D37] text-white hover:bg-[#323846]"
                    : "bg-white text-[#141414] hover:bg-neutral-50"
                }`}
                style={{
                  fontFamily: "var(--font-fredoka), cursive, sans-serif",
                  fontWeight: 600,
                }}
              >
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Music Player with subtle ambient float */}
        <motion.div
          className="w-full flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            },
          }}
        >
          <motion.div
            className="w-full max-w-[480px] flex justify-center"
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <MusicPlayer />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
