"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ScrambleLinesCanvas from "@/components/ScrambleLinesCanvas";

const SCRAMBLE_DURATION_MS = 1500;
const REVEAL_DURATION_MS = 1000;
const BLACK_SCREEN_MS = 350;

type IntroAnimationProps = {
  onEnter?: () => void;
};

export default function IntroAnimation({ onEnter }: IntroAnimationProps) {
  const [phase, setPhase] = useState<"black" | "intro" | "reveal" | "logo">("black");
  const isLogoPhase = phase === "logo";

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      setPhase("intro");
    }, BLACK_SCREEN_MS);

    const revealTimer = window.setTimeout(() => {
      setPhase("reveal");
    }, BLACK_SCREEN_MS + SCRAMBLE_DURATION_MS);

    const logoTimer = window.setTimeout(() => {
      setPhase("logo");
    }, BLACK_SCREEN_MS + SCRAMBLE_DURATION_MS + REVEAL_DURATION_MS);

    return () => {
      window.clearTimeout(introTimer);
      window.clearTimeout(revealTimer);
      window.clearTimeout(logoTimer);
    };
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(60,84,120,0.22),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(29,42,67,0.28),transparent_34%),linear-gradient(135deg,#020407_0%,#04070d_45%,#000000_100%)]" />

      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "black" ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.83, 0, 0.17, 1] }}
      />

      <ScrambleLinesCanvas
        active={phase !== "black"}
        reveal={phase === "reveal" || isLogoPhase}
        durationMs={SCRAMBLE_DURATION_MS}
      />

      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6 py-16 sm:px-10 md:px-14">
        <div className="relative flex w-full max-w-7xl items-center justify-center">
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-28 sm:w-28 md:h-32 md:w-32"
            initial={{ opacity: 0, scale: 1, x: 0, y: 0 }}
            animate={
              isLogoPhase
                ? {
                    opacity: [1, 1, 0],
                    scale: [2.5, 2.5, 0.6],
                    x: ["0vw", "0vw", "-25vw"],
                    y: [0, 0, "-12vh"],
                  }
                : {
                    opacity: 0,
                    scale: 1,
                    x: 0,
                    y: 0,
                  }
            }
            transition={{
              duration: 1.2,
              ease: [0.65, 0.05, 0.35, 1],
              times: [0, 0.34, 1],
            }}
          >
            <Image
              src="/assets/logo/logo-mark-2.png"
              alt="American Dream logo mark"
              fill
              priority
              className="object-contain"
            />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-px w-[34vw] max-w-[28rem] -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-white/90 to-transparent blur-[2px] md:block"
            initial={{ opacity: 0, x: "-6vw", scaleX: 0.35 }}
            animate={
              isLogoPhase
                ? { opacity: [0, 0.85, 0], x: ["-2vw", "-16vw", "-28vw"], scaleX: [0.5, 1.15, 0.75] }
                : { opacity: 0, x: "-6vw", scaleX: 0.35 }
            }
            transition={{ duration: 0.55, delay: isLogoPhase ? 0.28 : 0, ease: "easeOut" }}
            style={{ transformOrigin: "center" }}
          />

          <motion.div
            className="flex w-full justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLogoPhase ? 1 : 0 }}
            transition={{ duration: 0.4, delay: isLogoPhase ? 0.55 : 0 }}
          >
            <motion.div
              className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-12"
              initial={{ opacity: 0, y: 10 }}
              animate={
                isLogoPhase
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 10 }
              }
              transition={{
                duration: 0.7,
                delay: isLogoPhase ? 0.5 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                className="flex h-24 w-24 shrink-0 items-center justify-center sm:h-28 sm:w-28 lg:h-32 lg:w-32 lg:mt-2"
                initial={{ opacity: 0, x: "2vw", scale: 0.82 }}
                animate={
                  isLogoPhase
                    ? { opacity: 1, x: 0, scale: 1 }
                    : { opacity: 0, x: "2vw", scale: 0.82 }
                }
                transition={{
                  duration: 0.8,
                  delay: isLogoPhase ? 0.62 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src="/assets/logo/logo-mark-2.png"
                    alt="American Dream logo mark"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>

              <motion.div
                className="flex max-w-2xl flex-col items-center text-center lg:items-start lg:text-left"
                initial={{ opacity: 0, x: 100 }}
                animate={
                  isLogoPhase
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: 100 }
                }
                transition={{
                  duration: 0.95,
                  delay: isLogoPhase ? 0.72 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.h1
                  className="text-4xl font-semibold uppercase tracking-[0.18em] text-white sm:text-6xl md:text-7xl"
                  initial={{ opacity: 0, x: 60 }}
                  animate={
                    isLogoPhase
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: 60 }
                  }
                  transition={{
                    duration: 0.85,
                    delay: isLogoPhase ? 0.8 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  American Dream
                </motion.h1>

                <motion.p
                  className="mt-5 max-w-xl text-sm uppercase tracking-cinematic text-white/62 sm:text-[0.78rem]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isLogoPhase
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: isLogoPhase ? 1.05 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  A Destination Beyond Retail
                </motion.p>

                <motion.button
                  type="button"
                  onClick={onEnter}
                  className="mt-7 rounded-full border border-white/20 bg-white/8 px-7 py-3 text-xs font-medium uppercase tracking-[0.35em] text-white shadow-[0_0_40px_rgba(255,255,255,0.08)] transition hover:border-white/40 hover:bg-white/12 hover:shadow-[0_0_52px_rgba(255,255,255,0.14)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isLogoPhase
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: isLogoPhase ? 1.18 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  Enter
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
