"use client";

import { useEffect, useRef } from "react";

type ScrambleLinesCanvasProps = {
  active: boolean;
  reveal: boolean;
  durationMs: number;
};

type Stroke = {
  x: number;
  y: number;
  length: number;
  angle: number;
  opacity: number;
  width: number;
  driftX: number;
  driftY: number;
  wobble: number;
  side: -1 | 1;
  centerBias: number;
  disperseY: number;
  offscreenTravel: number;
};

const STROKE_COUNT = 560;
const REVEAL_DURATION_MS = 1500;

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function phaseEnvelope(progress: number) {
  if (progress <= 0.32) {
    return easeOutCubic(progress / 0.32);
  }

  if (progress <= 1) {
    return 1;
  }

  return 1;
}

export default function ScrambleLinesCanvas({
  active,
  reveal,
  durationMs,
}: ScrambleLinesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const revealStartRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const createStrokes = (width: number, height: number) => {
      const padding = Math.max(width, height) * 0.18;
      const centerX = width / 2;

      strokesRef.current = Array.from({ length: STROKE_COUNT }, () => {
        const x = -padding + Math.random() * (width + padding * 2);
        const side: -1 | 1 = x < centerX ? -1 : 1;
        const centerDistance = Math.abs(x - centerX) / centerX;
        const centerBias = 1 - clamp(centerDistance, 0, 1);

        return {
          x,
          y: -padding + Math.random() * (height + padding * 2),
          length: Math.max(width, height) * (0.14 + Math.random() * 0.28),
          angle: Math.random() * Math.PI * 2,
          opacity: 0.28 + Math.random() * 0.68,
          width: 0.9 + Math.random() * 2.6,
          driftX: (Math.random() - 0.5) * 10,
          driftY: (Math.random() - 0.5) * 10,
          wobble: 0.2 + Math.random() * 1.2,
          side,
          centerBias,
          disperseY: (Math.random() - 0.5) * (70 + Math.random() * 90),
          offscreenTravel: width * (0.34 + Math.random() * 0.32),
        };
      });
    };

    const resize = () => {
      const { innerWidth, innerHeight, devicePixelRatio } = window;
      const ratio = Math.min(devicePixelRatio || 1, 2);

      canvas.width = innerWidth * ratio;
      canvas.height = innerHeight * ratio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      createStrokes(innerWidth, innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (time: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      if (startRef.current === null && active) {
        startRef.current = time;
      }

      if (reveal && revealStartRef.current === null) {
        revealStartRef.current = time;
      }

      context.clearRect(0, 0, width, height);

      const elapsed = startRef.current === null ? 0 : time - startRef.current;
      const revealElapsed = revealStartRef.current === null ? 0 : time - revealStartRef.current;
      const revealProgress = reveal ? clamp(revealElapsed / REVEAL_DURATION_MS, 0, 1) : 0;
      const activeProgress = active ? clamp(elapsed / durationMs, 0, 1) : 0;
      const envelope = active ? phaseEnvelope(activeProgress) : 0;
      const splitProgress = reveal ? easeOutCubic(revealProgress) : 0;

      strokesRef.current.forEach((stroke, index) => {
        const pulsing = Math.sin(time * 0.0015 * stroke.wobble + index * 0.37) * 0.5 + 0.5;
        const driftScale = active ? 1 : 0.25;
        const splitStrength = splitProgress * (0.7 + stroke.centerBias * 0.8);
        const outwardOffset = stroke.side * stroke.offscreenTravel * splitStrength;
        const centerPush = stroke.side * centerX * 0.45 * splitProgress;
        const disperseY = stroke.disperseY * splitProgress;
        const localOpacity =
          stroke.opacity *
          (0.74 + pulsing * 0.26) *
          envelope;

        if (localOpacity <= 0.01) {
          return;
        }

        const currentX =
          stroke.x +
          stroke.driftX * pulsing * driftScale +
          outwardOffset +
          centerPush;
        const currentY =
          stroke.y +
          stroke.driftY * pulsing * driftScale +
          disperseY;
        const currentLength = stroke.length;
        const angleShift = Math.sin(time * 0.0009 + index) * 0.06 + stroke.side * splitProgress * 0.08;
        const angle = stroke.angle + angleShift;
        const endX = currentX + Math.cos(angle) * currentLength;
        const endY = currentY + Math.sin(angle) * currentLength;

        context.beginPath();
        context.moveTo(currentX, currentY);
        context.lineTo(endX, endY);
        context.strokeStyle = `rgba(255,255,255,${localOpacity.toFixed(3)})`;
        context.lineWidth = stroke.width;
        context.lineCap = "round";
        context.stroke();
      });

      frameRef.current = window.requestAnimationFrame(render);
    };

    frameRef.current = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [active, durationMs, reveal]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
}
