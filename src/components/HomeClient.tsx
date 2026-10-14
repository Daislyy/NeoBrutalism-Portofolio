"use client";

import { useState } from "react";
import TerminalLoader from "@/components/TerminalLoader";
import SnakeCursor from "@/components/SnakeCursor";
import EasterEggSnake from "@/components/EasterEggSnake";
import DragonRoar from "@/components/DragonRoar";
import FullScreenGlitch from "@/components/FullScreenGlitch";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Trajectory from "@/components/Trajectory";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Hide native cursor only on hover-capable (non-touch) devices */}
      <style>{`@media (hover: hover) and (pointer: fine) { * { cursor: none !important; } }`}</style>

      <SnakeCursor />
      <EasterEggSnake />
      <DragonRoar />
      <FullScreenGlitch />

      <main style={{ backgroundColor: "#FBF9F5" }}>
        {isLoading && <TerminalLoader onComplete={() => setIsLoading(false)} />}
        <Navbar />
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Trajectory />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
