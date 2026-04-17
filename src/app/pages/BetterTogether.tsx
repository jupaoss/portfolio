import { useParams, useNavigate, useLocation } from "react-router";
import { projects } from "../data/projects";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, animate, useMotionValue } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { SiteHeader } from "../components/SiteHeader";
import { DotGrid } from "../components/DotGrid";
import { SplitLines } from "../components/SplitLines";
import { SiteFooter } from "../components/SiteFooter";
import { GridDistortionImage } from "../components/GridDistortionImage";
import imgCollage from "../../../graphic-assets/project_1_better_together/02_beto_collage.png";
import imgP1_1 from "../../../graphic-assets/project_1_better_together/03_intro_beto.mp4";
import imgP1_2 from "../../../graphic-assets/project_1_better_together/04_beto_home.mp4";
import imgP1_3 from "../../../graphic-assets/project_1_better_together/08_devices.mp4";
import imgP1_4 from "../../../graphic-assets/project_1_better_together/06_beto_particles.png";
import imgP1_5 from "../../../graphic-assets/project_1_better_together/07_beto_split_image.png";
import imgP1_6 from "../../../graphic-assets/project_1_better_together/09_beto_chromecast.png";
import imgP1_7 from "../../../graphic-assets/project_1_better_together/11_beto_story_detail.mp4";
import imgP1_8 from "../../../graphic-assets/project_1_better_together/12_beto_story_detail.png";
import imgP1_9 from "../../../graphic-assets/project_1_better_together/10_beto_devices.png";



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
  // Max width is capped at 540px across all desktop sizes.
  if (W < 1420) {
    const maxWidth = 0.5 * W - 48;
    const width = Math.min(naturalWidth, maxWidth, 540);
    return { width, height: naturalHeight };
  }

  return { width: Math.min(naturalWidth, 540), height: naturalHeight };
}

export default function BetterTogether() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const [project, setProject] = useState(projects.find((p) => p.id === id));
  const [isDarkLogo, setIsDarkLogo] = useState(false);
  const [isDarkText, setIsDarkText] = useState(false);
  const [isDarkMenu, setIsDarkMenu] = useState(false);
  const [isDarkLocation, setIsDarkLocation] = useState(false);
  const lightSectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageSectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  // Ref for imperative exit animation
  const heroRef = useRef<HTMLDivElement>(null);
  const nextProjectImageRef = useRef<HTMLDivElement>(null);
  const collageContainerRef = useRef<HTMLDivElement>(null);
  const collageImgRef = useRef<HTMLImageElement>(null);
  const isExitingRef = useRef(false);
  const isNavigatingRef = useRef(false);

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

  // Hide role/description lines before first paint
  useLayoutEffect(() => {
    gsap.set('[data-name^="detail-text-line-"]', { clipPath: "inset(100% 0 0 0)", y: 40, opacity: 0.5 });
  }, []);

  // Base delay matches hero animation duration
  // Start text while hero is still scaling up (hero = 0.58s, we begin at 0.30s)
  const textRevealDelay = (imageBounds ? 0.02 : 0.2);
  // Description starts slightly after the labels
  const descriptionDelay = textRevealDelay + 0.3;

  // Reveal role/description label lines after hero animation completes
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: textRevealDelay })
        .to('[data-name^="detail-text-line-"]', {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power2.out",
        });
    });
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll-triggered reveals for post-hero images and text labels
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Images: slide up + fade in
      container.querySelectorAll<HTMLElement>('[data-scroll-img]').forEach(el => {
        gsap.set(el, { y: 60, opacity: 0 });
        ScrollTrigger.create({
          trigger: el,
          scroller: container,
          start: 'top 88%',
          onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }),
        });
      });

      // Stat blocks: title first, then number
      container.querySelectorAll<HTMLElement>('[data-scroll-stat]').forEach(el => {
        const [title, number] = Array.from(el.children) as HTMLElement[];
        if (!title || !number) return;
        gsap.set([title, number], { clipPath: 'inset(100% 0 0 0)', y: 40, opacity: 0.5 });
        ScrollTrigger.create({
          trigger: el,
          scroller: container,
          start: 'top 88%',
          onEnter: () => gsap.timeline()
            .to(title,  { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' })
            .to(number, { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }, '-=0.35'),
        });
      });

      // Labels / short text: clip-path + y rise + fade
      container.querySelectorAll<HTMLElement>('[data-name="scroll-label"]').forEach(el => {
        gsap.set(el, { clipPath: 'inset(100% 0 0 0)', y: 40, opacity: 0.5 });
        ScrollTrigger.create({
          trigger: el,
          scroller: container,
          start: 'top 88%',
          onEnter: () => gsap.to(el, { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }),
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Scroll-driven scale on next-project image — navigates when scale reaches 1
  useEffect(() => {
    const container = scrollContainerRef.current;
    const imgEl = nextProjectImageRef.current;
    if (!container || !imgEl) return;

    gsap.set(imgEl, { scale: 0.8 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: imgEl,
        scroller: container,
        start: 'center bottom',
        end: 'center center',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(imgEl, { scale: 0.8 + 0.2 * self.progress });
        },
      });
    });

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextProject.id]);

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
      if (!logoElement || !textElement || !menuElement || !locationElement) return;

      const logoRect = logoElement.getBoundingClientRect();
      const textRect = textElement.getBoundingClientRect();
      const menuRect = menuElement.getBoundingClientRect();
      const locationRect = locationElement.getBoundingClientRect();

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


  // Collage pan effect for 360–449px viewports
  useEffect(() => {
    if (window.innerWidth > 449) return;
    const container = collageContainerRef.current;
    const img = collageImgRef.current;
    const scroller = scrollContainerRef.current;
    if (!container || !img || !scroller) return;

    // Wait for image to load so naturalWidth is available
    const setup = () => {
      const containerW = container.offsetWidth;
      // With max-w-none, image renders at natural aspect ratio for h=220px
      const imgW = img.naturalWidth * (220 / img.naturalHeight);
      // Start: image pushed 100px right (right portion visible, left clipped by overflow-hidden)
      // End: image slides left until its right edge aligns with container right edge
      const startX = 100;
      const endX = containerW - imgW; // negative value

      gsap.set(img, { x: startX });

      const ctx = gsap.context(() => {
        gsap.to(img, {
          x: endX,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            scroller,
            start: "bottom bottom",
            end: "top top",
            scrub: 1,
          },
        });
      });

      return () => ctx.revert();
    };

    let cleanup: (() => void) | undefined;
    if (img.complete && img.naturalWidth) {
      cleanup = setup();
    } else {
      img.addEventListener("load", () => { cleanup = setup(); }, { once: true });
    }

    return () => cleanup?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            className="w-full h-full object-cover object-center pointer-events-none"
            src={project.image}
          />
        </motion.div>
      </div>

      {/* Title overlaps the image by 20px */}
      <div className="px-4 -mt-5 relative z-10">
        <p className="font-['Avantt',sans-serif] font-bold text-[48px] leading-[0.86] text-white">
          {project.title}
        </p>
      </div>

      {/* Company name + Role + Description row */}
      <div className="px-4 mt-3 flex items-start gap-20 font-['Avantt',sans-serif] text-[#eaeaea]">
        {/* Left: platform */}
        <div className="shrink-0">
          <p className="text-[14px] uppercase font-semibold tracking-[0.48px]">— {project.platform}</p>
        </div>
        {/* Right: role + description */}
        <div className="flex flex-col gap-6 w-[70%]">
          <div className="flex flex-col gap-1">
            <p data-name="detail-text-line-0" className="text-[14px] uppercase font-semibold tracking-[0.48px]">My role</p>
            <p data-name="detail-text-line-1" className="text-[14px] font-normal tracking-[-0.12px]">UX/UI Designer</p>
          </div>
          <div className="flex flex-col gap-3">
            <p data-name="detail-text-line-2" className="text-[14px] uppercase font-semibold tracking-[0.48px]">Description</p>
            <SplitLines
              text="When Android needed to show the world that their devices aren't just products — they're an ecosystem — they needed more than a spec sheet. For CES, we built an immersive web experience that turned the technical story of device connectivity into something visitors could feel, not just read."
              className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full"
              animationDelay={descriptionDelay}
            />
          </div>
        </div>
      </div>

      {/* Device Collage */}
      {/* ≤449px: no margins, image starts right-aligned (half left empty), pans right on scroll */}
      {/* 450–767px: px-4 margins, full width */}
      <div
        ref={collageContainerRef}
        className="mt-[80px] overflow-hidden max-[449px]:w-full min-[450px]:px-4"
      >
        <img
          ref={collageImgRef}
          alt=""
          className="h-auto pointer-events-none rounded-lg max-[449px]:w-auto max-[449px]:max-w-none max-[449px]:h-[220px] max-[449px]:object-cover min-[450px]:w-full"
          src={imgCollage}
        />
      </div>

      {/* Challenge & Approach */}
      <div className="px-4 sm:px-[120px] mt-[80px] font-['Avantt',sans-serif] text-[#eaeaea] flex flex-col sm:flex-row sm:gap-[80px]">
        <div className="w-full sm:flex-1 flex flex-col gap-4">
          <p data-name="scroll-label"className="font-semibold text-[14px] uppercase tracking-[0.48px]">THE CHALLENGE.</p>
          <SplitLines scroller={scrollContainerRef} text="CES is the noisiest room in tech. Every brand on the floor is fighting for the same three seconds of attention. Our job was to take a complex, multi‑device ecosystem and make it immediately intuitive — to build a digital experience that didn't explain connectivity but demonstrated it, holding attention long enough for the story to land." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
        </div>
        <div className="w-full sm:flex-1 flex flex-col gap-4 mt-[48px] sm:pt-[120px] sm:mt-0">
          <p data-name="scroll-label"className="font-semibold text-[14px] uppercase tracking-[0.48px]">THE APPROACH: PARTICLES BECOME OUR DESIGN LANGUAGE</p>
          <SplitLines scroller={scrollContainerRef} text="We recognized that Android devices and Google products, like individual particles, are impressive on their own. But when they come together, they create something fundamentally different — seamless, end-to-end experiences that are greater than the sum of their parts." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
          <SplitLines scroller={scrollContainerRef} text="The particle system wasn't just a visual motif — it was the structural metaphor. Scattered elements unifying on screen mirrored the core product truth: everything is better together. This concept drove every design decision: motion that mimicked particles converging, transitions that connected isolated product stories into a unified narrative, and interactions that let users discover these connections organically." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
        </div>
      </div>

      {/* Images 1-2 */}
      <div className="flex flex-col gap-4 mt-[80px] px-4">
        <video data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" src={imgP1_1} autoPlay muted loop playsInline />
        <video data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" src={imgP1_2} autoPlay muted loop playsInline />
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_8} />
      </div>

      <div className="mt-[80px] px-4">
        <img data-scroll-img className="block w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_4} />
      </div>

      <div className="mt-[80px] overflow-hidden max-[449px]:w-full min-[450px]:px-4">
        <img data-scroll-img alt="" className="h-auto pointer-events-none rounded-lg max-[449px]:w-full min-[450px]:w-full" src={imgP1_5} />
      </div>

      {/* Images 3-6 */}
      <div className="flex flex-col gap-4 mt-[80px] px-4">
        <video data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" src={imgP1_3} autoPlay muted loop playsInline />
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_6} />
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_9} />
      </div>

      {/* Images 7-9 */}
      <div className="flex flex-col gap-4 mt-4 px-4">
        <video autoPlay muted loop playsInline data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" src={imgP1_7} />
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_8} />
      </div>

      {/* Impact / Stats */}
      <div className="px-4 sm:px-[120px] mt-[80px] flex flex-col sm:flex-row sm:gap-[80px] font-['Avantt',sans-serif] text-[#eaeaea]">
        <div className="w-full sm:flex-1 flex flex-col gap-4">
          <p data-name="scroll-label" className="font-semibold text-[14px] uppercase tracking-[0.48px]">IMPACT</p>
          <SplitLines scroller={scrollContainerRef} text="Showcase how Android devices and Google products form an interconnected ecosystem that enhances seamless connectivity. It will delightfully demonstrate their connections, promote effective synchronization and an end-to-end experience." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
        </div>
        <div className="w-full sm:flex-1 grid grid-cols-2 gap-x-8 gap-y-8 mt-[48px] sm:mt-0 sm:pt-[120px]">
          <div data-scroll-stat className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold uppercase tracking-[0.48px] leading-[1.4]">Unique visitors<br />during CES</p>
            <p className="flex items-start text-[48px] font-bold leading-[1] tracking-[-1px]">287<span className="text-[20px] mt-[4px] tracking-[0px]">+</span></p>
          </div>
          <div data-scroll-stat className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold uppercase tracking-[0.48px] leading-[1.4]">Avg. session<br />duration</p>
            <p className="flex items-start text-[48px] font-bold leading-[1] tracking-[-1px]">3<span className="text-[24px] mt-[2px] tracking-[0px]">'</span>42<span className="text-[24px] mt-[2px] tracking-[0px]">"</span></p>
          </div>
          <div data-scroll-stat className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold uppercase tracking-[0.48px] leading-[1.4]">User delight<br />score</p>
            <p className="flex items-start text-[48px] font-bold leading-[1] tracking-[-1px]">9.1<span className="flex items-baseline text-[20px] mt-[4px] tracking-[0px]">/<span className="text-[14px]">10</span></span></p>
          </div>
        </div>
      </div>

      {/* Next Project */}
      <div className="px-4 py-[80px] flex flex-col items-center gap-6">
        <p className="font-['Avantt',sans-serif] text-[14px] uppercase tracking-[0.48px] text-[#eaeaea]">NEXT PROJECT</p>
        <div
          ref={nextProjectImageRef}
          className="cursor-pointer overflow-hidden rounded-lg"
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
          <p className="font-['Avantt',sans-serif] font-bold text-[32px] text-white leading-[1.1]">{nextProject.title}</p>
          <p className="font-['Avantt',sans-serif] font-medium text-[14px] uppercase text-[#eaeaea] mt-2">— {nextProject.platform}</p>
        </div>
      </div>
    </>
  );

  const desktopLayout = (
    <>
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
        className="absolute top-0 left-1/2 z-10 overflow-hidden rounded-lg"
        data-name="hero image"
        style={{ width: heroWidth, height: heroHeight, translateX: "-50%", y: heroY }}
      >
        <GridDistortionImage
          src={project.image}
          alt={project.title}
          imgClassName="object-cover object-top"
          className="w-full h-full"
          enabled={!isMobile}
        />
      </motion.div>

      {/* Project Name - Column 3 (left-aligned) */}
      <div className="-translate-y-1/2 absolute flex flex-col gap-2 items-start left-[256px] top-1/2 w-[451px] z-20" data-name="project name">
        <p className="font-['Avantt',sans-serif] font-bold leading-[0.86] text-white text-[64px] w-full">{project.title}</p>
        <p className="font-['Avantt',sans-serif] font-medium text-[14px] text-[#eaeaea] uppercase">— {project.platform}</p>
      </div>

      {/* Right Info - Column 10, bottom-aligned with hero image */}
      <div
        className="absolute top-0 z-20 flex flex-col justify-end gap-[45px] pb-6"
        style={{ left: "75%", height: "100vh" }}
        data-name="right"
      >
        <div className="content-stretch flex flex-col gap-[16px] items-start text-[14px] w-[215px] text-[#eaeaea]" data-name="role">
          <div className="flex flex-col font-['Avantt',sans-serif] font-medium justify-end leading-[0] uppercase w-full">
            <p data-name="detail-text-line-0" className="font-semibold leading-[1.6]">My role</p>
          </div>
          <p data-name="detail-text-line-1" className="font-['Avantt',sans-serif] font-normal leading-[1.6] tracking-[-0.14px] w-full">UX/UI Designer</p>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start w-[215px] text-[#eaeaea]" data-name="team">
          <div className="flex flex-col font-['Avantt',sans-serif] font-medium justify-end leading-[0] text-[14px] uppercase w-full">
            <p data-name="detail-text-line-2" className="font-semibold leading-[1.6]">Description</p>
          </div>
          <SplitLines
            text="When Android needed to show the world that their devices aren't just products — they're an ecosystem — they needed more than a spec sheet. For CES, we built an immersive web experience that turned the technical story of device connectivity into something visitors could feel, not just read."
            className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full"
            animationDelay={descriptionDelay}
          />
        </div>
      </div>

      {/* Slider */}
      <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-end left-[24px] top-[calc(50%-874.5px)] w-[24px] z-20" data-name="slider">
        <div className="content-stretch flex gap-[10px] h-[16px] items-center relative shrink-0 w-full" data-name="Selected">
          <div className="bg-white h-[2px] shrink-0 w-[24px]" />
          <p className="font-['Avantt',sans-serif] font-normal leading-[1.6] relative shrink-0 text-[12px] text-white uppercase whitespace-nowrap">ABOUT</p>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="content-stretch flex flex-col h-[16px] items-end justify-center relative shrink-0 w-full" data-name="Inactive">
            <div className="bg-white h-[2px] shrink-0 w-[6px]" />
          </div>
        ))}
      </div>

      {/* Post-hero content — flow layout with consistent 120px section gaps */}
      <div className="absolute left-0 right-0 flex flex-col gap-[180px]" style={{ top: "calc(100vh + 120px)" }}>

        {/* Collage */}
        <div className="mx-6" data-name="collage" ref={el => { lightSectionRefs.current[2] = el; }}>
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgCollage} />
        </div>

        {/* The Challenge + Approach */}
        <div className="flex items-start justify-center" style={{ paddingLeft: 256, paddingRight: 256, gap: 'clamp(80px, calc((100vw - 1024px) / (1280 - 1024) * (240 - 80) + 80px), 240px)' }}>
          <div className="flex flex-col gap-[16px] w-[333px] font-['Avantt',sans-serif] text-[#eaeaea]">
            <p data-name="scroll-label"className="font-semibold text-[14px] uppercase tracking-[-0.12px]">THE CHALLENGE.</p>
            <SplitLines scroller={scrollContainerRef} text="CES is the noisiest room in tech. Every brand on the floor is fighting for the same three seconds of attention. Our job was to take a complex, multi‑device ecosystem and make it immediately intuitive — to build a digital experience that didn't explain connectivity but demonstrated it, holding attention long enough for the story to land." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
          </div>
          <div className="flex flex-col gap-[16px] w-[333px] font-['Avantt',sans-serif] text-[#eaeaea] pt-[180px]">
            <p data-name="scroll-label"className="font-semibold text-[14px] uppercase tracking-[-0.12px]">THE APPROACH: PARTICLES BECOME OUR DESIGN LANGUAGE</p>
            <SplitLines scroller={scrollContainerRef} text="We recognized that Android devices and Google products, like individual particles, are impressive on their own. But when they come together, they create something fundamentally different — seamless, end-to-end experiences that are greater than the sum of their parts." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
            <SplitLines scroller={scrollContainerRef} text="The particle system wasn't just a visual motif — it was the structural metaphor. Scattered elements unifying on screen mirrored the core product truth: everything is better together. This concept drove every design decision: motion that mimicked particles converging, transitions that connected isolated product stories into a unified narrative, and interactions that let users discover these connections organically." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
          </div>
        </div>

        {/* Images 1–2 */}
        <div className="mx-[256px] flex flex-col gap-[40px]" ref={el => { imageSectionRefs.current[0] = el; }}>
          <video data-scroll-img className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_1} autoPlay muted loop playsInline />
          <video data-scroll-img className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_2} autoPlay muted loop playsInline />
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_8} />
        </div>

        <div className="mx-[256px]">
          <img data-scroll-img alt="" className="block w-full h-auto pointer-events-none rounded-lg" src={imgP1_4} />
        </div>

        <div className="mx-6">
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_5} />
        </div>

        {/* Images 3–6 */}
        <div className="mx-[256px] flex flex-col gap-[40px]" ref={el => { imageSectionRefs.current[1] = el; }}>
          <video data-scroll-img className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_3} autoPlay muted loop playsInline />
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_6} />
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_9} />
        </div>

        {/* Images 7–9 */}
        <div className="mx-[256px] flex flex-col gap-[40px]" ref={el => { imageSectionRefs.current[2] = el; }}>
          <video autoPlay muted loop playsInline data-scroll-img className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_7} />
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_8} />
        </div>

        {/* Impact */}
        <div className="flex items-start justify-center" style={{ paddingLeft: 256, paddingRight: 256, gap: 'clamp(80px, calc((100vw - 1024px) / (1280 - 1024) * (240 - 80) + 80px), 240px)' }}>
          <div className="flex flex-col gap-[24px] w-[333px] font-['Avantt',sans-serif] text-[#eaeaea]">
            <p data-name="scroll-label"className="font-semibold text-[14px] uppercase tracking-[-0.12px]">IMPACT</p>
            <SplitLines scroller={scrollContainerRef} text="Showcase how Android devices and Google products form an interconnected ecosystem that enhances seamless connectivity. It will delightfully demonstrate their connections, promote effective synchronization and an end-to-end experience." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
          </div>
          <div className="grid grid-cols-2 gap-x-[80px] gap-y-[48px] w-[333px] font-['Avantt',sans-serif] text-[#eaeaea] pt-[120px]">
            <div data-scroll-stat className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-semibold uppercase tracking-[-0.12px] leading-[1.4]">Unique visitors<br />during CES</p>
              <p className="flex items-start text-[80px] lg:text-[56px] font-bold leading-[1] tracking-[-2px]">287<span className="text-[32px] lg:text-[20px] mt-[6px] tracking-[0px]">+</span></p>
            </div>
            <div data-scroll-stat className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-semibold uppercase tracking-[-0.12px] leading-[1.4]">Avg. session<br />duration</p>
              <p className="flex items-start text-[80px] lg:text-[56px] font-bold leading-[1] tracking-[-2px]">3<span className="text-[40px] lg:text-[20px] mt-[4px] tracking-[0px]">'</span>42<span className="text-[40px] lg:text-[20px] mt-[4px] tracking-[0px]">"</span></p>
            </div>
            <div data-scroll-stat className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-semibold uppercase tracking-[-0.12px] leading-[1.4]">User delight<br />score</p>
              <p className="flex items-start text-[80px] lg:text-[56px] font-bold leading-[1] tracking-[-2px]">9.1<span className="flex items-baseline text-[32px] lg:text-[20px] mt-[6px] tracking-[0px]">/<span className="text-[20px] lg:text-[14px]">10</span></span></p>
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
        <p className="absolute left-1/2 -translate-x-1/2 font-['Avantt',sans-serif] font-normal text-[#eaeaea] text-[12px] uppercase tracking-[0.48px] whitespace-nowrap" style={{ bottom: "calc(50% + 358px)" }}>
          NEXT PROJECT
        </p>

        {/* Centered image + overlapping title */}
        <div
          ref={nextProjectImageRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-lg"
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
            className="w-full h-full object-cover"
            src={nextProject.image}
          />
        </div>

        {/* Title overlapping left edge of image — mirrors gallery style */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: "256px" }}
        >
          <p className="font-['Avantt',sans-serif] font-bold leading-[62px] text-[64px] text-white">
            {nextProject.title}
          </p>
          <div className="flex flex-col font-['Avantt',sans-serif] font-medium justify-end leading-[0] text-[#eaeaea] text-[14px] uppercase mt-[8px]">
            <p className="leading-[1.6]">— {nextProject.platform}</p>
          </div>
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
      <DotGrid fixed />
      {isMobile ? mobileLayout : desktopLayout}
      <SiteFooter theme="dark" onWorkClick={handleLogoClick} />
    </div>
  );
}
