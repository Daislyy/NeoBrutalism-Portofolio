"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full h-[82px] bg-[#FBF9F5]/90 backdrop-blur-md border-b border-black/10 flex items-center">
      <div className="w-full max-w-[1104px] mx-auto px-6 flex items-center justify-between">
        {/* avatar */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-10 h-10 rounded-lg border-2 border-black overflow-hidden bg-[#FFECC7] flex items-center justify-center shadow-[2px_2px_0px_#000]"
          >
            <Image
              src="/assets/profile-picture.jpg"
              alt="padly.dev avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-bold text-[18px] text-[#141414] leading-tight tracking-tight">
              padly.dev
            </span>
            <span className="font-semibold text-[10px] tracking-[0.15em] text-[#71717A] uppercase leading-none">
              WEB &amp; MOBILE DEVELOPER.
            </span>
          </div>
        </Link>

        {/*Navbar ceunah*/}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-semibold leading-[20px] text-[#141414] hover:text-[#FF5C00] transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF5C00] transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.08, rotate: 15 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            {isDark ? (
              <Moon size={18} strokeWidth={2.5} className="text-[#141414]" />
            ) : (
              <Sun size={18} strokeWidth={2.5} className="text-[#141414]" />
            )}
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96, x: 1, y: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            href="/cv.pdf"
            className="h-[44px] px-5 rounded-full bg-[#FFB800] border-2 border-black font-bold text-[15px] text-[#141414] flex items-center gap-2 shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            <span>Download - Cv</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </motion.a>
        </div>
      </div>
    </header>
  );
}
