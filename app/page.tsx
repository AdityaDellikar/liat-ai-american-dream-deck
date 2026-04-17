"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import IntroAnimation from "@/components/IntroAnimation";
import MenuHub from "@/components/MenuHub";
import VideoIntro from "@/components/VideoIntro";

export default function Home() {
  const [section, setSection] = useState<"intro" | "video" | "menu">("intro");

  return (
    <main className="h-screen overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        {section === "intro" ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <IntroAnimation onEnter={() => setSection("video")} />
          </motion.div>
        ) : null}

        {section === "video" ? (
          <VideoIntro key="video" onComplete={() => setSection("menu")} />
        ) : null}

        {section === "menu" ? (
          <motion.div
            key="menu"
            className="h-full"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <MenuHub />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
