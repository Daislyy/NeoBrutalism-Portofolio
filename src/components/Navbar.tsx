"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
          <div className="w-10 h-10 rounded-lg border-2 border-black overflow-hidden bg-[#FFECC7] flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <Image
              src="/assets/profile-picture.jpg"
              alt="padly.dev avatar"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
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
              className="text-[14px] font-semibold leading-[20px] text-[#141414] hover:text-[#FF5C00] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-[#141414]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          </button>

          <a
            href="/cv.pdf"
            className="h-[44px] px-5 rounded-full bg-[#FFB800] border-2 border-black font-bold text-[15px] text-[#141414] flex items-center gap-1.5 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <span>Download - Cv</span>
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
