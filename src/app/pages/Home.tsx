import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate, MotionValue } from "motion/react";
import { gsap } from "gsap";
import { DotGrid } from "../components/DotGrid";
import { SiteHeader } from "../components/SiteHeader";
import { IntroOverlay } from "../components/IntroOverlay";
import { SiteFooter } from "../components/SiteFooter";
import { projects } from "../data/projects";
import { GridDistortionImage } from "../components/GridDistortionImage";
import svgPaths from "../../../graphic-assets/iconPaths";

const N = projects.length;
const DOWN_ARROW = "M4 8L2.26795 5H5.73205L4 8Z";
const BUFFER = 4;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

// ─── Responsive helpers ───────────────────────────────────────────────────────
function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

const CAROUSEL_ASPECT = 380 / 570; // width / height — 2:3 portrait, matches project detail hero shape
const NOMINAL_IMG_H = 570; // design baseline at 900px viewport height

function getCarouselDimensions(screenW: number, screenH: number) {
  if (screenW < 640) {
    const imgW = Math.round((screenW - 120) * 0.8);
    const imgH = Math.round(imgW / CAROUSEL_ASPECT);
    const centerX = screenW * 0.5;
    return { imgW, imgH, containerW: imgW, spacing: imgH + 80, xRadius: centerX + imgW / 2 + 80, yRadius: 0 };
  }
  // Scale proportionally with viewport height, capped at nominal. Width follows aspect ratio.
  const imgH = Math.min(Math.round(screenH * (NOMINAL_IMG_H / 900)), NOMINAL_IMG_H);
  const imgW = Math.round(imgH * CAROUSEL_ASPECT);
  const centerX = screenW * 0.5;
  // For viewports > 1024px: container scales wider proportionally, image stays at nominal size.
  const containerW = screenW > 1024
    ? Math.max(imgW, Math.min(Math.round(screenW * 0.36), 680))
    : imgW;
  return { imgW, imgH, containerW, spacing: imgH + 124, xRadius: centerX + containerW / 2 + 80, yRadius: 0 };
}

// ─── Per-item curved carousel card ────────────────────────────────────────────

interface CarouselItemProps {
  containerY: MotionValue<number>;
  virtualPos: number;
  virtualIndex: number;
  project: (typeof projects)[number];
  isCurrent: boolean;
  isReturning: boolean;
  fromHeroBounds?: { width: number; height: number } | null;
  imgW: number;
  imgH: number;
  containerW: number;
  spacing: number;
  xRadius: number;
  yRadius: number;
  isMobile: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function CarouselItem({ containerY, virtualPos, virtualIndex, project, isCurrent, isReturning, fromHeroBounds, imgW, imgH, containerW, spacing, xRadius, yRadius, isMobile, onClick }: CarouselItemProps) {
  const halfImg = imgH / 2;
  const itemTop = virtualPos * spacing - halfImg;
  const imageOffset = (containerW - imgW) / 2;

  // Once the return-from-detail animation finishes, switch to the tilt-enabled branch
  const [fromFullDone, setFromFullDone] = useState(false);

  // ─── 3-D tilt on hover ────────────────────────────────────────────────────
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tiltRef    = useRef<HTMLDivElement>(null);
  const hitRef     = useRef<HTMLDivElement>(null); // transparent zone 50px larger on every side

  useEffect(() => {
    if (!isCurrent) return;
    const wrapper = wrapperRef.current;
    const outer   = tiltRef.current;
    const hit     = hitRef.current;
    if (!wrapper || !outer || !hit) return;

    const ctx = gsap.context(() => {
      gsap.set(outer.parentElement, { perspective: 650 });

      const rotX = gsap.quickTo(outer, "rotationX", { ease: "power3", duration: 0.5 });
      const rotY = gsap.quickTo(outer, "rotationY", { ease: "power3", duration: 0.5 });

      const onMove = (e: PointerEvent) => {
        // nx/ny relative to the actual image bounds (not the extended hit area)
        const { left, top, width, height } = outer.getBoundingClientRect();
        const nx = Math.max(0, Math.min(1, (e.clientX - left) / width));
        const ny = Math.max(0, Math.min(1, (e.clientY - top)  / height));
        rotX(gsap.utils.interpolate(15, -15, ny));
        rotY(gsap.utils.interpolate(-15, 15, nx));
      };

      const onLeave = () => { rotX(0); rotY(0); };

      // wrapper receives pointermove bubbled from both the image and the extended hitRef zone
      // hitRef pointerleave fires when cursor exits the full extended area (not just the image)
      wrapper.addEventListener("pointermove", onMove);
      hit.addEventListener("pointerleave", onLeave);

      return () => {
        wrapper.removeEventListener("pointermove", onMove);
        hit.removeEventListener("pointerleave", onLeave);
      };
    }, outer);

    return () => ctx.revert();
  }, [isCurrent, fromFullDone]);

  // Softened arc: sinθ = t² keeps the card near center for most of the transition
  // and only sweeps off-screen in the last fraction — no corner entry effect.
  // xRadius still guarantees t=1 is fully outside the viewport.

  const curveX = useTransform(containerY, (v) => {
    const t = (v + virtualPos * spacing) / spacing;
    const clamped = Math.max(-3.5, Math.min(3.5, t));
    const sinTheta = Math.min(1, clamped * clamped); // t² softens the arc
    const cosTheta = Math.sqrt(Math.max(0, 1 - sinTheta * sinTheta));
    return -xRadius * (1 - cosTheta);
  });

  const curveRotate = useTransform(containerY, (v) => {
    const t = (v + virtualPos * spacing) / spacing;
    const clamped = Math.max(-3.5, Math.min(3.5, t));
    const sinTheta = Math.min(1, clamped * clamped);
    const thetaDeg = Math.asin(sinTheta) * (180 / Math.PI);
    return Math.sign(clamped) * thetaDeg * (80 / 90);
  });

  const curveScale = useTransform(containerY, (v) => {
    const t = Math.abs((v + virtualPos * spacing) / spacing);
    return Math.max(0.5, 1 - Math.min(t, 3) * 0.17);
  });

  const curveY = useTransform(containerY, (v) => {
    const t = (v + virtualPos * spacing) / spacing;
    const clamped = Math.max(-3.5, Math.min(3.5, t));
    const sinTheta = Math.sign(clamped) * Math.min(1, clamped * clamped);
    return yRadius * sinTheta;
  });


  // Full-screen return: current card shrinks from hero size to gallery card size.
  // Once fromFullDone is true the tilt-enabled branch mounts and the effect re-runs.
  const fromFull = isReturning && isCurrent && !!fromHeroBounds && !fromFullDone;
  const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const offscreenY =
    isReturning && !isCurrent
      ? (virtualPos < virtualIndex ? -1 : 1) * (window.innerHeight + 500)
      : 0;

  return (
    <motion.div
      className="absolute left-0"
      style={{
        width: containerW,
        top: itemTop,
        pointerEvents: isCurrent ? "auto" : "none",
        x: curveX,
        y: curveY,
        rotate: curveRotate,
        scale: curveScale,
        transformOrigin: "center center",
      }}
      initial={isReturning && !isCurrent ? { y: offscreenY } : false}
      animate={isReturning && !isCurrent ? { y: 0 } : undefined}
      transition={
        isReturning && !isCurrent
          ? { duration: 1.05, ease: EASE_OUT, delay: 0.18 }
          : undefined
      }
      onClick={isCurrent ? onClick : undefined}
    >
      {fromFull ? (() => {
        // Clip container: starts at hero's exact dimensions (correct screen position).
        // overflow:hidden clips the inner image horizontally.
        // Inner image: starts at natural aspect (heroH × CAROUSEL_ASPECT) so its
        // aspect ratio never changes during animation — no object-cover crop shift.
        // Both elements animate with the same curve so centering stays exact.
        const naturalW = fromHeroBounds!.height * CAROUSEL_ASPECT;
        const heroW    = fromHeroBounds!.width;
        const heroH    = fromHeroBounds!.height;
        return (
          <motion.div
            className="overflow-hidden absolute rounded-lg"
            data-gallery-image={isCurrent ? "true" : undefined}
            initial={{ width: heroW, height: heroH, y: -(heroH - imgH) / 2, marginLeft: (containerW - heroW) / 2 }}
            animate={{ width: imgW, height: imgH, y: 0, marginLeft: imageOffset }}
            transition={{ duration: 0.58, ease: EASE_OUT }}
            onAnimationComplete={() => setFromFullDone(true)}
          >
            <motion.img
              alt={project.title}
              className="object-cover object-top select-none absolute"
              src={project.image}
              draggable={false}
              initial={{ width: naturalW, height: heroH, left: (heroW - naturalW) / 2, top: 0 }}
              animate={{ width: imgW, height: imgH, left: 0, top: 0 }}
              transition={{ duration: 0.58, ease: EASE_OUT }}
            />
          </motion.div>
        );
      })() : (
        // Position context — keeps hitRef's inset:-50px expansion relative to the image
        <div ref={wrapperRef} style={{ position: "relative", width: imgW, height: imgH, marginLeft: imageOffset }}>
          {/* Transparent zone 50px larger on every side so tilt starts before cursor enters image */}
          <div ref={hitRef} style={{ position: "absolute", inset: "-50px" }} />
          {/* Outer: rotation container — extends 24px beyond the image on each side so
              rotating corners never reach the wrapper edge. No clip here. */}
          <div
            ref={tiltRef}
            className="will-change-transform"
            style={{ position: "absolute", inset: "-24px" }}
          >
            {/* Inner: clips the image with rounded corners in local (non-transformed) space */}
            <GridDistortionImage
              src={project.image}
              alt={project.title}
              className="rounded-lg"
              style={{ position: "absolute", inset: "24px" }}
              imgClassName="object-cover object-top select-none block"
              enabled={isCurrent && !isMobile}
              data-gallery-image={isCurrent ? "true" : undefined}
            />
          </div>
        </div>
      )}

    </motion.div>
  );
}

// ─── Project title reveal (runs on every mount — initial load + project switch) ──

interface TitleRevealProps {
  title: string;
  platform: string;
  isMobile: boolean;
  /** false on initial load (parent timeline handles it); true on project switch */
  animate: boolean;
  stroke?: boolean;
}

function TitleReveal({ title, platform, isMobile, animate, stroke }: TitleRevealProps) {
  useLayoutEffect(() => {
    if (!animate) return;
    const ctx = gsap.context(() => {
      gsap.set('[data-name^="project-title-word-"], [data-name="project-platform-line"]', {
        clipPath: "inset(100% 0 0 0)",
        y: 40,
      });
      gsap.timeline()
        .to('[data-name^="project-title-word-"]', {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: "power3.out",
        })
        .to('[data-name="project-platform-line"]', {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          duration: 0.50,
          ease: "power3.out",
        }, 0.27);
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {title.split(' ').map((word, i) => (
        <p
          key={i}
          data-name={`project-title-word-${i}`}
          className={`font-['Avantt',sans-serif] font-bold text-[#131313] leading-[0.86] m-0 ${
            isMobile ? "text-[48px]" : "text-[64px]"
          }`}
          style={stroke ? { WebkitTextStroke: "0.5px #676767" } : undefined}
        >
          {word}
        </p>
      ))}
      <div
        data-name="project-platform-line"
        className="mt-2 font-['Avantt',sans-serif] font-bold text-[14px] text-black uppercase"
      >
        <p>— {platform}</p>
      </div>
    </>
  );
}

// ─── Home page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { w: screenW, h: screenH } = useWindowSize();
  const { imgW, imgH, containerW, spacing, xRadius, yRadius } = getCarouselDimensions(screenW, screenH);
const isMobile = screenW < 640;
  const isTablet = screenW >= 640 && screenW < 960;

  const fromProjectId = (location.state as any)?.fromProjectId;
  const fromHeroBounds = (location.state as any)?.fromHeroBounds as { width: number; height: number } | null ?? null;
  const fromAbout = (location.state as any)?.fromAbout as boolean ?? false;
  const initialIdx = fromProjectId
    ? Math.max(0, projects.findIndex((p) => p.id === fromProjectId))
    : 0;
  const [isReturning, setIsReturning] = useState(!!fromProjectId);
  const [cardStackDone, setCardStackDone] = useState(!!fromProjectId);
  const [revealStarted, setRevealStarted] = useState(!!fromProjectId);

  // Clear stale location state so browser refresh doesn't reuse navigation data
  useEffect(() => {
    if (fromProjectId) {
      window.history.replaceState({}, '', window.location.href);
    }
  }, []);

  const [virtualIndex, setVirtualIndex] = useState(initialIdx);
  const [isDragging, setIsDragging] = useState(false);
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const [isNearLink, setIsNearLink] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 400, damping: 35 });
  const springY = useSpring(cursorY, { stiffness: 400, damping: 35 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const containerY = useMotionValue(-initialIdx * spacing);
  const dragStartY = useRef(0);
  const dragStartContainerY = useRef(0);
  const wasDragging = useRef(false);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentProjectIndex = mod(virtualIndex, N);
  const currentProject = projects[currentProjectIndex];

  const itemsToRender = Array.from({ length: BUFFER * 2 + 1 }, (_, i) => {
    const vp = virtualIndex - BUFFER + i;
    return { virtualPos: vp, project: projects[mod(vp, N)] };
  });

  const snapTo = (newVirtualIndex: number, duration = 0.65) => {
    if (isReturning) setIsReturning(false);
    setVirtualIndex(newVirtualIndex);
    animate(containerY, -newVirtualIndex * spacing, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
  };

  // ─── Mouse drag ───────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartContainerY.current = containerY.get();
    wasDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const overInteractive = !!target.closest('a, button, [data-interactive], [data-gallery-image="true"]');
    setIsOverInteractive(overInteractive);

    // Proximity check: is cursor within LINK_PROXIMITY px of any interactive element?
    const LINK_PROXIMITY = 20;
    let nearLink = false;
    if (!overInteractive) {
      const els = document.querySelectorAll<HTMLElement>('a, button, [data-interactive]');
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
        const dy = Math.max(r.top  - e.clientY, 0, e.clientY - r.bottom);
        if (Math.sqrt(dx * dx + dy * dy) <= LINK_PROXIMITY) { nearLink = true; break; }
      }
    }
    setIsNearLink(nearLink);

    if (!isDragging) return;
    const delta = e.clientY - dragStartY.current;
    if (Math.abs(delta) > 5) wasDragging.current = true;
    containerY.set(dragStartContainerY.current + delta);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (wasDragging.current) {
      const snappedIndex = -Math.round(containerY.get() / spacing);
      snapTo(snappedIndex);
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsOverInteractive(false);
    setIsNearLink(false);
    if (isDragging) {
      const snappedIndex = -Math.round(containerY.get() / spacing);
      snapTo(snappedIndex);
      setIsDragging(false);
    }
  };

  // ─── Touch handlers ──────────────────────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragStartContainerY.current = containerY.get();
    wasDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientY - dragStartY.current;
    if (Math.abs(delta) > 5) wasDragging.current = true;
    containerY.set(dragStartContainerY.current + delta);
  };

  const handleTouchEnd = () => {
    const snappedIndex = -Math.round(containerY.get() / spacing);
    snapTo(snappedIndex);
  };

  // ─── Wheel ────────────────────────────────────────────────────────────────
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    wheelAccum.current += e.deltaY;
    const targetY = containerY.get() + (-e.deltaY * 0.8);
    containerY.set(targetY);

    if (wheelTimer.current) clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(() => {
      const snappedIndex = -Math.round(containerY.get() / spacing);
      snapTo(snappedIndex);
      wheelAccum.current = 0;
    }, 120);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Recalculate position on resize
  useEffect(() => {
    containerY.set(-virtualIndex * spacing);
  }, [spacing, virtualIndex]);

  // ─── Load animation ───────────────────────────────────────────────────────

  // Set initial hidden states before first paint (logo stays visible)
  useLayoutEffect(() => {
    if (isReturning) return;
    const textEls = [
      '[data-name="logo"]',
      '[data-name="subtitle"]',
      '[data-name="location"]',
      '[data-name="options"]',
      '[data-name="footer-year"]',
      '[data-name="footer-freelance"]',
      '[data-name="footer-mobile"]',
      '[data-name="about"]',
      '[data-name="mobile-title"]',
    ];
    gsap.set(textEls, { clipPath: "inset(100% 0 0 0)", y: 18 });
    // Per-word: y on inner elements is safe — the -translate-y-1/2 lives on the outer container, not here
    gsap.set('[data-name^="project-title-word-"], [data-name="project-platform-line"]', { clipPath: "inset(100% 0 0 0)", y: 40 });
  }, []);

  // Reveal timeline — fires early (at CardStack hold midpoint) so text animates over the overlay
  useLayoutEffect(() => {
    if (!revealStarted || isReturning) return;
    const ctx = gsap.context(() => {
      // Reveal sequence — matches intro easing (power3.out) for a unified motion language.
      // Order: logo → header left→right → footer left→right → project title.
      gsap.timeline()
        // 1. Logo
        .to('[data-name="logo"]',                  { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.55, ease: "power3.out" }, 0)
        // 2. Header elements, left → right
        .to('[data-name="subtitle"]',              { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.55, ease: "power3.out" }, 0.07)
        .to('[data-name="location"]',              { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.55, ease: "power3.out" }, 0.14)
        .to('[data-name="options"]',               { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.55, ease: "power3.out" }, 0.21)
        // 3. Footer elements, left → right
        .to('[data-name="footer-year"]',           { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.55, ease: "power3.out" }, 0.30)
        .to('[data-name="footer-mobile"]',         { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.55, ease: "power3.out" }, 0.30)
        .to('[data-name="mobile-title"]',          { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.55, ease: "power3.out" }, 0.30)
        .to('[data-name="footer-freelance"]',      { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.55, ease: "power3.out" }, 0.37)
        .to('[data-name="about"]',                 { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.55, ease: "power3.out" }, 0.44)
        // 4. Project title — last
        .to('[data-name^="project-title-word-"]',  { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.55, stagger: 0.10, ease: "power3.out" }, 0.54)
        .to('[data-name="project-platform-line"]', { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.50, ease: "power3.out" }, 0.77);
    });
    return () => ctx.revert();
  }, [revealStarted]);

  // ─── Navigation ───────────────────────────────────────────────────────────
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (wasDragging.current) {
      wasDragging.current = false;
      return;
    }
    const imgEl = e.currentTarget.querySelector("img") as HTMLElement | null;
    if (imgEl) {
      const bounds = imgEl.getBoundingClientRect();
      navigate(`/project/${currentProject.id}`, {
        state: {
          imageBounds: { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height },
          imageUrl: currentProject.image,
        },
      });
    } else {
      navigate(`/project/${currentProject.id}`);
    }
  };

  const handleSliderClick = (projectIndex: number) => {
    const currentMod = mod(virtualIndex, N);
    let diff = projectIndex - currentMod;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    snapTo(virtualIndex + diff);
  };

  return (
    <div
      ref={containerRef}
      className={`bg-[#ebebeb] relative size-full overflow-hidden select-none ${isOverInteractive || isNearLink ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"}`}
      data-name="Home"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <DotGrid />

      {/* ── Header ── */}
      <SiteHeader variant="light" onLogoClick={() => navigate("/")} />

      {/* ── Designer title — mobile only ── */}
      {isMobile && (
        <div className="absolute left-4 top-[68px] font-['Avantt',sans-serif] font-semibold text-[12px] text-black uppercase leading-normal z-10 pointer-events-none" data-name="mobile-title">
          <p className="mb-0">Software &amp; Experience</p>
          <p>Designer.</p>
        </div>
      )}

      {/* ── Footer ── */}
      <SiteFooter />

      {/* ── Carousel ── */}
      <div
        className="absolute pointer-events-none z-[2]"
        data-name="carousel-container"
        style={{ left: isMobile ? "50%" : isTablet ? "55%" : "50%", top: "50%", transform: "translateX(-50%)", width: containerW, height: 0 }}
      >
        <motion.div className="relative" style={{ y: containerY }}>
          {itemsToRender.map(({ virtualPos, project }) => {
            const isCurrent = virtualPos === virtualIndex;
            return (
              <CarouselItem
                key={`vp-${virtualPos}`}
                containerY={containerY}
                virtualPos={virtualPos}
                virtualIndex={virtualIndex}
                project={project}
                isCurrent={isCurrent}
                isReturning={isReturning}
                fromHeroBounds={isCurrent ? fromHeroBounds : null}
                imgW={imgW}
                imgH={imgH}
                containerW={containerW}
                spacing={spacing}
                xRadius={xRadius}
                yRadius={yRadius}
                isMobile={isMobile}
                onClick={isCurrent ? handleImageClick : undefined}
              />
            );
          })}
        </motion.div>
      </div>


      {/* ── Project name ── */}
      <div
        className={`absolute z-[110] ${
          isTablet || isMobile ? "left-8 top-1/2 -translate-y-1/2 w-[280px]"
            : "left-[256px] top-1/2 -translate-y-1/2 w-[451px]"
        }`}
        data-name="project name"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProjectIndex}
            initial={false}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: isReturning ? 0.09 : 0 }}
          >
            <TitleReveal
              title={currentProject.title}
              platform={currentProject.platform}
              isMobile={isMobile}
              animate={cardStackDone && (!isReturning || fromAbout)}
              stroke={currentProject.id === "carpooling-app"}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Slider — desktop/tablet only ── */}
      {!isMobile && <div
        className="absolute flex flex-col items-end gap-[0px] z-10 right-6 lg:right-8 top-1/2 -translate-y-1/2 w-[80px]"
        data-name="slider"
      >
        {projects.map((_, index) => {
          const isActive = index === currentProjectIndex;
          return (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); handleSliderClick(index); }}
              className="w-full flex justify-end group focus:outline-none pointer-events-auto"
              aria-label={`Go to project ${index + 1}`}
            >
              {isActive ? (
                <div className="flex gap-[10px] h-[10px] items-center justify-end">
                  <p className="font-['Avantt',sans-serif] font-semibold text-[12px] text-black uppercase tracking-[0.48px]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <motion.div
                    className="bg-black h-[1.5px]"
                    initial={{ width: 6 }}
                    animate={{ width: 24 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              ) : (
                <div className="flex h-[10px] items-center justify-end">
                  <div className="bg-black h-[1.5px] w-[6px] group-hover:w-[14px] transition-all duration-300" />
                </div>
              )}
            </button>
          );
        })}
      </div>}

      {/* ── Intro overlay ── */}
      {!isReturning && !cardStackDone && (
        <IntroOverlay
          onRevealStart={() => setRevealStarted(true)}
          onComplete={() => setCardStackDone(true)}
        />
      )}

      {/* ── Custom cursor — desktop only ── */}
      {!isMobile && !isTablet && (
        <motion.div
          className="fixed overflow-clip size-[76px] pointer-events-none z-[60]"
          style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
          animate={{ opacity: isOverInteractive || isNearLink ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          data-name="Dragger"
        >
          {/* Ring */}
          <motion.div
            className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2"
            animate={{
              width:  isDragging ? 76 : isNearLink ? 48 : 68,
              height: isDragging ? 76 : isNearLink ? 48 : 68,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 76">
              <circle cx="38" cy="38" r="37.5" stroke="#404040" strokeWidth="1" />
            </svg>
          </motion.div>

          {/* Arrows */}
          <AnimatePresence>
            {isDragging && (
              <>
                <motion.div
                  className="-translate-x-1/2 absolute left-1/2 size-[10.5px]"
                  initial={{ top: "50%", opacity: 0 }}
                  animate={{ top: "calc(50% - 19px)", opacity: 1 }}
                  exit={{ top: "50%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                    <path d="M4 0L5.73205 3H2.26795L4 0Z" fill="#404040" />
                  </svg>
                </motion.div>
                <motion.div
                  className="-translate-x-1/2 absolute left-1/2 size-[10.5px]"
                  initial={{ top: "50%", opacity: 0 }}
                  animate={{ top: "calc(50% + 11px)", opacity: 1 }}
                  exit={{ top: "50%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                    <path d={DOWN_ARROW} fill="#404040" />
                  </svg>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
