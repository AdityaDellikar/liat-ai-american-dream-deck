"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useMemo, useState } from "react";

type MenuTitle =
  | "Entertainment"
  | "Retail"
  | "Dining"
  | "Events"
  | "Attractions";

type MenuItem = {
  title: MenuTitle;
  position: { x: number; y: number };
  accent: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    title: "Entertainment",
    position: { x: 0, y: 150 },
    accent: "from-[#15253f]/90 via-[#314d76]/35 to-[#05070d]/90",
  },
  {
    title: "Retail",
    position: { x: -250, y: 0 },
    accent: "from-[#291a17]/90 via-[#6d3e2d]/35 to-[#05070d]/90",
  },
  {
    title: "Dining",
    position: { x: 250, y: 0 },
    accent: "from-[#16251c]/90 via-[#356f56]/35 to-[#05070d]/90",
  },
  {
    title: "Events",
    position: { x: 0, y: -150 },
    accent: "from-[#241629]/90 via-[#5f3570]/35 to-[#05070d]/90",
  },
  {
    title: "Attractions",
    position: { x: 0, y: 300 },
    accent: "from-[#172934]/90 via-[#2f6f8f]/35 to-[#05070d]/90",
  },
];

const CARD_WIDTH = 320;
const CARD_HEIGHT = 208;

const ICONS = {
  Entertainment:
    "https://lottie.host/fb247a88-3116-4528-8f8a-14dd9710ee64/P4vAQPL4tI.lottie",
  Retail:
    "https://lottie.host/68b3c271-22d1-4c78-bc4b-59c4e3d10094/1LJJI8CnFw.lottie",
  Dining:
    "https://lottie.host/ae2583c4-07ad-4ddc-b682-5ecb99b0d128/IaWgjbwsQX.lottie",
  Events:
    "https://lottie.host/e092244f-4295-4f31-9eb2-979e2b2c0e49/eNPZPnu4je.lottie",
  Attractions:
    "https://lottie.host/a3cc4602-7a27-4b5d-9af2-f028a7ea8c22/cpQUyXUJIR.lottie",
} as const;

const SLIDES = {
  Events: [
    "/assets/slides/events/animal-crossing.jpg",
    "/assets/slides/events/legoland.jpg",
    "/assets/slides/events/inclusion.jpg",
  ],
  Retail: [
    "/assets/slides/retail/gucci.jpg",
    "/assets/slides/retail/balenciaga.jpg",
    "/assets/slides/retail/hermes.jpg",
  ],
  Dining: [
    "/assets/slides/dining/carpaccio.jpg",
    "/assets/slides/dining/sushi.jpg",
    "/assets/slides/dining/mrbeast.jpg",
  ],
  Attractions: [
    "/assets/slides/attractions/nickelodeon.jpg",
    "/assets/slides/attractions/dreamworks.jpg",
    "/assets/slides/attractions/bigsnow.jpg",
  ],
  Entertainment: [
    "/assets/slides/entertainment/escapegame.jpg",
    "/assets/slides/entertainment/minigolf.jpg",
    "/assets/slides/entertainment/mirrormaze.jpg",
  ],
} as const;

export default function MenuHub() {
  const [hoveredTitle, setHoveredTitle] = useState<MenuTitle | null>(null);
  const [expandedCard, setExpandedCard] = useState<MenuTitle | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });

  const expandedItem = useMemo(
    () => MENU_ITEMS.find((item) => item.title === expandedCard) ?? null,
    [expandedCard],
  );

  const slideshowImages = useMemo(() => {
    if (!expandedItem) {
      return [];
    }

    return SLIDES[expandedItem.title];
  }, [expandedItem]);

  useEffect(() => {
    const syncViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (expandedCard) {
        return;
      }

      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setCursorOffset({ x, y });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [expandedCard]);

  useEffect(() => {
    if (!expandedCard) {
      setSlideIndex(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % SLIDES[expandedCard].length);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [expandedCard]);

  const isCompact = viewport.width < 1024;

  const clampY = (value: number) => {
    const maxOffset = viewport.height * 0.3;
    return Math.max(-maxOffset, Math.min(maxOffset, value));
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(80,112,168,0.18),transparent_26%),radial-gradient(circle_at_80%_16%,rgba(34,73,110,0.2),transparent_28%),radial-gradient(circle_at_50%_82%,rgba(40,71,102,0.16),transparent_32%),linear-gradient(180deg,#03050a_0%,#07101a_55%,#020407_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:140px_140px]" />

      <div className="absolute left-6 top-6 z-40 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md sm:left-8 sm:top-8">
        <div className="relative h-9 w-9 opacity-75">
          <Image
            src="/assets/logo/logo-mark-2.png"
            alt="American Dream logo"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/60">
          American Dream
        </p>
      </div>

      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: hoveredTitle && !expandedCard ? 0.34 : 0.16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="absolute inset-0">
        {MENU_ITEMS.map((item, index) => {
          const isHovered = !expandedCard && hoveredTitle === item.title;
          const xBase = isCompact ? item.position.x * 0.48 : item.position.x;
          const rawY = isCompact ? item.position.y * 0.48 : item.position.y;
          const yBase = clampY(rawY);
          const parallaxX = expandedCard ? 0 : cursorOffset.x * (18 + index * 4);
          const parallaxY = expandedCard ? 0 : cursorOffset.y * (14 + index * 3);

          return (
            <motion.button
              key={item.title}
              type="button"
              disabled={Boolean(expandedCard)}
              className="absolute left-1/2 top-1/2 h-44 w-64 overflow-hidden rounded-xl border border-white/10 text-left shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm disabled:cursor-default sm:h-52 sm:w-80"
              style={{ transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{
                opacity: expandedCard ? 0.3 : 1,
                x: xBase + parallaxX - CARD_WIDTH / 2,
                y: yBase + parallaxY - CARD_HEIGHT / 2,
                scale: isHovered ? 1.1 : 1,
                zIndex: isHovered ? 30 : 10 + index,
                rotateX: expandedCard ? 0 : cursorOffset.y * -4,
                rotateY: expandedCard ? 0 : cursorOffset.x * 6,
                filter:
                  hoveredTitle && !isHovered && !expandedCard
                    ? "brightness(0.58)"
                    : isHovered
                      ? "brightness(1.15)"
                      : "brightness(0.92)",
                boxShadow: isHovered
                  ? "0 0 50px rgba(167, 211, 255, 0.18), 0 30px 80px rgba(0, 0, 0, 0.4)"
                  : "0 25px 80px rgba(0, 0, 0, 0.35)",
              }}
              transition={{
                opacity: { duration: 0.35 },
                scale: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                x: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                rotateX: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                rotateY: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                filter: { duration: 0.3 },
                boxShadow: { duration: 0.3 },
              }}
              onHoverStart={() => {
                if (!expandedCard) {
                  setHoveredTitle(item.title);
                }
              }}
              onHoverEnd={() => {
                if (!expandedCard) {
                  setHoveredTitle((current) => (current === item.title ? null : current));
                }
              }}
              onClick={() => {
                setExpandedCard(item.title);
                setSlideIndex(0);
              }}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${item.accent}`}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4 + index * 0.35,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.18,
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_28%),linear-gradient(180deg,transparent_25%,rgba(0,0,0,0.62)_100%)]" />
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(135deg,rgba(255,255,255,0.18)_0%,transparent_35%,transparent_65%,rgba(255,255,255,0.08)_100%)]" />

              <motion.div
                className="pointer-events-none absolute right-4 top-4 h-10 w-10 rounded-full border border-white/10 bg-black/25 p-1 backdrop-blur-md"
                animate={{
                  scale: isHovered ? 1.15 : 1,
                  opacity: isHovered ? 1 : 0.6,
                  rotate: isHovered ? 6 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <DotLottieReact
                  src={ICONS[item.title]}
                  autoplay={hoveredTitle === item.title}
                  loop={hoveredTitle === item.title}
                />
              </motion.div>

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/45">
                  Explore
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                  {item.title}
                </h2>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(148,196,255,0.12)_0%,transparent_62%)] blur-3xl"
        animate={{
          x: expandedCard ? 0 : cursorOffset.x * 36,
          y: expandedCard ? 0 : cursorOffset.y * 28,
          scale: hoveredTitle && !expandedCard ? 1.08 : 1,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <AnimatePresence>
        {expandedItem ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-xl sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="relative h-[75vh] w-[75vw] overflow-hidden rounded-xl border border-white/10 bg-[#05070d] shadow-[0_35px_120px_rgba(0,0,0,0.5)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${expandedItem.accent}`} />

              <AnimatePresence mode="wait">
                <motion.img
                  key={slideshowImages[slideIndex]}
                  src={slideshowImages[slideIndex]}
                  alt={`${expandedItem.title} slide ${slideIndex + 1}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_24%),linear-gradient(180deg,rgba(5,7,13,0.12)_0%,rgba(5,7,13,0.3)_45%,rgba(5,7,13,0.9)_100%)]" />

              <button
                type="button"
                onClick={() => setExpandedCard(null)}
                className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg text-white backdrop-blur-md transition hover:bg-white/20 hover:shadow-[0_0_32px_rgba(255,255,255,0.15)]"
              >
                X
              </button>

              <div className="absolute bottom-6 left-0 w-full px-8 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-white/45">
                  Discover
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-5xl">
                  {expandedItem.title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
