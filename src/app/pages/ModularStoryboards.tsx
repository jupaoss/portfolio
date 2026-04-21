import { useNavigate, useLocation } from "react-router";
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
import imgCollage from "../../../graphic-assets/project_4_modular_story_boards/02_modular_storyboards_collage.png";
import imgP1_1 from "../../../graphic-assets/project_4_modular_story_boards/03_modular_storyboards_intro.png";
import imgP1_2 from "../../../graphic-assets/project_4_modular_story_boards/04_modular_storyboards_scene.png";
import imgP1_3 from "../../../graphic-assets/project_4_modular_story_boards/05_modular_storyboards_bodys.png";
import imgP1_4 from "../../../graphic-assets/project_4_modular_story_boards/06_modular_storyboards_expressions.png";
import imgP1_5 from "../../../graphic-assets/project_4_modular_story_boards/07_modular_storyboards_skins.png";
import imgP1_6 from "../../../graphic-assets/project_4_modular_story_boards/08_modular_storyboards_objects.png";
import imgP1_7 from "../../../graphic-assets/project_4_modular_story_boards/09_modular_storyboards_scene.png";
import imgP1_8 from "../../../graphic-assets/project_4_modular_story_boards/10_modular_storyboards_scene.png";
import imgP1_9 from "../../../graphic-assets/project_4_modular_story_boards/11_modular_storyboards_scene.png";

const MOBILE_HERO_TOP = 0;
const MOBILE_HERO_HEIGHT = 502;
const HERO_WIDTH_PER_HEIGHT = 380 / 476;

function getTargetHeroDimensions() {
  const W = window.innerWidth;
  if (W < 1024) {
    return { width: W, height: MOBILE_HERO_HEIGHT };
  }
  const vh = window.innerHeight;
  const naturalHeight = vh;
  const naturalWidth = naturalHeight * HERO_WIDTH_PER_HEIGHT;
  if (W < 1420) {
    const maxWidth = 0.5 * W - 48;
    const width = Math.min(naturalWidth, maxWidth, 540);
    return { width, height: naturalHeight };
  }
  return { width: Math.min(naturalWidth, 540), height: naturalHeight };
}

export default function ModularStoryboards() {
  const id = "modular-storyboards";
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
  const heroRef = useRef<HTMLDivElement>(null);
  const nextProjectImageRef = useRef<HTMLDivElement>(null);
  const collageContainerRef = useRef<HTMLDivElement>(null);
  const collageImgRef = useRef<HTMLImageElement>(null);
  const isExitingRef = useRef(false);
  const isNavigatingRef = useRef(false);

  const imageBounds = (location.state as any)?.imageBounds;
  const EASE = [0.22, 1, 0.36, 1] as const;
  const initialDims = getTargetHeroDimensions();
  const heroWidth  = useMotionValue(imageBounds?.width  ?? initialDims.width);
  const heroHeight = useMotionValue(imageBounds?.height ?? initialDims.height);
  const heroY      = useMotionValue(imageBounds?.top    ?? (window.innerWidth < 1024 ? MOBILE_HERO_TOP : 0));

  const projectIndex = projects.findIndex(p => p.id === id);
  const nextProject  = projects[(projectIndex + 1) % projects.length];

  useEffect(() => {
    const d = getTargetHeroDimensions();
    if (imageBounds) {
      animate(heroWidth,  d.width,  { duration: 0.58, ease: EASE });
      animate(heroHeight, d.height, { duration: 0.58, ease: EASE });
      animate(heroY, window.innerWidth < 1024 ? MOBILE_HERO_TOP : 0, { duration: 0.58, ease: EASE });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    gsap.set('[data-name^="detail-text-line-"]', { clipPath: "inset(100% 0 0 0)", y: 40, opacity: 0.5 });
  }, []);

  const textRevealDelay = (imageBounds ? 0.02 : 0.2);
  const descriptionDelay = textRevealDelay + 0.3;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: textRevealDelay })
        .to('[data-name^="detail-text-line-"]', {
          clipPath: "inset(0% 0 0 0)", y: 0, opacity: 1,
          duration: 0.65, stagger: 0.1, ease: "power2.out",
        });
    });
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const ctx = gsap.context(() => {
      container.querySelectorAll<HTMLElement>('[data-scroll-img]').forEach(el => {
        gsap.set(el, { y: 60, opacity: 0 });
        ScrollTrigger.create({
          trigger: el, scroller: container, start: 'top 88%',
          onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }),
        });
      });
      container.querySelectorAll<HTMLElement>('[data-scroll-stat]').forEach(el => {
        const [title, number] = Array.from(el.children) as HTMLElement[];
        if (!title || !number) return;
        gsap.set([title, number], { clipPath: 'inset(100% 0 0 0)', y: 40, opacity: 0.5 });
        ScrollTrigger.create({
          trigger: el, scroller: container, start: 'top 88%',
          onEnter: () => gsap.timeline()
            .to(title,  { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' })
            .to(number, { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }, '-=0.35'),
        });
      });
      container.querySelectorAll<HTMLElement>('[data-name="scroll-label"]').forEach(el => {
        gsap.set(el, { clipPath: 'inset(100% 0 0 0)', y: 40, opacity: 0.5 });
        ScrollTrigger.create({
          trigger: el, scroller: container, start: 'top 88%',
          onEnter: () => gsap.to(el, { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' }),
        });
      });
    }, container);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const imgEl = nextProjectImageRef.current;
    if (!container || !imgEl) return;
    gsap.set(imgEl, { scale: 0.8 });
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: imgEl, scroller: container,
        start: 'center bottom', end: 'center center', scrub: true,
        onUpdate: (self) => { gsap.set(imgEl, { scale: 0.8 + 0.2 * self.progress }); },
      });
    });
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextProject.id]);

  useEffect(() => {
    const handleResize = () => {
      if (isExitingRef.current) return;
      setIsMobile(window.innerWidth < 1024);
      const d = getTargetHeroDimensions();
      animate(heroWidth, d.width,  { duration: 0.25, ease: EASE });
      animate(heroHeight, d.height, { duration: 0.25, ease: EASE });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentProject = projects.find((p) => p.id === id);
    if (!currentProject) navigate("/");
    else setProject(currentProject);
  }, [navigate]);

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
          return rect.left < elementRect.right && rect.right > elementRect.left &&
                 rect.top < elementRect.bottom && rect.bottom > elementRect.top;
        });
      const allContentRefs = [...lightSectionRefs.current, ...imageSectionRefs.current];
      setIsDarkLogo(overlaps(logoRect, lightSectionRefs.current));
      setIsDarkMenu(overlaps(menuRect, lightSectionRefs.current));
      setIsDarkText(overlaps(textRect, allContentRefs));
      setIsDarkLocation(overlaps(locationRect, allContentRefs));
    };
    checkHeaderOverlap();
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkHeaderOverlap();
          if (!isNavigatingRef.current && !isExitingRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            if (scrollTop + clientHeight >= scrollHeight - 20) {
              isNavigatingRef.current = true;
              const imgEl = nextProjectImageRef.current;
              const rect = imgEl?.getBoundingClientRect();
              navigate(`/project/${nextProject.id}`, {
                state: { imageBounds: rect ? { width: rect.width, height: rect.height, top: rect.top } : undefined },
              });
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => { scrollContainer.removeEventListener("scroll", handleScroll); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextProject.id]);

  useEffect(() => {
    if (window.innerWidth > 449) return;
    const container = collageContainerRef.current;
    const img = collageImgRef.current;
    const scroller = scrollContainerRef.current;
    if (!container || !img || !scroller) return;
    const setup = () => {
      const containerW = container.offsetWidth;
      const imgW = img.naturalWidth * (220 / img.naturalHeight);
      const startX = 100;
      const endX = containerW - imgW;
      gsap.set(img, { x: startX });
      const ctx = gsap.context(() => {
        gsap.to(img, { x: endX, ease: "power2.out",
          scrollTrigger: { trigger: container, scroller, start: "bottom bottom", end: "top top", scrub: 1 },
        });
      });
      return () => ctx.revert();
    };
    let cleanup: (() => void) | undefined;
    if (img.complete && img.naturalWidth) cleanup = setup();
    else img.addEventListener("load", () => { cleanup = setup(); }, { once: true });
    return () => cleanup?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!project) return null;

  const handleLogoClick = () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    navigate("/", {
      state: { fromProjectId: project!.id, fromHeroBounds: { width: heroWidth.get(), height: heroHeight.get() } },
    });
  };

  const mobileLayout = (
    <>
      <SiteHeader variant="light" isDarkLogo={isDarkLogo} isDarkText={isDarkText} isDarkMenu={isDarkMenu}
        isDarkLocation={isDarkLocation} logoRef={logoRef} textRef={textRef} menuRef={menuRef}
        locationRef={locationRef} onLogoClick={handleLogoClick} />

      <div className="relative" style={{ height: MOBILE_HERO_TOP + MOBILE_HERO_HEIGHT }}>
        <motion.div className="absolute left-0 right-0 overflow-hidden" style={{ height: heroHeight, y: heroY }} ref={heroRef}>
          <img alt={project.title} className="w-full h-full object-cover object-center pointer-events-none" src={project.image} />
        </motion.div>
      </div>

      <div className="px-4 -mt-5 relative z-10">
        <p className="font-['Avantt',sans-serif] font-bold text-[48px] leading-[0.86] text-black">{project.title}</p>
      </div>

      <div className="px-4 mt-3 flex items-start gap-20 font-['Avantt',sans-serif] text-black">
        <div className="shrink-0">
          <p className="text-[14px] uppercase font-bold">— {project.platform}</p>
        </div>
        <div className="flex flex-col gap-6 w-[70%]">
          <div className="flex flex-col gap-1">
            <p data-name="detail-text-line-0" className="text-[14px] uppercase font-semibold tracking-[0.48px]">My role</p>
            <p data-name="detail-text-line-1" className="text-[12px] font-normal leading-[1.6] tracking-[-0.12px]">Design System Lead & Illustration Support</p>
          </div>
          <div className="flex flex-col gap-3">
            <p data-name="detail-text-line-3" className="text-[14px] uppercase font-semibold tracking-[0.48px]">Description</p>
            <SplitLines text="A modular illustration library built in Figma that empowers anyone at Google to craft compelling storyboards for new product concepts. The system provides a flexible kit of characters, scenes, objects, and devices that snap together like building blocks, turning the pitch process from a production bottleneck into a creative accelerator." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" animationDelay={descriptionDelay} />
          </div>
        </div>
      </div>

      <div ref={collageContainerRef} className="mt-[80px] overflow-hidden max-[449px]:w-full min-[450px]:px-4">
        <img ref={collageImgRef} alt="" className="h-auto pointer-events-none rounded-lg max-[449px]:w-auto max-[449px]:max-w-none max-[449px]:h-[220px] max-[449px]:object-cover min-[450px]:w-full" src={imgCollage} />
      </div>

      <div className="px-4 sm:px-[120px] mt-[80px] font-['Avantt',sans-serif] text-black flex flex-col sm:flex-row sm:gap-[80px]">
        <div className="w-full sm:flex-1 flex flex-col gap-4">
          <p data-name="scroll-label" className="font-semibold text-[14px] uppercase tracking-[0.48px]">THE CHALLENGE.</p>
          <SplitLines scroller={scrollContainerRef} text="Our team supported Google in creating storyboards for new product concepts and ideas. The existing workflow was entirely sequential: Google shared an idea, we sketched a first draft by hand, presented it, received feedback, revised, and only then moved to final digitization. End to end, this process took approximately two weeks per storyboard — too slow for an environment where ideas move fast and momentum matters." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
        </div>
        <div className="w-full sm:flex-1 flex flex-col gap-4 mt-[48px] sm:pt-[120px] sm:mt-0">
          <p data-name="scroll-label" className="font-semibold text-[14px] uppercase tracking-[0.48px]">THE APPROACH: WE MADE STORYTELLING DRAG-AND-DROP</p>
          <SplitLines scroller={scrollContainerRef} text="Instead of redesigning the workflow, we replaced it entirely. We built a modular illustration library in Figma around four core categories: People (with interchangeable expressions, poses, accessories, hairstyles, and skin tones), Scenes, Objects, and Google Devices." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
          <SplitLines scroller={scrollContainerRef} text="Every component was designed to be mix-and-match — swap a pose, change a background, place a device in any context, all in one click. The system wasn't just a library; it was a visual grammar that anyone could speak fluently." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-[80px] px-4">
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_1} />
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_2} />
      </div>
      <div className="flex flex-col gap-4 mt-[80px] px-4">
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_3} />
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_4} />
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_5} />
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_6} />
      </div>
      <div className="flex flex-col gap-4 mt-4 px-4">
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_7} />
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_8} />
        <img data-scroll-img className="w-full object-cover pointer-events-none rounded-lg" alt="" src={imgP1_9} />
      </div>

      <div className="px-4 sm:px-[120px] mt-[80px] flex flex-col sm:flex-row sm:gap-[80px] font-['Avantt',sans-serif] text-black">
        <div className="w-full sm:flex-1 flex flex-col gap-4">
          <p data-name="scroll-label" className="font-semibold text-[14px] uppercase tracking-[0.48px]">IMPACT</p>
          <SplitLines scroller={scrollContainerRef} text="The library didn't just speed up storyboard production — it democratized visual storytelling across teams. What once required a two-week design cycle became something anyone could do in an afternoon." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
        </div>
        <div className="w-full sm:flex-1 grid grid-cols-2 gap-x-8 gap-y-8 mt-[48px] sm:mt-0 sm:pt-[120px]">
          <div data-scroll-stat className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold uppercase tracking-[0.48px] leading-[1.4]">Reduced delivery<br />time by</p>
            <p className="flex items-start text-[48px] font-bold leading-[1] tracking-[-1px]">73<span className="text-[20px] mt-[4px] tracking-[0px]">%</span></p>
          </div>
          <div data-scroll-stat className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold uppercase tracking-[0.48px] leading-[1.4]">Product scenarios<br />covered</p>
            <p className="flex items-start text-[48px] font-bold leading-[1] tracking-[-1px]">120<span className="text-[20px] mt-[4px] tracking-[0px]">+</span></p>
          </div>
          <div data-scroll-stat className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold uppercase tracking-[0.48px] leading-[1.4]">Component<br />reuse rate</p>
            <p className="flex items-start text-[48px] font-bold leading-[1] tracking-[-1px]">89<span className="text-[20px] mt-[4px] tracking-[0px]">%</span></p>
          </div>
          <div data-scroll-stat className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold uppercase tracking-[0.48px] leading-[1.4]">Google teams<br />using the library</p>
            <p className="flex items-start text-[48px] font-bold leading-[1] tracking-[-1px]">12</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-[80px] flex flex-col items-center gap-6">
        <p className="font-['Avantt',sans-serif] text-[14px] uppercase tracking-[0.48px] text-black">NEXT PROJECT</p>
        <div ref={nextProjectImageRef} className="cursor-pointer overflow-hidden rounded-lg" style={{ width: 240, height: 300 }}
          onClick={() => {
            if (isNavigatingRef.current) return;
            isNavigatingRef.current = true;
            const rect = nextProjectImageRef.current?.getBoundingClientRect();
            navigate(`/project/${nextProject.id}`, { state: { imageBounds: rect ? { width: rect.width, height: rect.height, top: rect.top } : undefined } });
          }}>
          <img alt={nextProject.title} className="w-full h-full object-cover" src={nextProject.image} />
        </div>
        <div className="text-center">
          <p className="font-['Avantt',sans-serif] font-bold text-[32px] text-black leading-[1.1]">{nextProject.title}</p>
          <p className="font-['Avantt',sans-serif] font-medium text-[14px] uppercase text-black mt-2">— {nextProject.platform}</p>
        </div>
      </div>
    </>
  );

  const desktopLayout = (
    <>
      <SiteHeader variant="light" isDarkLogo={isDarkLogo} isDarkText={isDarkText} isDarkMenu={isDarkMenu}
        isDarkLocation={isDarkLocation} logoRef={logoRef} textRef={textRef} menuRef={menuRef}
        locationRef={locationRef} onLogoClick={handleLogoClick} />

      <motion.div ref={heroRef} className="absolute top-0 left-1/2 z-10 overflow-hidden rounded-lg" data-name="hero image"
        style={{ width: heroWidth, height: heroHeight, translateX: "-50%", y: heroY }}>
        <GridDistortionImage
          src={project.image}
          alt={project.title}
          imgClassName="object-cover object-top"
          className="w-full h-full"
          enabled={!isMobile}
        />
      </motion.div>

      <div className="-translate-y-1/2 absolute flex flex-col gap-2 items-start left-[256px] top-1/2 w-[451px] z-20" data-name="project name">
        <p className="font-['Avantt',sans-serif] font-bold leading-[0.86] text-black text-[64px] w-full">{project.title}</p>
        <p className="font-['Avantt',sans-serif] font-bold text-[14px] text-black uppercase">— {project.platform}</p>
      </div>

      <div className="absolute top-0 z-20 flex flex-col justify-end gap-[45px] pb-6" style={{ left: "75%", height: "100vh" }} data-name="right">
        <div className="content-stretch flex flex-col gap-[16px] items-start text-[14px] w-[215px] text-black" data-name="role">
          <div className="flex flex-col font-['Avantt',sans-serif] font-medium justify-end leading-[0] uppercase w-full">
            <p data-name="detail-text-line-0" className="font-semibold leading-[1.6]">My role</p>
          </div>
          <p data-name="detail-text-line-1" className="font-['Avantt',sans-serif] font-normal text-[12px] leading-[1.6] tracking-[-0.12px] w-full">Design System Lead & Illustration Support</p>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start w-[215px] text-black" data-name="team">
          <div className="flex flex-col font-['Avantt',sans-serif] font-medium justify-end leading-[0] text-[14px] uppercase w-full">
            <p data-name="detail-text-line-3" className="font-semibold leading-[1.6]">Description</p>
          </div>
          <SplitLines text="A modular illustration library built in Figma that empowers anyone at Google to craft compelling storyboards for new product concepts. The system provides a flexible kit of characters, scenes, objects, and devices that snap together like building blocks, turning the pitch process from a production bottleneck into a creative accelerator." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" animationDelay={descriptionDelay} />
        </div>
      </div>

      <div className="-translate-y-1/2 absolute content-stretch flex flex-col items-end left-[24px] top-[calc(50%-874.5px)] w-[24px] z-20" data-name="slider">
        <div className="content-stretch flex gap-[10px] h-[16px] items-center relative shrink-0 w-full" data-name="Selected">
          <div className="bg-white h-[2px] shrink-0 w-[24px]" />
          <p className="font-['Avantt',sans-serif] font-normal leading-[1.6] relative shrink-0 text-[12px] text-black uppercase whitespace-nowrap">ABOUT</p>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="content-stretch flex flex-col h-[16px] items-end justify-center relative shrink-0 w-full" data-name="Inactive">
            <div className="bg-white h-[2px] shrink-0 w-[6px]" />
          </div>
        ))}
      </div>

      <div className="absolute left-0 right-0 flex flex-col gap-[180px]" style={{ top: "calc(100vh + 120px)" }}>

        <div className="mx-6" data-name="collage" ref={el => { lightSectionRefs.current[2] = el; }}>
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgCollage} />
        </div>

        <div className="flex items-start justify-center" style={{ paddingLeft: 256, paddingRight: 256, gap: 'clamp(80px, calc((100vw - 1024px) / (1280 - 1024) * (240 - 80) + 80px), 240px)' }}>
          <div className="flex flex-col gap-[16px] w-[333px] font-['Avantt',sans-serif] text-black">
            <p data-name="scroll-label" className="font-semibold text-[14px] uppercase tracking-[-0.12px]">THE CHALLENGE.</p>
            <SplitLines scroller={scrollContainerRef} text="Our team supported Google in creating storyboards for new product concepts and ideas. The existing workflow was entirely sequential: Google shared an idea, we sketched a first draft by hand, presented it, received feedback, revised, and only then moved to final digitization. End to end, this process took approximately two weeks per storyboard — too slow for an environment where ideas move fast and momentum matters." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
          </div>
          <div className="flex flex-col gap-[16px] w-[333px] font-['Avantt',sans-serif] text-black pt-[180px]">
            <p data-name="scroll-label" className="font-semibold text-[14px] uppercase tracking-[-0.12px]">THE APPROACH: WE MADE STORYTELLING DRAG-AND-DROP</p>
            <SplitLines scroller={scrollContainerRef} text="Instead of redesigning the workflow, we replaced it entirely. We built a modular illustration library in Figma around four core categories: People (with interchangeable expressions, poses, accessories, hairstyles, and skin tones), Scenes, Objects, and Google Devices." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
            <SplitLines scroller={scrollContainerRef} text="Every component was designed to be mix-and-match — swap a pose, change a background, place a device in any context, all in one click. The system wasn't just a library; it was a visual grammar that anyone could speak fluently." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
          </div>
        </div>

        <div className="mx-[256px] flex flex-col gap-[40px]" ref={el => { imageSectionRefs.current[0] = el; }}>
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_1} />
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_2} />
        </div>
        <div className="mx-[256px] flex flex-col gap-[40px]" ref={el => { imageSectionRefs.current[1] = el; }}>
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_3} />
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_4} />
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_5} />
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_6} />
        </div>
        <div className="mx-[256px] flex flex-col gap-[40px]" ref={el => { imageSectionRefs.current[2] = el; }}>
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_7} />
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_8} />
          <img data-scroll-img alt="" className="w-full h-auto pointer-events-none rounded-lg" src={imgP1_9} />
        </div>

        <div className="flex items-start justify-center" style={{ paddingLeft: 256, paddingRight: 256, gap: 'clamp(80px, calc((100vw - 1024px) / (1280 - 1024) * (240 - 80) + 80px), 240px)' }}>
          <div className="flex flex-col gap-[24px] w-[333px] font-['Avantt',sans-serif] text-black">
            <p data-name="scroll-label" className="font-semibold text-[14px] uppercase tracking-[-0.12px]">IMPACT</p>
            <SplitLines scroller={scrollContainerRef} text="The library didn't just speed up storyboard production — it democratized visual storytelling across teams. What once required a two-week design cycle became something anyone could do in an afternoon." className="font-['Avantt',sans-serif] font-normal leading-[1.6] text-[12px] tracking-[-0.12px] w-full" />
          </div>
          <div className="grid grid-cols-2 gap-x-[80px] gap-y-[48px] w-[333px] font-['Avantt',sans-serif] text-black pt-[120px]">
            <div data-scroll-stat className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-semibold uppercase tracking-[-0.12px] leading-[1.4]">Reduced delivery<br />time by</p>
              <p className="flex items-start text-[80px] lg:text-[56px] font-bold leading-[1] tracking-[-2px]">73<span className="text-[32px] lg:text-[20px] mt-[6px] tracking-[0px]">%</span></p>
            </div>
            <div data-scroll-stat className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-semibold uppercase tracking-[-0.12px] leading-[1.4]">Product scenarios<br />covered</p>
              <p className="flex items-start text-[80px] lg:text-[56px] font-bold leading-[1] tracking-[-2px]">120<span className="text-[32px] lg:text-[20px] mt-[6px] tracking-[0px]">+</span></p>
            </div>
            <div data-scroll-stat className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-semibold uppercase tracking-[-0.12px] leading-[1.4]">Component<br />reuse rate</p>
              <p className="flex items-start text-[80px] lg:text-[56px] font-bold leading-[1] tracking-[-2px]">89<span className="text-[32px] lg:text-[20px] mt-[6px] tracking-[0px]">%</span></p>
            </div>
            <div data-scroll-stat className="flex flex-col gap-[8px]">
              <p className="text-[14px] font-semibold uppercase tracking-[-0.12px] leading-[1.4]">Google teams<br />using the library</p>
              <p className="flex items-start text-[80px] lg:text-[56px] font-bold leading-[1] tracking-[-2px]">12</p>
            </div>
          </div>
        </div>

        <div className="relative w-full" style={{ height: "100vh" }} data-name="next project">
          <p className="absolute left-1/2 -translate-x-1/2 font-['Avantt',sans-serif] font-normal text-black text-[12px] uppercase tracking-[0.48px] whitespace-nowrap" style={{ bottom: "calc(50% + 358px)" }}>
            NEXT PROJECT
          </p>
          <div ref={nextProjectImageRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-lg" style={{ width: 380, height: 476 }}
            onClick={() => {
              if (isNavigatingRef.current) return;
              isNavigatingRef.current = true;
              const rect = nextProjectImageRef.current?.getBoundingClientRect();
              navigate(`/project/${nextProject.id}`, { state: { imageBounds: rect ? { width: rect.width, height: rect.height, top: rect.top } : undefined } });
            }}>
            <img alt={nextProject.title} className="w-full h-full object-cover" src={nextProject.image} />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none" style={{ left: "256px" }}>
            <p className="font-['Avantt',sans-serif] font-bold leading-[62px] text-[64px] text-black">{nextProject.title}</p>
            <div className="flex flex-col font-['Avantt',sans-serif] font-medium justify-end leading-[0] text-black text-[14px] uppercase mt-[8px]">
              <p className="leading-[1.6]">— {nextProject.platform}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div ref={scrollContainerRef} className={`bg-[#F2F3F4] relative overflow-y-auto overflow-x-hidden${isMobile ? " h-screen" : " min-h-screen min-w-[1020px]"}`} data-name={isMobile ? "Project - Mobile" : "Project - Desktop"}>
      <DotGrid fixed />
      {isMobile ? mobileLayout : desktopLayout}
      <SiteFooter onWorkClick={handleLogoClick} />
    </div>
  );
}
