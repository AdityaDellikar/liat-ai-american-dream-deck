"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type VideoIntroProps = {
  onComplete?: () => void;
};

const AUTO_TRANSITION_MS = 7000;
const EXIT_DURATION_MS = 1000;
const AUDIO_FADE_MS = 900;

export default function VideoIntro({ onComplete }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioFadeFrameRef = useRef<number | null>(null);
  const completeTimeoutRef = useRef<number | null>(null);
  const exitingRef = useRef(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [showFirstLine, setShowFirstLine] = useState(false);
  const [showSecondLine, setShowSecondLine] = useState(false);

  useEffect(() => {
    const firstLineTimer = window.setTimeout(() => {
      setShowFirstLine(true);
    }, 1000);

    const secondLineTimer = window.setTimeout(() => {
      setShowSecondLine(true);
    }, 2500);

    const autoTransitionTimer = window.setTimeout(() => {
      triggerComplete();
    }, AUTO_TRANSITION_MS);

    return () => {
      window.clearTimeout(firstLineTimer);
      window.clearTimeout(secondLineTimer);
      window.clearTimeout(autoTransitionTimer);
      if (completeTimeoutRef.current !== null) {
        window.clearTimeout(completeTimeoutRef.current);
      }
      if (audioFadeFrameRef.current !== null) {
        window.cancelAnimationFrame(audioFadeFrameRef.current);
      }
    };
  }, [onComplete]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const fadeAudioTo = (targetVolume: number) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (audioFadeFrameRef.current !== null) {
      window.cancelAnimationFrame(audioFadeFrameRef.current);
    }

    const startVolume = video.volume;
    const startTime = performance.now();

    const updateVolume = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / AUDIO_FADE_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      video.volume = startVolume + (targetVolume - startVolume) * eased;

      if (progress < 1) {
        audioFadeFrameRef.current = window.requestAnimationFrame(updateVolume);
      } else {
        audioFadeFrameRef.current = null;
      }
    };

    audioFadeFrameRef.current = window.requestAnimationFrame(updateVolume);
  };

  const triggerComplete = () => {
    if (exitingRef.current) {
      return;
    }

    exitingRef.current = true;
    setIsExiting(true);
    setShowFirstLine(false);
    setShowSecondLine(false);

    completeTimeoutRef.current = window.setTimeout(() => {
      onComplete?.();
    }, EXIT_DURATION_MS);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) {
      setIsMuted((current) => !current);
      return;
    }

    if (isMuted) {
      video.muted = false;
      video.volume = 0;
      setIsMuted(false);
      fadeAudioTo(1);
      return;
    }

    if (audioFadeFrameRef.current !== null) {
      window.cancelAnimationFrame(audioFadeFrameRef.current);
      audioFadeFrameRef.current = null;
    }

    video.volume = 0;
    video.muted = true;
    setIsMuted(true);
  };

  return (
    <motion.section
      className="relative h-screen w-full overflow-hidden bg-black"
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        scale: isExiting ? 1.1 : 1,
        filter: isExiting ? "blur(8px)" : "blur(0px)",
      }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: isExiting ? 1 : 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/video/intro.mp4"
        autoPlay
        muted={isMuted}
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,6,12,0.78)_0%,rgba(3,6,12,0.22)_28%,rgba(3,6,12,0.14)_62%,rgba(3,6,12,0.62)_100%)]" />
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0.82 : 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <div className="max-w-5xl">
          <motion.p
            className="text-3xl font-semibold uppercase tracking-[0.22em] text-white sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: showFirstLine && !isExiting ? 1 : 0,
              y: showFirstLine && !isExiting ? 0 : -40,
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            This Is Not A Mall
          </motion.p>

          <motion.p
            className="mt-6 text-sm font-medium uppercase tracking-[0.42em] text-white/74 sm:text-base md:text-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: showSecondLine && !isExiting ? 1 : 0,
              y: showSecondLine && !isExiting ? 0 : -40,
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            A New Era Of Destination
          </motion.p>
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={toggleMute}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.22em] text-white backdrop-blur-md transition hover:border-white/35 hover:bg-white/20 hover:shadow-[0_0_32px_rgba(255,255,255,0.12)]"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={triggerComplete}
            className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm uppercase tracking-[0.22em] text-white backdrop-blur-md transition hover:border-white/35 hover:bg-white/20 hover:shadow-[0_0_32px_rgba(255,255,255,0.12)]"
          >
            Skip Intro
          </button>
        </div>
      </div>
    </motion.section>
  );
}
