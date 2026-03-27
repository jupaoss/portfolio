import { useParams, useNavigate, useLocation } from "react-router";
import { projects } from "../data/projects";
import { useState, useEffect, useRef } from "react";
import { motion, animate, useMotionValue } from "motion/react";

import { SiteHeader } from "../components/SiteHeader";
import { DotGrid } from "../components/DotGrid";
import imgPic from "@/assets/Julian.png";
import imgCollage from "@/assets/project_1_better_together/Collage.png";
import imgP1_1 from "@/assets/project_1_better_together/Image 1.png";
import imgP1_2 from "@/assets/project_1_better_together/Image 2.png";
import imgP1_3 from "@/assets/project_1_better_together/Image 3.svg";
import imgP1_4 from "@/assets/project_1_better_together/Image 4.png";
import imgP1_5 from "@/assets/project_1_better_together/Image 5.png";
import imgP1_6 from "@/assets/project_1_better_together/Image 6.png";
import imgP1_7 from "@/assets/project_1_better_together/Image 7.png";
import imgP1_8 from "@/assets/project_1_better_together/Image 8.png";
import imgP1_9 from "@/assets/project_1_better_together/Image 9.png";


function Row() {
  return (
    <div className="h-[2px] relative shrink-0 w-[1370px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1370 2">
        <g id="row">
          <circle cx="1" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4453" r="1" />
          <circle cx="115" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4454" r="1" />
          <circle cx="229" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4455" r="1" />
          <circle cx="343" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4456" r="1" />
          <circle cx="457" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4457" r="1" />
          <circle cx="571" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4458" r="1" />
          <circle cx="685" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4459" r="1" />
          <circle cx="799" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4460" r="1" />
          <circle cx="913" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4461" r="1" />
          <circle cx="1027" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4462" r="1" />
          <circle cx="1141" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4463" r="1" />
          <circle cx="1255" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4464" r="1" />
          <circle cx="1369" cy="1" fill="var(--fill-0, #AAAAAA)" id="Ellipse 4465" r="1" />
        </g>
      </svg>
    </div>
  );
}


const MOBILE_HERO_TOP = 0;
const MOBILE_HERO_HEIGHT = 502; // top (0) + original 92 nav gap + original 410 height — keeps same bottom edge

const HERO_WIDTH_PER_HEIGHT = 380 / 476; // matches gallery carousel aspect ratio (width/height)

function getTargetHeroDimensions() {
  const W = window.innerWidth;
  if (W < 1024) {
    return { width: W, height: MOBILE_HERO_HEIGHT };
  }
  const vh = window.innerHeight;
  const naturalHeight = vh;
  const naturalWidth = naturalHeight * HERO_WIDTH_PER_HEIGHT;

  // For 1024–1420px: clamp hero width to keep a 24px gap to the right column (left: 75%).
  // Hero is centered → rightEdge = 50%W + heroW/2. Gap = 75%W − rightEdge ≥ 24
  // → heroW ≤ 0.5W − 48. Height always stays at full viewport height.
  if (W < 1420) {
    const maxWidth = 0.5 * W - 48;
    const width = Math.min(naturalWidth, maxWidth);
    return { width, height: naturalHeight };
  }

  return { width: naturalWidth, height: naturalHeight };
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const [project, setProject] = useState(projects.find((p) => p.id === id));
  const [isDarkLogo, setIsDarkLogo] = useState(false);
  const [isDarkText, setIsDarkText] = useState(false);
  const [isDarkMenu, setIsDarkMenu] = useState(false);
  const [isDarkLocation, setIsDarkLocation] = useState(false);
  const [isDarkFooterCopyright, setIsDarkFooterCopyright] = useState(false);
  const [isDarkFooterAvailability, setIsDarkFooterAvailability] = useState(false);
  const [isDarkFooterAbout, setIsDarkFooterAbout] = useState(false);
  const lightSectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageSectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const footerCopyrightRef = useRef<HTMLDivElement>(null);
  const footerAvailabilityRef = useRef<HTMLDivElement>(null);
  const footerAboutRef = useRef<HTMLDivElement>(null);
  // Ref for imperative exit animation
  const heroRef = useRef<HTMLDivElement>(null);
  const nextProjectImageRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const isExitingRef = useRef(false);
  const isNavigatingRef = useRef(false);
  const collageX = useMotionValue(0);

  // Get transition state from location
  const imageBounds = (location.state as any)?.imageBounds;

  // MotionValues for hero — lets us animate imperatively without conflicting with declarative props
  const EASE = [0.22, 1, 0.36, 1] as const;
  const initialDims = getTargetHeroDimensions();
  const heroWidth  = useMotionValue(imageBounds?.width  ?? initialDims.width);
  const heroHeight = useMotionValue(imageBounds?.height ?? initialDims.height);
  const heroY      = useMotionValue(imageBounds?.top    ?? (window.innerWidth < 1024 ? MOBILE_HERO_TOP : 0));

  // Adjacent projects (wraps around)
  const projectIndex = projects.findIndex(p => p.id === id);
  const nextProject  = projects[(projectIndex + 1) % projects.length];

  // Animate hero in on mount (if coming from another project or gallery)
  useEffect(() => {
    const d = getTargetHeroDimensions();
    if (imageBounds) {
      animate(heroWidth,  d.width,  { duration: 0.58, ease: EASE });
      animate(heroHeight, d.height, { duration: 0.58, ease: EASE });
      animate(heroY, window.innerWidth < 1024 ? MOBILE_HERO_TOP : 0, { duration: 0.58, ease: EASE });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep hero dimensions in sync with viewport resizes
  useEffect(() => {
    const handleResize = () => {
      if (isExitingRef.current) return;
      setIsMobile(window.innerWidth < 1024);
      const d = getTargetHeroDimensions();
      animate(heroWidth,  d.width,  { duration: 0.25, ease: EASE });
      animate(heroHeight, d.height, { duration: 0.25, ease: EASE });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentProject = projects.find((p) => p.id === id);
    if (!currentProject) {
      navigate("/");
    } else {
      setProject(currentProject);
    }
  }, [id, navigate]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const checkHeaderOverlap = () => {
      const logoElement = logoRef.current;
      const textElement = textRef.current;
      const menuElement = menuRef.current;
      const locationElement = locationRef.current;
      const footerCopyrightElement = footerCopyrightRef.current;
      const footerAvailabilityElement = footerAvailabilityRef.current;
      const footerAboutElement = footerAboutRef.current;

      if (!logoElement || !textElement || !menuElement || !locationElement ||
          !footerCopyrightElement || !footerAvailabilityElement || !footerAboutElement) return;

      const logoRect = logoElement.getBoundingClientRect();
      const textRect = textElement.getBoundingClientRect();
      const menuRect = menuElement.getBoundingClientRect();
      const locationRect = locationElement.getBoundingClientRect();
      const footerCopyrightRect = footerCopyrightElement.getBoundingClientRect();
      const footerAvailabilityRect = footerAvailabilityElement.getBoundingClientRect();
      const footerAboutRect = footerAboutElement.getBoundingClientRect();

      const overlaps = (elementRect: DOMRect, refs: (HTMLDivElement | null)[]) =>
        refs.some(ref => {
          if (!ref) return false;
          const rect = ref.getBoundingClientRect();
          return rect.left < elementRect.right &&
                 rect.right > elementRect.left &&
                 rect.top < elementRect.bottom &&
                 rect.bottom > elementRect.top;
        });

      // Images + light sections trigger most header elements
      const allContentRefs = [...lightSectionRefs.current, ...imageSectionRefs.current];

      // Logo and social links only react to true light-background sections (not project images)
      setIsDarkLogo(overlaps(logoRect, lightSectionRefs.current));
      setIsDarkMenu(overlaps(menuRect, lightSectionRefs.current));

      // Other elements react to both light sections and project images
      setIsDarkText(overlaps(textRect, allContentRefs));
      setIsDarkLocation(overlaps(locationRect, allContentRefs));
      setIsDarkFooterCopyright(overlaps(footerCopyrightRect, allContentRefs));
      setIsDarkFooterAvailability(overlaps(footerAvailabilityRect, allContentRefs));
      setIsDarkFooterAbout(overlaps(footerAboutRect, allContentRefs));
    };

    // Initial check
    checkHeaderOverlap();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkHeaderOverlap();

          // Auto-navigate to next project when scrolled to bottom
          if (!isNavigatingRef.current && !isExitingRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            if (scrollTop + clientHeight >= scrollHeight - 20) {
              isNavigatingRef.current = true;
              const imgEl = nextProjectImageRef.current;
              const rect = imgEl?.getBoundingClientRect();
              navigate(`/project/${nextProject.id}`, {
                state: {
                  imageBounds: rect
                    ? { width: rect.width, height: rect.height, top: rect.top }
                    : undefined,
                },
              });
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextProject.id]);

  // Collage scroll on mobile — expands when collage crosses mid-screen, reverts when it exits
  useEffect(() => {
    const el = collageRef.current;
    const container = scrollContainerRef.current;
    if (!isMobile || !el || !container) return;
    let currentAnimation: { stop: () => void } | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        currentAnimation?.stop();
        if (entry.isIntersecting) {
          currentAnimation = animate(collageX, -416, { duration: 2.5, ease: "easeInOut" });
        } else {
          currentAnimation = animate(collageX, 0, { duration: 2, ease: "easeInOut" });
        }
      },
      {
        root: container,
        // Zero-height strip at the vertical center of the scroll container
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  if (!project) {
    return null;
  }

  const handleLogoClick = () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    // Navigate immediately — Gallery reconstructs the shrink animation from the hero bounds
    navigate("/", {
      state: {
        fromProjectId: project!.id,
        fromHeroBounds: { width: heroWidth.get(), height: heroHeight.get() },
      },
    });
  };

  const mobileLayout = (
    <>
      {/* Fixed Header */}
      <SiteHeader
        variant="dynamic"
        isDarkLogo={isDarkLogo}
        isDarkText={isDarkText}
        isDarkMenu={isDarkMenu}
        isDarkLocation={isDarkLocation}
        logoRef={logoRef}
        textRef={textRef}
        menuRef={menuRef}
        locationRef={locationRef}
        onLogoClick={handleLogoClick}
      />

      {/* Hero image — animates from thumbnail position into place */}
      <div className="relative" style={{ height: MOBILE_HERO_TOP + MOBILE_HERO_HEIGHT }}>
        <motion.div
          className="absolute left-0 right-0 overflow-hidden"
          style={{ height: heroHeight, y: heroY }}
          ref={heroRef}
        >
          <img
            alt={project.title}
            className="w-full h-full object-cover pointer-events-none"
            src={project.image}
          />
        </motion.div>
      </div>

      {/* Title overlaps the image by 20px */}
      <div className="px-4 -mt-5 relative z-10">
        <p className="font-['Space_Grotesk',sans-serif] font-bold text-[48px] leading-[0.86] text-white">
          {project.title}
        </p>
      </div>

      {/* Company name + Role + Description row */}
      <div className="px-4 mt-3 flex items-start gap-20 font-['Space_Grotesk',sans-serif] text-[#eaeaea]">
        {/* Left: platform */}
        <div className="shrink-0">
          <p className="text-[14px] uppercase font-medium tracking-[0.48px]">— {project.platform}</p>
        </div>
        {/* Right: role + description */}
        <div className="flex flex-col gap-6 w-[70%]">
          <div className="flex flex-col gap-1">
            <p className="text-[14px] uppercase font-medium tracking-[0.48px]">My role</p>
            <p className="text-[14px] font-normal tracking-[-0.12px]">UX/UI Designer</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[14px] uppercase font-medium tracking-[0.48px]">Description</p>
            <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">
              When Android needed to show the world that their devices aren't just products — they're an ecosystem — they needed more than a spec sheet. For CES, we built an immersive web experience that turned the technical story of device connectivity into something visitors could feel, not just read.
            </p>
          </div>
        </div>
      </div>

      {/* Device Collage — horizontal, auto-scrolls on viewport entry */}
      <div className="mt-[80px] overflow-hidden" ref={collageRef}>
        <motion.img
          alt=""
          className="w-auto h-[220px] object-cover pointer-events-none"
          src={imgCollage}
          style={{ x: collageX }}
        />
      </div>

      {/* Challenge & Approach */}
      <div className="px-4 mt-[80px] font-['Space_Grotesk',sans-serif] text-[#eaeaea]">
        <div className="w-[70%] flex flex-col gap-4">
          <p className="font-medium text-[14px] uppercase tracking-[0.48px]">THE CHALLENGE.</p>
          <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">CES is the noisiest room in tech. Every brand on the floor is fighting for the same three seconds of attention. Our job was to take a complex, multi-device ecosystem and make it immediately intuitive — to build a digital experience that didn't explain connectivity but demonstrated it, holding attention long enough for the story to land.</p>
        </div>
        <div className="w-[70%] flex flex-col gap-4 mt-[48px]">
          <p className="font-medium text-[14px] uppercase tracking-[0.48px]">THE APPROACH: PARTICLES BECOME OUR DESIGN LANGUAGE</p>
          <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">We recognized that Android devices and Google products, like individual particles, are impressive on their own. But when they come together, they create something fundamentally different — seamless, end-to-end experiences that are greater than the sum of their parts.</p>
          <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">The particle system wasn't just a visual motif — it was the structural metaphor. Scattered elements unifying on screen mirrored the core product truth: everything is better together. This concept drove every design decision: motion that mimicked particles converging, transitions that connected isolated product stories into a unified narrative, and interactions that let users discover these connections organically.</p>
        </div>
      </div>

      {/* Images 1-2 */}
      <div className="flex flex-col gap-4 mt-[80px] px-4">
        <img className="w-full object-cover pointer-events-none" alt="" src={imgP1_1} />
        <img className="w-full object-cover pointer-events-none" alt="" src={imgP1_2} />
      </div>

      {/* Approach Text */}
      <div className="px-4 mt-[80px] flex flex-col gap-6 font-['Space_Grotesk',sans-serif] text-[#eaeaea]">
        <p className="w-[70%] font-medium text-[14px] uppercase leading-[1.4]">THE APPROACH: PARTICLES BECAME OUR DESIGN LANGUAGE.</p>
        <p className="w-[70%] text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">We recognized that Android devices and Google products, like individual particles, are impressive on their own. But when they come together, they create something fundamentally different — seamless, end-to-end experiences that are greater than the sum of their parts.</p>
        <p className="w-[70%] text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">The particle system wasn't just a visual motif — it was the structural metaphor. Scattered elements unifying on screen mirrored the core product truth: everything is better together.</p>
        <p className="w-[70%] text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">This concept drove every design decision: motion choreography that mimicked particles converging, visual transitions that connected isolated product stories into a unified narrative, and an interaction model that let users discover these connections organically rather than being told about them.</p>
      </div>

      {/* Images 3-6 */}
      <div className="flex flex-col gap-4 mt-[80px] px-4">
        <img className="w-full object-cover pointer-events-none" alt="" src={imgP1_3} />
        <img className="w-full object-cover pointer-events-none" alt="" src={imgP1_4} />
        <img className="w-full object-cover pointer-events-none" alt="" src={imgP1_5} />
        <img className="w-full object-cover pointer-events-none" alt="" src={imgP1_6} />
      </div>

      {/* Images 7-9 */}
      <div className="flex flex-col gap-4 mt-4 px-4">
        <img className="w-full object-cover pointer-events-none" alt="" src={imgP1_7} />
        <img className="w-full object-cover pointer-events-none" alt="" src={imgP1_8} />
        <img className="w-full object-cover pointer-events-none" alt="" src={imgP1_9} />
      </div>

      {/* Impact / Stats */}
      <div className="px-4 mt-[80px] flex flex-col gap-4 font-['Space_Grotesk',sans-serif] text-[#eaeaea]">
        <div className="w-[70%] flex flex-col gap-4">
          <p className="font-medium text-[14px] uppercase tracking-[0.48px]">IMPACT</p>
          <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">Showcase how Android devices and Google products form an interconnected ecosystem that enhances seamless connectivity. It will delightfully demonstrate their connections, promote effective synchronization and an end-to-end experience.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-normal uppercase tracking-[0.48px] leading-[1.4]">Unique visitors<br />during CES</p>
            <p className="flex items-start text-[48px] font-bold leading-[1] tracking-[-1px]">287<span className="text-[20px] mt-[4px]">+</span></p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-normal uppercase tracking-[0.48px] leading-[1.4]">Avg. session<br />duration</p>
            <p className="flex items-start text-[48px] font-bold leading-[1] tracking-[-1px]">3<span className="text-[24px] mt-[2px]">'</span>42<span className="text-[24px] mt-[2px]">"</span></p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-normal uppercase tracking-[0.48px] leading-[1.4]">User delight<br />score</p>
            <p className="flex items-start text-[48px] font-bold leading-[1] tracking-[-1px]">9.1<span className="flex items-baseline text-[20px] mt-[4px]">/<span className="text-[14px]">10</span></span></p>
          </div>
        </div>
      </div>

      {/* Next Project */}
      <div className="px-4 py-[80px] flex flex-col items-center gap-6">
        <p className="font-['Space_Grotesk',sans-serif] text-[14px] uppercase tracking-[0.48px] text-[#eaeaea]">NEXT PROJECT</p>
        <div
          ref={nextProjectImageRef}
          className="cursor-pointer"
          style={{ width: 240, height: 300 }}
          onClick={() => {
            if (isNavigatingRef.current) return;
            isNavigatingRef.current = true;
            const rect = nextProjectImageRef.current?.getBoundingClientRect();
            navigate(`/project/${nextProject.id}`, {
              state: {
                imageBounds: rect ? { width: rect.width, height: rect.height, top: rect.top } : undefined,
              },
            });
          }}
        >
          <img alt={nextProject.title} className="w-full h-full object-cover" src={nextProject.image} />
        </div>
        <div className="text-center">
          <p className="font-['Space_Grotesk',sans-serif] font-bold text-[32px] text-white leading-[1.1]">{nextProject.title}</p>
          <p className="font-['Space_Grotesk',sans-serif] font-medium text-[14px] uppercase text-[#eaeaea] mt-2">— {nextProject.platform}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-6 flex justify-between items-center font-['Space_Grotesk',sans-serif] text-[14px] text-[#eaeaea] uppercase">
        <span>©2026</span>
        <a href="mailto:julianpatinoossa@gmail.com" className="underline [text-decoration-skip-ink:none] decoration-solid">julianpatinoossa@gmail.com</a>
      </div>
    </>
  );

  const desktopLayout = (
    <>
      {/* Dot Grid */}
      <div className="fixed -translate-x-1/2 content-stretch flex flex-col gap-[112px] items-start left-1/2 top-[62px] w-[1370px] pointer-events-none z-[100]" data-name="dots">
        {Array.from({ length: 60 }).map((_, i) => (
          <Row key={i} />
        ))}
      </div>

      {/* Header/Menu */}
      <SiteHeader
        variant="dynamic"
        isDarkLogo={isDarkLogo}
        isDarkText={isDarkText}
        isDarkMenu={isDarkMenu}
        isDarkLocation={isDarkLocation}
        logoRef={logoRef}
        textRef={textRef}
        menuRef={menuRef}
        locationRef={locationRef}
        onLogoClick={handleLogoClick}
      />

      {/* Hero */}
      <motion.div
        ref={heroRef}
        className="absolute top-0 left-1/2 z-10 overflow-hidden"
        data-name="hero image"
        style={{ width: heroWidth, height: heroHeight, translateX: "-50%", y: heroY }}
      >
        <img alt={project.title} className="absolute inset-0 w-full h-full object-cover" src={project.image} />
      </motion.div>

      {/* Project Name - Column 3 (left-aligned) */}
      <div className="-translate-y-1/2 absolute flex flex-col gap-2 items-start left-[256px] top-1/2 w-[451px] z-20" data-name="project name">
        <p className="font-['Space_Grotesk',sans-serif] font-bold leading-[0.86] text-white text-[80px] w-full">{project.title}</p>
        <p className="font-['Space_Grotesk',sans-serif] font-medium text-[14px] text-[#eaeaea] uppercase">— {project.platform}</p>
      </div>

      {/* Right Info - Column 10 (left-aligned) */}
      <div
        className="absolute text-[#eaeaea] top-[499px] z-20"
        style={{ left: "75%" }}
        data-name="right"
      >
        <div className="content-stretch flex flex-col gap-[45px] items-start w-[215px]">
          <div className="content-stretch flex flex-col gap-[16px] items-start text-[14px] w-full" data-name="role">
            <div className="flex flex-col font-['Space_Grotesk',sans-serif] font-medium justify-end leading-[0] uppercase w-full">
              <p className="leading-[normal]">My role</p>
            </div>
            <p className="font-['Space_Grotesk',sans-serif] font-normal leading-[normal] tracking-[-0.14px] w-full">UX/UI Designer</p>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start w-full" data-name="team">
            <div className="flex flex-col font-['Space_Grotesk',sans-serif] font-medium justify-end leading-[0] text-[14px] uppercase w-full">
              <p className="leading-[normal]">Description</p>
            </div>
            <p className="font-['Space_Grotesk',sans-serif] font-normal leading-[normal] text-[14px] tracking-[-0.12px] w-full">When Android needed to show the world that their devices aren't just products — they're an ecosystem — they needed more than a spec sheet. For CES, we built an immersive web experience that turned the technical story of device connectivity into something visitors could feel, not just read.</p>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-end left-[24px] top-[calc(50%-874.5px)] w-[24px] z-20" data-name="slider">
        <div className="content-stretch flex gap-[10px] h-[16px] items-center relative shrink-0 w-full" data-name="Selected">
          <div className="bg-white h-[2px] shrink-0 w-[24px]" />
          <p className="font-['Space_Grotesk',sans-serif] font-normal leading-[normal] relative shrink-0 text-[12px] text-white uppercase whitespace-nowrap">ABOUT</p>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="content-stretch flex flex-col h-[16px] items-end justify-center relative shrink-0 w-full" data-name="Inactive">
            <div className="bg-white h-[2px] shrink-0 w-[6px]" />
          </div>
        ))}
      </div>

      {/* Post-hero content — flow layout with consistent 120px section gaps */}
      <div className="absolute left-0 right-0 flex flex-col gap-[120px]" style={{ top: "calc(100vh + 120px)" }}>

        {/* Collage */}
        <div className="mx-[256px]" data-name="collage" ref={el => { lightSectionRefs.current[2] = el; }}>
          <img alt="" className="w-full h-auto pointer-events-none" src={imgCollage} />
        </div>

        {/* The Challenge + Approach */}
        <div className="flex items-start justify-center gap-[240px]" style={{ paddingLeft: 256, paddingRight: 256 }}>
          <div className="flex flex-col gap-[16px] w-[333px] font-['Space_Grotesk',sans-serif] text-[#eaeaea]">
            <p className="font-medium text-[14px] uppercase tracking-[-0.12px]">THE CHALLENGE.</p>
            <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">CES is the noisiest room in tech. Every brand on the floor is fighting for the same three seconds of attention. Our job was to take a complex, multi-device ecosystem and make it immediately intuitive — to build a digital experience that didn't explain connectivity but demonstrated it, holding attention long enough for the story to land.</p>
          </div>
          <div className="flex flex-col gap-[16px] w-[333px] font-['Space_Grotesk',sans-serif] text-[#eaeaea] pt-[180px]">
            <p className="font-medium text-[14px] uppercase tracking-[-0.12px]">THE APPROACH: PARTICLES BECOME OUR DESIGN LANGUAGE</p>
            <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">We recognized that Android devices and Google products, like individual particles, are impressive on their own. But when they come together, they create something fundamentally different — seamless, end-to-end experiences that are greater than the sum of their parts.</p>
            <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">The particle system wasn't just a visual motif — it was the structural metaphor. Scattered elements unifying on screen mirrored the core product truth: everything is better together. This concept drove every design decision: motion that mimicked particles converging, transitions that connected isolated product stories into a unified narrative, and interactions that let users discover these connections organically.</p>
          </div>
        </div>

        {/* Images 1–2 */}
        <div className="mx-[256px] flex flex-col gap-[40px]" ref={el => { imageSectionRefs.current[0] = el; }}>
          <img alt="" className="w-full h-auto pointer-events-none" src={imgP1_1} />
          <img alt="" className="w-full h-auto pointer-events-none" src={imgP1_2} />
        </div>

        {/* The Approach */}
        <div className="flex items-start justify-center gap-[240px]" style={{ paddingLeft: 256, paddingRight: 256 }}>
          <div className="flex flex-col gap-[24px] w-[333px] font-['Space_Grotesk',sans-serif] text-[#eaeaea]">
            <p className="font-medium text-[14px] uppercase leading-[1.4]">THE APPROACH: PARTICLES BECAME OUR DESIGN LANGUAGE.</p>
            <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">We recognized that Android devices and Google products, like individual particles, are impressive on their own. But when they come together, they create something fundamentally different — seamless, end-to-end experiences that are greater than the sum of their parts.</p>
          </div>
          <div className="flex flex-col gap-[24px] w-[333px] font-['Space_Grotesk',sans-serif] text-[#eaeaea]">
            <p className="font-medium text-[14px] uppercase leading-[1.4] invisible">THE APPROACH: PARTICLES BECAME OUR DESIGN LANGUAGE.</p>
            <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">The particle system wasn't just a visual motif — it was the structural metaphor. Scattered elements unifying on screen mirrored the core product truth: everything is better together.</p>
            <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">This concept drove every design decision: motion choreography that mimicked particles converging, visual transitions that connected isolated product stories into a unified narrative, and an interaction model that let users discover these connections organically rather than being told about them.</p>
          </div>
        </div>

        {/* Images 3–6 */}
        <div className="mx-[256px] flex flex-col gap-[40px]" ref={el => { imageSectionRefs.current[1] = el; }}>
          <img alt="" className="w-full h-auto pointer-events-none" src={imgP1_3} />
          <img alt="" className="w-full h-auto pointer-events-none" src={imgP1_4} />
          <img alt="" className="w-full h-auto pointer-events-none" src={imgP1_5} />
          <img alt="" className="w-full h-auto pointer-events-none" src={imgP1_6} />
        </div>

        {/* Images 7–9 */}
        <div className="mx-[256px] flex flex-col gap-[40px]" ref={el => { imageSectionRefs.current[2] = el; }}>
          <img alt="" className="w-full h-auto pointer-events-none" src={imgP1_7} />
          <img alt="" className="w-full h-auto pointer-events-none" src={imgP1_8} />
          <img alt="" className="w-full h-auto pointer-events-none" src={imgP1_9} />
        </div>

        {/* Impact */}
        <div className="flex items-start justify-center gap-[240px]" style={{ paddingLeft: 256, paddingRight: 256 }}>
          <div className="flex flex-col gap-[24px] w-[333px] font-['Space_Grotesk',sans-serif] text-[#eaeaea]">
            <p className="font-medium text-[14px] uppercase tracking-[-0.12px]">IMPACT</p>
            <p className="text-[14px] font-normal leading-[1.6] tracking-[-0.12px]">Showcase how Android devices and Google products form an interconnected ecosystem that enhances seamless connectivity. It will delightfully demonstrate their connections, promote effective synchronization and an end-to-end experience.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-[80px] gap-y-[48px] w-[333px] font-['Space_Grotesk',sans-serif] text-[#eaeaea]">
            <div className="flex flex-col gap-[8px]">
              <p className="text-[12px] font-normal uppercase tracking-[0.48px] leading-[1.4]">Unique visitors<br />during CES</p>
              <p className="flex items-start text-[80px] font-bold leading-[1] tracking-[-2px]">287<span className="text-[32px] mt-[6px]">+</span></p>
            </div>
            <div className="flex flex-col gap-[8px]">
              <p className="text-[12px] font-normal uppercase tracking-[0.48px] leading-[1.4]">Avg. session<br />duration</p>
              <p className="flex items-start text-[80px] font-bold leading-[1] tracking-[-2px]">3<span className="text-[40px] mt-[4px]">'</span>42<span className="text-[40px] mt-[4px]">"</span></p>
            </div>
            <div className="flex flex-col gap-[8px]">
              <p className="text-[12px] font-normal uppercase tracking-[0.48px] leading-[1.4]">User delight<br />score</p>
              <p className="flex items-start text-[80px] font-bold leading-[1] tracking-[-2px]">9.1<span className="flex items-baseline text-[32px] mt-[6px]">/<span className="text-[20px]">10</span></span></p>
            </div>
          </div>
        </div>

        {/* Next Project Section */}
        <div
          className="relative w-full"
          style={{ height: "100vh" }}
          data-name="next project"
        >
        {/* Label */}
        <p className="absolute left-1/2 -translate-x-1/2 font-['Space_Grotesk',sans-serif] font-normal text-[#eaeaea] text-[12px] uppercase tracking-[0.48px] whitespace-nowrap" style={{ bottom: "calc(50% + 358px)" }}>
          NEXT PROJECT
        </p>

        {/* Centered image + overlapping title */}
        <div
          ref={nextProjectImageRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ width: 380, height: 476 }}
          onClick={() => {
            if (isNavigatingRef.current) return;
            isNavigatingRef.current = true;
            const rect = nextProjectImageRef.current?.getBoundingClientRect();
            navigate(`/project/${nextProject.id}`, {
              state: {
                imageBounds: rect
                  ? { width: rect.width, height: rect.height, top: rect.top }
                  : undefined,
              },
            });
          }}
        >
          <img
            alt={nextProject.title}
            className="w-full h-full object-cover rounded-[4px]"
            src={nextProject.image}
          />
        </div>

        {/* Title overlapping left edge of image — mirrors gallery style */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: "256px" }}
        >
          <p className="font-['Space_Grotesk',sans-serif] font-bold leading-[62px] text-[80px] text-white">
            {nextProject.title}
          </p>
          <div className="flex flex-col font-['Space_Grotesk',sans-serif] font-medium justify-end leading-[0] text-[#eaeaea] text-[14px] uppercase mt-[8px]">
            <p className="leading-[normal]">— {nextProject.platform}</p>
          </div>
        </div>
      </div>
      </div>

      {/* Footer */}
      <div className="fixed left-4 right-4 bottom-6 z-40 lg:left-6 lg:right-6" data-name="Footer">
        {/* Available for freelance - Column 10 (left-aligned) */}
        <div className={`absolute left-1/2 -translate-x-1/2 flex flex-col font-['Space_Grotesk',sans-serif] font-normal justify-end leading-[normal] not-italic text-[12px] bottom-0 uppercase whitespace-nowrap transition-colors duration-300 ${isDarkFooterAvailability ? "text-black" : "text-[#eaeaea]"}`} ref={el => { footerAvailabilityRef.current = el; }}>
          <p className="mb-0">available for freelance</p>
          <p className="[text-decoration-skip-ink:none] decoration-solid underline">julianpatinoossa@gmail.com</p>
        </div>

        {/* Copyright - Column 3 (left-aligned with Software & Experience) */}
        <div className={`absolute flex flex-col font-['Space_Grotesk',sans-serif] font-normal justify-end leading-[0] left-[232px] text-[12px] bottom-0 uppercase whitespace-nowrap transition-colors duration-300 ${isDarkFooterCopyright ? "text-black" : "text-[#eaeaea]"}`} ref={el => { footerCopyrightRef.current = el; }}>
          <p className="leading-[normal]">©2026</p>
        </div>

        {/* About - Column 12 (right-aligned) */}
        <div className={`absolute content-stretch flex gap-[8px] items-center justify-end right-0 bottom-0 transition-colors duration-300 ${isDarkFooterAbout ? "text-black" : "text-[#eaeaea]"}`} data-name="about" ref={el => { footerAboutRef.current = el; }}>
          <div className="relative shrink-0 size-[16px]" data-name="pic">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
              <div className="absolute bg-[#d9d9d9] inset-0" />
              <div className="absolute inset-0 overflow-hidden">
                <img alt="" className="absolute h-[133.58%] left-0 max-w-none top-[-4.16%] w-full" src={imgPic} />
              </div>
            </div>
          </div>
          <div className="flex flex-col font-['Space_Grotesk',sans-serif] font-normal justify-end leading-[0] relative shrink-0 text-[12px] uppercase whitespace-nowrap">
            <p className="leading-[normal]">ABOUT</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div
      ref={scrollContainerRef}
      className={`bg-[#32311e] relative overflow-y-auto overflow-x-hidden${isMobile ? " h-screen" : " min-h-screen min-w-[1020px]"}`}
      data-name={isMobile ? "Project - Mobile" : "Project - Desktop"}
    >
      <DotGrid />
      {isMobile ? mobileLayout : desktopLayout}
    </div>
  );
}
