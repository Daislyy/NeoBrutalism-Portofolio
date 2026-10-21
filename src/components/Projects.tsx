"use client";

import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  imageBg: string;
  githubUrl: string;
  demoUrl?: string;
}

const projects: Project[] = [
  {
    id: "01",
    title: "Panchiko Library",
    category: "LIBRARY MANAGEMENT WEB",
    description:
      "A modern digital library and book catalog system built with Next.js, Tailwind CSS, and MySQL2. Features book catalog exploration, borrowing records, categorization, and efficient relational database management.",
    tags: ["Next.js 14", "Tailwind.css", "MySQL2"],
    image: "/assets/panchiko.png",
    imageBg: "#2B2D31",
    githubUrl: "https://github.com/Daislyy/Panchiko-Library",
  },
  {
    id: "02",
    title: "KlesiChat",
    category: "REALTIME CHAT APPLICATION",
    description:
      "A lightning-fast real-time chat web application built with React, TypeScript, and Supabase. Features live messaging, secure authentication, channel management, and smooth responsive UI.",
    tags: ["React.js", "Tailwind.css", "Supabase"],
    image: "/assets/klesichat.png",
    imageBg: "#000000",
    githubUrl: "https://github.com/Daislyy/KlesiChat",
    demoUrl: "https://klesichat.netlify.app/",
  },
  {
    id: "03",
    title: "KlesiService",
    category: "COMMUNITY COMPLAINT MANAGEMENT SYSTEM",
    description:
      "A community complaint management application designed to simplify reporting public issues. Allows citizens to submit complaints with evidence and track status, backed by an admin verification dashboard.",
    tags: ["Next.js 14", "Express.js", "MySQL2"],
    image: "/assets/klesiservice.jpg",
    imageBg: "#1e50ff",
    githubUrl: "https://github.com/Daislyy/KlesiService",
  },
];

export default function Projects() {
  const { isDark } = useTheme();

  return (
    <section
      id="projects"
      className="w-full py-16 sm:py-24"
      style={{ fontFamily: "var(--font-fredoka), cursive, sans-serif" }}
    >
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 transition-colors ${
            isDark ? "text-white" : "text-black"
          }`}>
            See The Projects
          </h2>
          <p className={`text-sm sm:text-base font-normal leading-relaxed transition-colors ${
            isDark ? "text-slate-300" : "text-neutral-600"
          }`}>
            A curated selection of web apps, tools, and platforms I&apos;ve engineered
          </p>
        </motion.div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className={`group border-2 border-black rounded-[24px] p-5 sm:p-6 shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between ${
                isDark ? "bg-[#282D37] text-white" : "bg-white text-black"
              }`}
            >
              <div>
                {/* Banner Thumbnail */}
                <div
                  className="w-full aspect-[16/10] rounded-[16px] border-2 border-black mb-5 overflow-hidden flex items-center justify-center p-4 relative"
                  style={{ backgroundColor: project.imageBg }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={320}
                      height={200}
                      unoptimized
                      className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-200"
                      priority={index === 0}
                    />
                  </div>
                </div>

                {/* Eyebrow Category */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isDark ? "bg-[#A855F7]" : "bg-[#FF5C00]"}`} />
                  <span className={`font-mono font-bold text-[11px] tracking-wider uppercase truncate transition-colors ${
                    isDark ? "text-slate-300" : "text-neutral-500"
                  }`}>
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 tracking-tight transition-colors ${
                  isDark ? "text-white" : "text-black"
                }`}>
                  {project.title}
                </h3>

                {/* Description */}
                <p className={`text-[13px] sm:text-[13.5px] font-normal leading-relaxed mb-5 transition-colors ${
                  isDark ? "text-slate-300" : "text-neutral-600"
                }`}>
                  {project.description}
                </p>
              </div>

              <div>
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 text-[11px] font-mono font-bold border border-black rounded-[6px] transition-colors ${
                        isDark ? "bg-[#323846] text-slate-200" : "bg-[#F4F4F5] text-neutral-800"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View Project Button */}
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 font-bold text-sm rounded-[12px] border border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center justify-center gap-2 select-none ${
                    isDark
                      ? "bg-[#F8FAFC] text-black hover:bg-white"
                      : "bg-black text-white hover:bg-neutral-800"
                  }`}
                >
                  <span>View Project</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* see all projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 sm:mt-16 flex justify-center"
        >
          <a
            href="https://github.com/Daislyy"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base rounded-full border-[2.5px] border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 select-none font-extrabold ${isDark ? "bg-[#A855F7] hover:bg-[#9333EA] active:bg-[#7E22CE] text-white" : "bg-[#FFB800] hover:bg-[#FFC700] active:bg-[#FFA500] text-black"}`}
          >
            <span>See All Projects on GitHub</span>
            <ArrowUpRight size={18} strokeWidth={3} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
