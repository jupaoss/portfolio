import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate, MotionValue } from "motion/react";
import { gsap } from "gsap";
import { DotGrid } from "../components/DotGrid";
import { SiteHeader } from "../components/SiteHeader";
import { SlotCta } from "../components/SlotCta";
import { CardStack } from "../components/CardStack";
import { projects } from "../data/projects";
import svgPaths from "@/assets/iconPaths";
import headerSvgPaths from "@/assets/headerPaths";

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
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function CarouselItem({ containerY, virtualPos, virtualIndex, project, isCurrent, isReturning, fromHeroBounds, imgW, imgH, containerW, spacing, xRadius, yRadius, onClick }: CarouselItemProps) {
  const halfImg = imgH / 2;
  const itemTop = virtualPos * spacing - halfImg;
  const imageOffset = (containerW - imgW) / 2;

  // Once the return-from-detail animation finishes, switch to the tilt-enabled branch
  const [fromFullDone, setFromFullDone] = useState(false);

  // ─── 3-D tilt + parallax on hover ─────────────────────────────────────────
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tiltRef    = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLImageElement>(null);
  const hitRef     = useRef<HTMLDivElement>(null); // transparent zone 50px larger on every side

  useEffect(() => {
    if (!isCurrent) return;
    const wrapper = wrapperRef.current;
    const outer   = tiltRef.current;
    const img     = imgRef.current;
    const hit     = hitRef.current;
    if (!wrapper || !outer || !img || !hit) return;

    const ctx = gsap.context(() => {
      gsap.set(outer.parentElement, { perspective: 650 });

      const rotX = gsap.quickTo(outer, "rotationX", { ease: "power3", duration: 0.5 });
      const rotY = gsap.quickTo(outer, "rotationY", { ease: "power3", duration: 0.5 });
      const posX = gsap.quickTo(img,   "x",         { ease: "power3", duration: 0.5 });
      const posY = gsap.quickTo(img,   "y",         { ease: "power3", duration: 0.5 });

      const onMove = (e: PointerEvent) => {
        // nx/ny relative to the actual image bounds (not the extended hit area)
        const { left, top, width, height } = outer.getBoundingClientRect();
        const nx = Math.max(0, Math.min(1, (e.clientX - left) / width));
        const ny = Math.max(0, Math.min(1, (e.clientY - top)  / height));
        rotX(gsap.utils.interpolate(15, -15, ny));
        rotY(gsap.utils.interpolate(-15, 15, nx));
        posX(gsap.utils.interpolate(-30, 30, nx));
        posY(gsap.utils.interpolate(-30, 30, ny));
      };

      const onLeave = () => { rotX(0); rotY(0); posX(0); posY(0); };

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
            className="overflow-hidden absolute rounded-2xl"
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
          <div
            ref={tiltRef}
            className="overflow-hidden will-change-transform rounded-2xl"
            style={{ width: "100%", height: "100%" }}
          >
            <img
              ref={imgRef}
              alt={project.title}
              src={project.image}
              draggable={false}
              data-gallery-image={isCurrent ? "true" : undefined}
              className="object-cover object-top select-none will-change-transform block"
              style={{ width: imgW + 60, height: imgH + 60, margin: -30 }}
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
}

function TitleReveal({ title, platform, isMobile, animate }: TitleRevealProps) {
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
          duration: 0.65,
          stagger: 0.12,
          ease: "power2.out",
        })
        // platform starts 0.15s after the last title word (word 1 starts at 0.12s)
        .to('[data-name="project-platform-line"]', {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          duration: 0.55,
          ease: "power2.out",
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
          className={`font-['Space_Grotesk',sans-serif] font-bold text-[#131313] leading-[0.86] m-0 ${
            isMobile ? "text-[48px]" : "text-[80px]"
          }`}
        >
          {word}
        </p>
      ))}
      <div
        data-name="project-platform-line"
        className="mt-2 font-['Space_Grotesk',sans-serif] font-medium text-[14px] text-black uppercase"
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isOverInteractive, setIsOverInteractive] = useState(false);

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
    setMousePosition({ x: e.clientX, y: e.clientY });
    const target = e.target as HTMLElement;
    setIsOverInteractive(!!target.closest('a, button, [data-gallery-image="true"]'));
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
      '[data-name="subtitle"]',
      '[data-name="location"]',
      '[data-name="options"]',
      '[data-name="footer-year"]',
      '[data-name="footer-freelance"]',
      '[data-name="footer-mobile"]',
      '[data-name="about"]',
      '[data-name="mobile-title"]',
    ];
    gsap.set(textEls, { clipPath: "inset(100% 0 0 0)", y: 10 });
    // Per-word: y on inner elements is safe — the -translate-y-1/2 lives on the outer container, not here
    gsap.set('[data-name^="project-title-word-"], [data-name="project-platform-line"]', { clipPath: "inset(100% 0 0 0)", y: 40 });
  }, []);

  // Reveal timeline — fires early (at CardStack hold midpoint) so text animates over the overlay
  useLayoutEffect(() => {
    if (!revealStarted || isReturning) return;
    const ctx = gsap.context(() => {
      // Exit ends ~1.62s after onRevealStart — header/footer start at 1.20 (just before exit finishes)
      gsap.timeline()
        .to('[data-name="subtitle"]',              { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.65, ease: "power2.in" }, 1.20)
        .to('[data-name="location"]',              { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.65, ease: "power2.in" }, 1.24)
        .to('[data-name="options"]',               { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.65, ease: "power2.in" }, 1.28)
        .to('[data-name="footer-year"]',           { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.65, ease: "power2.in" }, 1.22)
        .to('[data-name="footer-freelance"]',      { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.65, ease: "power2.in" }, 1.26)
        .to('[data-name="footer-mobile"]',         { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.65, ease: "power2.in" }, 1.24)
        .to('[data-name="about"]',                 { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.65, ease: "power2.in" }, 1.30)
        .to('[data-name="mobile-title"]',          { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.65, ease: "power2.in" }, 1.26)
        // Title words start at 1.70 — each line rises independently with 0.12s stagger
        .to('[data-name^="project-title-word-"]',  { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.65, stagger: 0.12, ease: "power2.out" }, 1.70)
        // Platform 0.15s after last title word starts (at 1.82)
        .to('[data-name="project-platform-line"]', { clipPath: "inset(0% 0 0 0)", y: 0, duration: 0.55, ease: "power2.out" }, 1.97);
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
      className={`bg-white relative size-full overflow-hidden select-none ${isOverInteractive ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
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
        <div className="absolute left-4 top-[68px] font-['Space_Grotesk',sans-serif] font-normal text-[12px] text-black uppercase leading-normal z-10 pointer-events-none" data-name="mobile-title">
          <p className="mb-0">Software &amp; Experience</p>
          <p>Designer.</p>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="fixed left-4 right-4 bottom-6 z-[110] lg:left-6 lg:right-6" data-name="Footer">
        <div className="hidden min-[768px]:block absolute left-0 bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black" data-name="footer-year">
          <p>©2026</p>
        </div>
        {/* Mobile: available for freelance + email + location */}
        <div className="md:hidden absolute left-0 bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black leading-normal" data-name="footer-mobile">
          <p className="mb-0">available for freelance</p>
          <a href="mailto:julianpatinoossa@gmail.com" className="underline hover:opacity-60 transition-opacity duration-300">julianpatinoossa@gmail.com</a>
          <div className="flex items-center gap-[8px] mt-6">
            <div className="h-[13px] w-[11px] relative shrink-0">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 13">
                <path d={headerSvgPaths.p122a1c00} fill="black" />
              </svg>
            </div>
            <span>MDE, COL</span>
          </div>
        </div>
        {/* Desktop: available for freelance + email */}
        <div className="hidden md:block absolute left-[232px] bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black leading-normal" data-name="footer-freelance">
          <p className="mb-0">available for freelance</p>
          <a href="mailto:julianpatinoossa@gmail.com" className="underline hover:opacity-60 transition-opacity duration-300">julianpatinoossa@gmail.com</a>
        </div>
        <div className="absolute flex flex-col items-end right-0 bottom-0 text-black" data-name="about">
          <SlotCta text="WORK" className="text-[12px]" onClick={() => navigate(`/project/${currentProject.id}`)} />
          <SlotCta text="ABOUT" className="text-[12px]" onClick={() => navigate("/about")} />
        </div>
      </div>

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
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Slider — desktop/tablet only ── */}
      {!isMobile && <div
        className="absolute flex flex-col items-end gap-[0px] z-10 right-6 top-1/2 -translate-y-1/2 w-[80px]"
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
                  <p className="font-['Space_Grotesk',sans-serif] text-[12px] text-black uppercase">
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

      {/* ── Card stack loading overlay ── */}
      {!isReturning && !cardStackDone && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none bg-white">
          <CardStack
            cards={projects.map((p) => ({ id: p.id, image: p.image }))}
            width={imgW}
            height={imgH}
            onRevealStart={() => setRevealStarted(true)}
            onComplete={() => setCardStackDone(true)}
          />
        </div>
      )}

      {/* ── Custom cursor — desktop only ── */}
      {!isMobile && !isTablet && (
        <motion.div
          className="fixed overflow-clip size-[76px] pointer-events-none z-[60]"
          style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
          animate={{ opacity: isOverInteractive ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          data-name="Dragger"
        >
          {/* Ring */}
          <motion.div
            className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2"
            animate={{ width: isDragging ? 76 : 68, height: isDragging ? 76 : 68 }}
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

      {/* ── Smiley — desktop only ── */}
      {!isMobile && !isTablet && (
        <motion.div
          className="absolute flex items-center justify-center size-[78px] z-[3]"
          style={{ left: "calc(66.67% - 1px)", top: 394 }}
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 15 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="relative size-[64px]" data-name="face">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64 64">
              <path clipRule="evenodd" d={svgPaths.p10d67600} fill="var(--fill-0, #131313)" fillRule="evenodd" />
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
}
