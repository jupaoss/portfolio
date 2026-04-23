import { useRef, useEffect } from "react";
import svgPaths from "../../../graphic-assets/headerPaths";

// Canvas-based port of the glitch effect.
// Previous DOM version used 12×24×4 = 1,152 SVG elements + 1,152 gsap.set() calls/frame.
// This version uses 1 canvas element + drawImage() clipping — GPU-accelerated, no DOM overhead.

const ROWS = 8;
const COLS = 16;
const EASE = 0.03;
const VEL_EASE = 0.04;
const RADIUS = 160;
const MAX_PUSH = 6;

const LAYERS = [
  { fill: "white",   opacity: 1,    blend: "source-over" as GlobalCompositeOperation, mult: 1.0   },
  { fill: "#E6E791", opacity: 0.12, blend: "screen"      as GlobalCompositeOperation, mult: 1.015 },
  { fill: "#E381E8", opacity: 0.12, blend: "screen"      as GlobalCompositeOperation, mult: 0.985 },
  { fill: "#8BE5E4", opacity: 0.12, blend: "screen"      as GlobalCompositeOperation, mult: 1.01  },
];

function svgDataURL(fill: string, w: number, h: number): string {
  const xml =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 59 19">` +
    `<path d="${svgPaths.p79ef5c0}" fill="${fill}" fill-rule="evenodd" clip-rule="evenodd"/>` +
    `<path d="${svgPaths.p3f2ef180}" fill="${fill}"/>` +
    `<path d="${svgPaths.p35174f00}" fill="${fill}"/>` +
    `<path d="${svgPaths.p23e9dd00}" fill="${fill}"/>` +
    `<path d="${svgPaths.p37f5c380}" fill="${fill}"/>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

interface GlitchLogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export function GlitchLogo({ className = "", style }: GlitchLogoProps) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap   = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let raf: number | null = null;
    let alive = true;
    // Indirection so onEnter can restart the loop even though tick is defined inside setup()
    let startLoop: (() => void) | null = null;

    // Mouse state lives outside setup() so handlers can be added synchronously
    const mouse = { x: 0, y: 0 };
    const prev  = { x: 0, y: 0 };
    const vel   = { x: 0, y: 0 };
    let hover = false;

    const onEnter = (e: MouseEvent) => {
      hover = true;
      const b = wrap.getBoundingClientRect();
      mouse.x = e.clientX - b.left; mouse.y = e.clientY - b.top;
      prev.x = mouse.x;             prev.y = mouse.y;
      vel.x = 0;                    vel.y = 0;
      // Restart loop if it stopped while idle
      if (!raf && alive) startLoop?.();
    };
    const onMove  = (e: MouseEvent) => {
      const b = wrap.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    };
    const onLeave = () => { hover = false; };

    wrap.addEventListener("mouseenter", onEnter);
    wrap.addEventListener("mousemove",  onMove);
    wrap.addEventListener("mouseleave", onLeave);

    const setup = async () => {
      if (raf) { cancelAnimationFrame(raf); raf = null; }

      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      if (!w || !h) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);

      const tileW = w / COLS;
      const tileH = h / ROWS;
      const offsets = Array.from({ length: ROWS * COLS }, () => ({ x: 0, y: 0 }));

      const imgs = await Promise.all(LAYERS.map(l => loadImage(svgDataURL(l.fill, w, h))));
      if (!alive) return;

      const tick = () => {
        if (!alive) return;

        if (hover) {
          vel.x += (mouse.x - prev.x) * VEL_EASE;
          vel.y += (mouse.y - prev.y) * VEL_EASE;
          prev.x += vel.x;
          prev.y += vel.y;
          vel.x *= 0.94;
          vel.y *= 0.94;
        }

        // Black fill so screen-blend color layers produce correct chromatic fringing
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, w, h);

        // active = true while hovering OR while any tile is still settling back to rest
        let active = hover;

        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            const i   = row * COLS + col;
            const tx  = col * tileW;
            const ty  = row * tileH;
            const dist  = Math.hypot(mouse.x - (tx + tileW / 2), mouse.y - (ty + tileH / 2));
            const force = dist < RADIUS && hover ? 1 - dist / RADIUS : 0;

            offsets[i].x += (vel.x * force * MAX_PUSH - offsets[i].x) * EASE;
            offsets[i].y += (vel.y * force * MAX_PUSH - offsets[i].y) * EASE;

            if (!active && (Math.abs(offsets[i].x) > 0.05 || Math.abs(offsets[i].y) > 0.05)) {
              active = true;
            }

            const ox = offsets[i].x;
            const oy = offsets[i].y;

            ctx.save();
            ctx.beginPath();
            ctx.rect(tx, ty, tileW, tileH);
            ctx.clip();

            for (let li = 0; li < LAYERS.length; li++) {
              ctx.globalCompositeOperation = LAYERS[li].blend;
              ctx.globalAlpha = LAYERS[li].opacity;
              ctx.drawImage(imgs[li], ox * LAYERS[li].mult, oy * LAYERS[li].mult, w, h);
            }

            ctx.restore();
          }
        }

        // Keep looping only while something is moving; stop when fully settled
        if (active) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = null;
        }
      };

      startLoop = () => { if (!raf && alive) raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    };

    setup();

    // Rebuild on container resize (e.g. window resize changes logo width)
    const ro = new ResizeObserver(setup);
    ro.observe(wrap);

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("mouseenter", onEnter);
      wrap.removeEventListener("mousemove",  onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {/* Hidden SVG establishes container height via aspect ratio — no layout cost */}
      <svg viewBox="0 0 59 19" aria-hidden="true"
        style={{ width: "100%", height: "auto", display: "block", visibility: "hidden" }} />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, display: "block" }} />
    </div>
  );
}
