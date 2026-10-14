"use client";

import { useState } from "react";
import TerminalLoader from "@/components/TerminalLoader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main style={{ backgroundColor: "#FBF9F5" }}>
      {isLoading && <TerminalLoader onComplete={() => setIsLoading(false)} />}
      <Navbar />
      <Hero />
      <About />
      <TechStack />
    </main>
  );
}
