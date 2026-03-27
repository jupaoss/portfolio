import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, MotionValue } from "motion/react";
import { DotGrid } from "../components/DotGrid";
import { SiteHeader } from "../components/SiteHeader";
import { projects } from "../data/projects";
import svgPaths from "../../imports/svg-za68zag2ck";
import imgPic from "@/assets/Julian.png";

const N = projects.length;
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

const CAROUSEL_ASPECT = 380 / 476; // width / height
const NOMINAL_IMG_H = 476; // design baseline at 900px viewport height

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


  // Full-screen return: current card shrinks from hero size to gallery card size
  const fromFull = isReturning && isCurrent && !!fromHeroBounds;
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
      <motion.img
        alt={project.title}
        className="object-cover select-none"
        style={{ width: imgW, height: imgH, marginLeft: imageOffset }}
        src={project.image}
        draggable={false}
        data-gallery-image={isCurrent ? "true" : undefined}
        initial={fromFull ? {
          width: fromHeroBounds!.width,
          height: fromHeroBounds!.height,
          y: -(fromHeroBounds!.height - imgH) / 2,
          marginLeft: 0,
        } : false}
        animate={{ width: imgW, height: imgH, y: 0, marginLeft: imageOffset }}
        whileHover={isCurrent && !fromFull ? { scale: 1.03 } : undefined}
        transition={fromFull
          ? { duration: 0.58, ease: EASE_OUT }
          : { duration: 0.4, ease: EASE_OUT }}
      />
    </motion.div>
  );
}

// ─── Gallery page ──────────────────────────────────────────────────────────────

export default function Gallery() {
  const navigate = useNavigate();
  const location = useLocation();
  const { w: screenW, h: screenH } = useWindowSize();
  const { imgW, imgH, containerW, spacing, xRadius, yRadius } = getCarouselDimensions(screenW, screenH);
  const isVerySmall = screenW < 360;
  const isMobile = screenW < 640;
  const isTablet = screenW >= 640 && screenW < 960;

  const fromProjectId = (location.state as any)?.fromProjectId;
  const fromHeroBounds = (location.state as any)?.fromHeroBounds as { width: number; height: number } | null ?? null;
  const initialIdx = fromProjectId
    ? Math.max(0, projects.findIndex((p) => p.id === fromProjectId))
    : 0;
  const isReturning = !!fromProjectId;

  const [virtualIndex, setVirtualIndex] = useState(initialIdx);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isOverInteractive, setIsOverInteractive] = useState(false);

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
  }, [spacing]);

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
        <div className="absolute left-4 top-[68px] font-['Space_Grotesk',sans-serif] font-normal text-[12px] text-black uppercase leading-normal z-10 pointer-events-none">
          <p className="mb-0">Software &amp; Experience</p>
          <p>Designer.</p>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="fixed left-4 right-4 bottom-6 z-40 lg:left-6 lg:right-6" data-name="Footer">
        <div className="hidden min-[768px]:block absolute left-8 min-[960px]:left-[232px] bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black">
          <p>©2026</p>
        </div>
        {/* Mobile: available for freelance + email + location */}
        <div className="md:hidden absolute left-0 bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black leading-normal">
          <p className="mb-0">available for freelance</p>
          <a href="mailto:julianpatinoossa@gmail.com" className="underline hover:opacity-60 transition-opacity duration-300">julianpatinoossa@gmail.com</a>
          <div className="flex items-center gap-1 mt-6">
            <span className="inline-block size-2 rounded-full bg-black shrink-0" />
            <span>MDE, COL</span>
          </div>
        </div>
        {/* Desktop: available for freelance + email */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black leading-normal">
          <p className="mb-0">available for freelance</p>
          <a href="mailto:julianpatinoossa@gmail.com" className="underline hover:opacity-60 transition-opacity duration-300">julianpatinoossa@gmail.com</a>
        </div>
        <div className="absolute flex gap-2 items-center right-0 bottom-0 text-black hover:opacity-60 transition-opacity duration-300 cursor-pointer" data-name="about">
          <div className="relative shrink-0 size-4 overflow-hidden">
            <img alt="" className="absolute h-[133.58%] left-0 max-w-none top-[-4.16%] w-full" src={imgPic} />
          </div>
          <p className="font-['Space_Grotesk',sans-serif] text-[12px] uppercase">ABOUT</p>
        </div>
      </div>

      {/* ── Carousel ── */}
      <div
        className="absolute pointer-events-none z-[2]"
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
        className={`absolute z-10 ${
          isTablet || isMobile ? "left-8 top-1/2 -translate-y-1/2 w-[280px]"
            : "left-[256px] top-1/2 -translate-y-1/2 w-[451px]"
        }`}
        data-name="project name"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProjectIndex}
            initial={isReturning ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={`font-['Space_Grotesk',sans-serif] font-bold text-[#131313] ${
              isVerySmall
                ? "leading-[0.86] text-[48px]"
                : isMobile
                ? "leading-[0.86] text-[48px]"
                : "leading-[0.86] text-[80px]"
            }`}>
              {currentProject.title}
            </p>
            <div className="mt-2 font-['Space_Grotesk',sans-serif] font-medium text-[14px] text-black uppercase">
              <p>— {currentProject.platform}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Slider — desktop/tablet only ── */}
      {!isMobile && <div
        className="absolute flex flex-col items-end gap-[6px] z-10 right-6 top-1/2 -translate-y-1/2 w-[80px]"
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
                <div className="flex gap-[10px] h-[16px] items-center justify-end">
                  <p className="font-['Space_Grotesk',sans-serif] text-[12px] text-black uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <motion.div
                    className="bg-black h-[2px]"
                    initial={{ width: 6 }}
                    animate={{ width: 24 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              ) : (
                <div className="flex h-[16px] items-center justify-end">
                  <div className="bg-black h-[2px] w-[6px] group-hover:w-[14px] transition-all duration-300" />
                </div>
              )}
            </button>
          );
        })}
      </div>}

      {/* ── Custom cursor — desktop only ── */}
      {!isMobile && !isTablet && (
        <motion.div
          className="fixed size-[76px] pointer-events-none z-[60]"
          data-name="Dragger"
          animate={{
            left: mousePosition.x - 38,
            top: mousePosition.y - 38,
            scale: isDragging ? 0.85 : 1,
            opacity: isOverInteractive ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
        >
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 76">
            <g id="Dragger">
              <circle cx="38" cy="38" r="37.5" stroke="var(--stroke-0, #404040)" />
              <circle cx="38" cy="38" r="12.5" stroke="var(--stroke-0, #404040)" />
              <path d={svgPaths.p13ab2380} fill="var(--fill-0, black)" />
              <path d={svgPaths.p271d3b80} fill="var(--fill-0, black)" />
            </g>
          </svg>
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
