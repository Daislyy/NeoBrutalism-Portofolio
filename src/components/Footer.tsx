"use client";

import Image from "next/image";
import Link from "next/link";
import { SiGithub, SiDiscord, SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";

const navLinks = [
  { label: "About Padly", href: "#about" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/Daislyy",
    icon: SiGithub,
  },
  {
    name: "Discord",
    href: "https://discord.com/users/902753975521132635",
    icon: SiDiscord,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/azuto.mizanami/",
    icon: SiFacebook,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/dlyy.23_/",
    icon: SiInstagram,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@Dlyy840",
    icon: SiYoutube,
  },
];

export default function Footer() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === "#" || href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.pushState(null, "", "#home");
      return;
    }
    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (target) {
      const navOffset = 84;
      const targetPos = target.getBoundingClientRect().top + (window.scrollY ?? window.pageYOffset) - navOffset;
      window.scrollTo({
        top: Math.max(0, targetPos),
        behavior: "smooth",
      });
      history.pushState(null, "", href);
    }
  };

  return (
    <footer
      className="w-full bg-[#111215] text-white pt-8 sm:pt-10 pb-6 sm:pb-7"
      style={{ fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif" }}
    >
      <div className="w-full max-w-[1040px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 pb-6 sm:pb-7">
          <div className="md:col-span-5 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <Image
                src="/assets/profile-picture.png"
                alt="padly.dev avatar"
                width={30}
                height={30}
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
              />
              <span className="font-bold text-[16px] text-white tracking-tight">
                padly.dev
              </span>
            </div>

            <p className="text-[12px] leading-[1.65] text-[#9CA3AF] font-normal max-w-[340px]">
              Software engineering student at SMK Taruna Bhakti Depok, focusing on full-stack web architectures, reactive interfaces, and scalable backend systems.
            </p>
          </div>

          <div className="md:col-span-3 md:pl-2 flex flex-col gap-1.5">
            <span className="font-mono font-bold text-[10.5px] tracking-[0.2em] text-[#9CA3AF] uppercase mb-1">
              NAVIGATION
            </span>
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="text-[13px] text-[#E5E7EB] hover:text-[#FF5C00] transition-colors font-medium inline-block cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 flex flex-col gap-1.5">
            <span className="font-mono font-bold text-[10.5px] tracking-[0.2em] text-[#9CA3AF] uppercase mb-1">
              CONNECT ONLINE
            </span>
            <div className="grid grid-cols-2 gap-2 max-w-[230px]">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[32px] px-2.5 rounded-[7px] bg-[#1E2024] hover:bg-[#282B31] border border-[#2F333A] text-white flex items-center gap-2 transition-all hover:translate-y-[-1px] cursor-pointer"
                  >
                    <IconComponent size={13} className="shrink-0 text-white" />
                    <span className="font-mono text-[11px] font-medium text-[#E5E7EB] tracking-tight">
                      {social.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full border-t border-[#1F2228] pt-4 sm:pt-5">
          <p className="font-mono text-[11px] text-[#6B7280]">
            &copy; 2026 Padly Padilah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
