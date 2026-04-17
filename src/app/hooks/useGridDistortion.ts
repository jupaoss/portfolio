import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ROWS = 12;
const COLS = 12;
const RADIUS = 220;
const MAX_PUSH = 35;

interface TileData {
  el: HTMLDivElement;
  img: HTMLImageElement;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}

/** Compute the rendered size + offset of an image under object-fit:cover logic. */
function coverDimensions(
  containerW: number,
  containerH: number,
  naturalW: number,
  naturalH: number,
) {
  const containerAspect = containerW / containerH;
  const imgAspect = naturalW / naturalH;
  let renderW: number;
  let renderH: number;
  let ox: number;
  let oy: number;

  if (imgAspect > containerAspect) {
    // Image wider than container — fill height, crop sides
    renderH = containerH;
    renderW = containerH * imgAspect;
    ox = (containerW - renderW) / 2;
    oy = 0;
  } else {
    // Image taller — fill width, crop top/bottom
    renderW = containerW;
    renderH = containerW / imgAspect;
    ox = 0;
    oy = (containerH - renderH) / 2;
  }
  return { renderW, renderH, ox, oy };
}

/**
 * Creates a grid-tile distortion effect on hover.
 * Tiles shift in the direction of mouse velocity within a proximity radius.
 * Rebuilds automatically when the container resizes (e.g. hero entry animation).
 * Desktop only — the hook no-ops when `enabled` is false.
 */
export function useGridDistortion(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    const grid = gridRef.current;
    const base = baseRef.current;
    if (!container || !grid || !base) return;

    let cancelled = false;
    let builtW = 0;
    let builtH = 0;
    let teardownBuild: (() => void) | null = null;

    const mouse = { x: 0, y: 0 };
    const prev = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    let isHover = false;
    let tiles: TileData[] = [];
    let tileW = 0;
    let tileH = 0;

    const animate = () => {
      if (isHover) {
        velocity.x += (mouse.x - prev.x) * 0.12;
        velocity.y += (mouse.y - prev.y) * 0.12;
        prev.x += velocity.x * 0.6;
        prev.y += velocity.y * 0.6;
        velocity.x *= 0.85;
        velocity.y *= 0.85;
      }

      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        const cx = t.x * tileW + tileW / 2;
        const cy = t.y * tileH + tileH / 2;
        const dx = mouse.x - cx;
        const dy = mouse.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let force = 0;
        if (dist < RADIUS && isHover) {
          force = 1 - dist / RADIUS;
        }

        const targetX = velocity.x * force * MAX_PUSH * 0.1;
        const targetY = velocity.y * force * MAX_PUSH * 0.1;

        t.offsetX += (targetX - t.offsetX) * 0.12;
        t.offsetY += (targetY - t.offsetY) * 0.12;

        gsap.set(t.img, { x: t.offsetX, y: t.offsetY });
      }
    };

    const build = () => {
      if (cancelled) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width < 2 || height < 2) return;

      const natW = base.naturalWidth;
      const natH = base.naturalHeight;
      if (natW === 0 || natH === 0) return;

      // Skip rebuild if size hasn't meaningfully changed (within 1px)
      if (Math.abs(width - builtW) < 1 && Math.abs(height - builtH) < 1) return;

      // Tear down previous tiles
      teardownTiles();

      builtW = width;
      builtH = height;

      const { renderW, renderH, ox, oy } = coverDimensions(width, height, natW, natH);

      tileW = width / COLS;
      tileH = height / ROWS;
      tiles = [];

      base.style.visibility = 'hidden';

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const tile = document.createElement('div');
          tile.style.cssText = `position:absolute;overflow:hidden;width:${tileW}px;height:${tileH}px;left:${x * tileW}px;top:${y * tileH}px;`;

          const img = document.createElement('img');
          img.src = base.src;
          img.draggable = false;
          img.style.cssText = `position:absolute;width:${renderW}px;height:${renderH}px;left:${ox - x * tileW}px;top:${oy - y * tileH}px;pointer-events:none;`;

          tile.appendChild(img);
          grid.appendChild(tile);
          tiles.push({ el: tile, img, x, y, offsetX: 0, offsetY: 0 });
        }
      }
    };

    const teardownTiles = () => {
      tiles = [];
      while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
      }
    };

    const onEnter = (e: MouseEvent) => {
      isHover = true;
      const bounds = container.getBoundingClientRect();
      mouse.x = e.clientX - bounds.left;
      mouse.y = e.clientY - bounds.top;
      prev.x = mouse.x;
      prev.y = mouse.y;
      velocity.x = 0;
      velocity.y = 0;
    };

    const onMove = (e: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      mouse.x = e.clientX - bounds.left;
      mouse.y = e.clientY - bounds.top;
    };

    const onLeave = () => {
      isHover = false;
    };

    // Attempt initial build once image is ready
    const tryBuild = () => {
      if (base.naturalWidth > 0 && base.naturalHeight > 0) {
        build();
      }
    };

    // ResizeObserver rebuilds the grid when the container settles to final size
    const ro = new ResizeObserver(() => tryBuild());
    ro.observe(container);

    // If the image is already loaded, build immediately; otherwise wait for load
    if (base.naturalWidth > 0) {
      build();
    } else {
      base.addEventListener('load', tryBuild, { once: true });
    }

    gsap.ticker.add(animate);
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      cancelled = true;
      ro.disconnect();
      gsap.ticker.remove(animate);
      base.removeEventListener('load', tryBuild);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      teardownTiles();
      base.style.visibility = '';
    };
  }, [enabled]);

  return { containerRef, gridRef, baseRef };
}
