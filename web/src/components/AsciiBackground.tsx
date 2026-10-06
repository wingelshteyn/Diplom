import { useEffect, useRef } from "react";

const PALETTE = "   ...:::---+++***◦◦••▢▣";
const CELL = 16;
const FONT_SIZE = 13;

export function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let alive = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `500 ${FONT_SIZE}px ${getComputedStyle(document.documentElement).getPropertyValue("--mono") || "JetBrains Mono, monospace"}`;
      ctx.textBaseline = "top";
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const n =
            (Math.sin(c * 0.18 + t) +
              Math.sin(r * 0.24 - t * 0.7) +
              Math.sin((c + r) * 0.12 + t * 0.45) +
              Math.sin(Math.hypot(c - cols * 0.5, r - rows * 0.5) * 0.16 - t * 0.55)) /
            4;
          const v = (n + 1) / 2;
          if (v < 0.22) continue;
          const index = Math.min(PALETTE.length - 1, Math.floor(v * PALETTE.length));
          const ch = PALETTE[index];
          if (ch === " ") continue;
          const alpha = 0.08 + (v - 0.22) * 0.55;
          ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
          ctx.fillText(ch, c * CELL, r * CELL);
        }
      }
    };

    const tick = (now: number) => {
      if (!alive) return;
      draw((now / 1000) * 0.55);
      raf = requestAnimationFrame(tick);
    };

    resize();
    if (reduce) draw(1.2);
    else raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ascii-bg" aria-hidden="true" />;
}
