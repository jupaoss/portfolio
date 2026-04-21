import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DotGrid } from "../components/DotGrid";
import { SiteHeader } from "../components/SiteHeader";
import { SplitLines } from "../components/SplitLines";
import { SiteFooter } from "../components/SiteFooter";
import { projects } from "../data/projects";
import julianPhoto from "../../../graphic-assets/about/julian.png";
import logoGoogle from "../../../graphic-assets/about/logos/google.svg";
import logoAndroid from "../../../graphic-assets/about/logos/android.svg";
import logoUber from "../../../graphic-assets/about/logos/uber.svg";
import logoVerizon from "../../../graphic-assets/about/logos/vz.svg";
import logoOkta from "../../../graphic-assets/about/logos/okta.svg";
import logoCocaCola from "../../../graphic-assets/about/logos/cc.svg";
import logoBBVA from "../../../graphic-assets/about/logos/bbva.svg";
import logoWinterCircus from "../../../graphic-assets/about/logos/wintercircus.svg";
import logoUSAA from "../../../graphic-assets/about/logos/usaa.svg";
import logoDalton from "../../../graphic-assets/about/logos/dalton.svg";
import logoNestle from "../../../graphic-assets/about/logos/nestle.svg";
import logoUpsellPlus from "../../../graphic-assets/about/logos/upsellplus.svg";
import logoBancolombia from "../../../graphic-assets/about/logos/bancolombia.svg";
import logoSura from "../../../graphic-assets/about/logos/sura.svg";
import logoKawasaki from "../../../graphic-assets/about/logos/kawasaki.svg";
import logoKTM from "../../../graphic-assets/about/logos/ktm.svg";
import logoProteccion from "../../../graphic-assets/about/logos/proteccion.svg";
import logoAvon from "../../../graphic-assets/about/logos/avon.svg";

gsap.registerPlugin(ScrollTrigger);

function TriangleBullet() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ transform: "rotate(90deg)", flexShrink: 0 }}>
      <path d="M4 0L5.73205 3H2.26795L4 0Z" fill="currentColor" transform="scale(1.2) translate(-0.667 -0.667)" />
    </svg>
  );
}

// Word-by-word reveal matching the Home hero title animation.
// Uses useLayoutEffect to hide words before first paint — no flash.
function HeroReveal({ lines, className, delay = 0.1, stagger = 0.12 }: {
  lines: string[];
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ctx = gsap.context(() => {
      const els = wrapper.querySelectorAll<HTMLElement>("p");
      gsap.set(els, { clipPath: "inset(100% 0 0 0)", y: 20, opacity: 0 });
      gsap.timeline({ delay }).to(els, {
        clipPath: "inset(0% 0 0 0)",
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger,
        ease: "power2.out",
      });
    }, wrapper);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef}>
      {lines.map((line, i) => (
        <p key={i} className={className} style={{ paddingTop: '0.15em', marginTop: '-0.15em' }}>{line}</p>
      ))}
    </div>
  );
}

const BRANDS = [
  { name: "Google",        logo: logoGoogle },
  { name: "Android",       logo: logoAndroid },
  { name: "Uber",          logo: logoUber },
  { name: "Verizon",       logo: logoVerizon },
  { name: "Okta",          logo: logoOkta },
  { name: "Coca-Cola",     logo: logoCocaCola },
  { name: "BBVA",          logo: logoBBVA },
  { name: "Winter Circus", logo: logoWinterCircus },
  { name: "USAA",          logo: logoUSAA },
  { name: "Dalton",        logo: logoDalton },
  { name: "Nestlé",        logo: logoNestle },
  { name: "UpsellPlus",    logo: logoUpsellPlus },
  { name: "Bancolombia",   logo: logoBancolombia },
  { name: "Sura",          logo: logoSura },
  { name: "Kawasaki",      logo: logoKawasaki },
  { name: "KTM",           logo: logoKTM },
  { name: "Protección",    logo: logoProteccion },
  { name: "Avon",          logo: logoAvon },
];

const EXPERIENCE = [
  { role: "SR. EXPERIENCE DESIGNER", company: "PUBLICIS SAPIENT", period: "2023 — PRESENT" },
  { role: "SR. VISUAL DESIGNER",    company: "HUGE",              period: "2020 — 2023" },
  { role: "UX/UI DESIGNER",         company: "PROPELLAND (CDMX)", period: "2018 — 2020" },
  { role: "UXCO SPECIALIST",        company: "CHEF COMPANY",      period: "2015 — 2017" },
  { role: "DESIGNER",               company: "PRAGMA S.A.",       period: "2014 — 2015" },
];

export default function About() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bioListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const handleLogoClick = () => {
    navigate("/", { state: { fromProjectId: projects[0].id, fromAbout: true, fromHeroBounds: { width: window.innerWidth, height: window.innerHeight } } });
  };

  // Intercept trackpad swipe-right (browser back) to use the same transition as logo click
  useEffect(() => {
    window.history.pushState({ backGuard: true }, "");
    const onPopState = () => {
      window.history.pushState({ backGuard: true }, "");
      handleLogoClick();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Scroll-triggered reveal for labels + paragraphs
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const ctx = gsap.context(() => {
      scroller.querySelectorAll<HTMLElement>("[data-scroll-label], [data-scroll-fade]").forEach((el, i) => {
        gsap.set(el, { clipPath: "inset(100% 0 0 0)", y: 8, opacity: 0 });
        ScrollTrigger.create({
          trigger: el, scroller,
          start: "top 90%",
          onEnter: () => gsap.to(el, {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power2.out",
            delay: (i % 3) * 0.06,
          }),
        });
      });
    }, scroller);

    return () => ctx.revert();
  }, []);

  // Animate bio list items: large init delay (wait for paragraphs) vs. small scroll delay
  useEffect(() => {
    const scroller = scrollRef.current;
    const list = bioListRef.current;
    if (!scroller || !list) return;

    let isInit = true;
    requestAnimationFrame(() => { isInit = false; });

    const ctx = gsap.context(() => {
      const items = Array.from(list.querySelectorAll<HTMLElement>('li'));
      gsap.set(items, { clipPath: 'inset(100% 0 0 0)', y: 8, opacity: 0 });
      ScrollTrigger.create({
        trigger: list,
        scroller,
        start: 'top 90%',
        onEnter: () => {
          items.forEach((item, idx) => {
            gsap.to(item, {
              clipPath: 'inset(0% 0 0 0)',
              y: 0,
              opacity: 1,
              duration: 0.65,
              ease: 'power2.out',
              delay: isInit ? 2.8 + idx * 0.2 : idx * 0.15,
            });
          });
        },
      });
    }, list);

    return () => ctx.revert();
  }, []);

  // ─── Mobile ────────────────────────────────────────────────────────────────
  const mobileLayout = (
    <>
      <SiteHeader variant="dynamic" isDarkLogo={false} isDarkText={false} isDarkMenu={false} isDarkLocation={false} onLogoClick={handleLogoClick} />

      {/* Name */}
      <div className="px-4 sm:px-[120px] flex flex-col sm:flex-row sm:gap-[80px] justify-end sm:items-end relative" style={{ height: 600 }}>
        <img
          src={julianPhoto}
          alt="Julián Patiño"
          className="absolute object-cover object-top pointer-events-none select-none hidden"
          style={{
            top: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            height: "220%",
            width: "auto",
            maskImage: "radial-gradient(ellipse 55% 80% at 50% 15%, black 20%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 55% 80% at 50% 15%, black 20%, transparent 72%)",
          }}
        />
        <div className="hidden sm:block sm:flex-1 relative z-10" />
        <div className="sm:flex-1 pb-[40px] relative z-10">
          <HeroReveal lines={["JULIÁN", "PATIÑO", "OSSA"]} delay={0.1} className="font-['Avantt',sans-serif] font-bold text-[56px] leading-[0.9] text-white uppercase" />
        </div>
      </div>

      {/* Based on + Role/Bio */}
      <div className="px-4 sm:px-[120px] mt-[48px] flex flex-col sm:flex-row sm:gap-[80px] font-['Avantt',sans-serif] text-[#eaeaea]">
        <div className="w-full sm:flex-1 flex flex-col gap-4">
          <HeroReveal lines={["Based on"]} delay={0.22} className="text-[12px] uppercase tracking-[0.48px]" />
          <HeroReveal lines={["MDE, COL"]} delay={0.28} className="font-bold text-[40px] leading-[0.9] text-white uppercase" />
        </div>
        <div className="w-full sm:flex-1 flex flex-col gap-6 mt-[48px] sm:mt-0">
          <HeroReveal lines={["SOFTWARE &", "EXPERIENCE", "DESIGNER"]} delay={0.42} className="font-['Avantt',sans-serif] font-bold text-[32px] leading-[1.0] text-white uppercase" />
          <div className="flex flex-col gap-4 font-normal text-[12px] leading-[1.5] tracking-[-0.12px]">
            <SplitLines scroller={scrollRef} animationDelay={0} text="During my career I've had the opportunity to work in projects that span from pure upstream concept work to ready to ship products." />
            <SplitLines scroller={scrollRef} animationDelay={0.9} text="I've also worked in UX/UI projects in different global agencies and startups focused on building innovative strategies and product engineering, where I've been involved in the entire building process." />
            <SplitLines scroller={scrollRef} animationDelay={1.9} text="These are some key principles I always look for when designing:" />
            <ul ref={bioListRef} className="flex flex-col gap-1">
              <li className="flex items-center gap-[6px]"><TriangleBullet />Make people's life easier</li>
              <li className="flex items-center gap-[6px]"><TriangleBullet />Create delightful experiences</li>
              <li className="flex items-center gap-[6px]"><TriangleBullet />Generate emotional connections</li>
              <li className="flex items-center gap-[6px]"><TriangleBullet />Build accessible productos for everyone.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="px-4 sm:px-[120px] mt-[80px] flex flex-col sm:flex-row sm:gap-[80px] font-['Avantt',sans-serif] text-[#eaeaea]">
        <div className="w-full sm:flex-1 flex flex-col gap-4">
          <p className="text-[12px] uppercase tracking-[0.48px]">Prior Experience</p>
          <p className="flex items-start font-bold text-[48px] leading-[1] tracking-[-2px] text-white">5</p>
        </div>
        <div className="w-full sm:flex-1 mt-[48px] sm:mt-0">
          {EXPERIENCE.map((item, i) => (
            <div key={i} data-scroll-fade className="py-5 flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <p className="text-[11px] uppercase tracking-[0.48px] text-[#eaeaea]/60">{item.role}</p>
                <p className="text-[11px] uppercase tracking-[0.48px] text-[#eaeaea]/60">{item.period}</p>
              </div>
              <p className="font-bold text-[24px] leading-[1.1] text-white uppercase">{item.company}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="px-4 sm:px-[120px] mt-[80px] pb-[80px] flex flex-col sm:flex-row sm:gap-[80px] font-['Avantt',sans-serif] text-[#eaeaea]">
        <div className="w-full sm:flex-1 flex flex-col gap-4">
          <p className="text-[12px] uppercase tracking-[0.48px]">Brands &amp; Organizations</p>
          <p className="flex items-start font-bold text-[48px] leading-[1] tracking-[-2px] text-white">22<span className="text-[20px] mt-[4px]">+</span></p>
        </div>
        <div className="w-full sm:flex-1 mt-[48px] sm:mt-0">
          <div className="grid grid-cols-3 gap-x-4 gap-y-8">
            {BRANDS.map((brand, i) => (
              <div key={i} data-scroll-fade className="flex items-center justify-start h-[40px]">
                <img src={brand.logo} alt={brand.name} className="w-[110px] h-[100px] object-contain object-left brightness-0 invert" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  // ─── Desktop ───────────────────────────────────────────────────────────────
  const desktopLayout = (
    <>
      <SiteHeader variant="dynamic" isDarkLogo={false} isDarkText={false} isDarkMenu={false} isDarkLocation={false} onLogoClick={handleLogoClick} />

      {/* Name — 800px hero, vertically centered */}
      <div className="flex items-center relative" style={{ height: 600, paddingLeft: 256, paddingRight: 256, gap: "clamp(80px, calc((100vw - 1024px) / (1280 - 1024) * (240 - 80) + 80px), 240px)" }}>
        <img
          src={julianPhoto}
          alt="Julián Patiño"
          className="absolute object-cover object-top pointer-events-none select-none hidden"
          style={{
            top: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            height: "220%",
            width: "auto",
            maskImage: "radial-gradient(ellipse 55% 80% at 50% 15%, black 20%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse 55% 80% at 50% 15%, black 20%, transparent 72%)",
          }}
        />
        <div className="w-[333px] relative z-10" />
        <div className="w-[444px] relative z-10">
          <HeroReveal lines={["JULIÁN", "PATIÑO", "OSSA"]} delay={0.1} className="font-['Avantt',sans-serif] font-bold text-[64px] leading-[0.86] text-white uppercase" />
        </div>
      </div>

      {/* Post-hero content */}
      <div className="flex flex-col gap-[260px] xl:gap-[190px] pb-[120px]">

        {/* Based on + Role/Bio row */}
        <div className="flex items-start" style={{ paddingLeft: 256, paddingRight: 256, gap: "clamp(80px, calc((100vw - 1024px) / (1280 - 1024) * (240 - 80) + 80px), 240px)" }}>
          {/* Left */}
          <div className="flex flex-col gap-[16px] w-[333px] font-['Avantt',sans-serif] text-[#eaeaea]">
            <HeroReveal lines={["Based on"]} delay={0.22} className="text-[12px] uppercase tracking-[0.48px] font-medium" />
            <HeroReveal lines={["MDE, COL"]} delay={0.28} className="font-bold text-[56px] leading-[0.9] text-white uppercase" />
          </div>
          {/* Right — pt matches label height (12px) + gap (16px) to align heading with MDE, COL */}
          <div className="flex flex-col gap-[24px] w-[444px] font-['Avantt',sans-serif] text-[#eaeaea] pt-[28px]">
            <HeroReveal lines={["SOFTWARE &", "EXPERIENCE", "DESIGNER"]} delay={0.42} className="font-['Avantt',sans-serif] font-bold text-[40px] leading-[1.0] text-white uppercase" />
            <div className="flex flex-col gap-4 font-normal text-[12px] leading-[1.6] tracking-[-0.12px]">
              <SplitLines scroller={scrollRef} animationDelay={0} text={"Over the course of my career, I’ve worked on a wide range of projects — from early‑stage concept exploration to fully designed, ready-to-ship products."} />
              <SplitLines scroller={scrollRef} animationDelay={0.9} text="I’ve collaborated with global agencies and startups across UX and product design initiatives, helping shape strategies and build thoughtful, scalable experiences. Throughout these engagements, I’ve been involved across the full product lifecycle, working closely with cross-functional teams from discovery and definition to design and delivery." />
              <SplitLines scroller={scrollRef} animationDelay={2.0} text="These are some key principles I always look for when designing:" />
              <ul ref={bioListRef} className="flex flex-col gap-1">
                <li className="flex items-center gap-[6px]"><TriangleBullet />Make people’s lives easier</li>
                <li className="flex items-center gap-[6px]"><TriangleBullet />Create thoughtful, delightful experiences</li>
                <li className="flex items-center gap-[6px]"><TriangleBullet />Foster meaningful emotional connections</li>
                <li className="flex items-center gap-[6px]"><TriangleBullet />Design accessible products for everyone</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-start" style={{ paddingLeft: 256, paddingRight: 256, gap: "clamp(80px, calc((100vw - 1024px) / (1280 - 1024) * (240 - 80) + 80px), 240px)" }}>
          {/* Left */}
          <div className="flex flex-col gap-[24px] w-[333px] font-['Avantt',sans-serif] text-[#eaeaea]">
            <p data-scroll-label className="text-[12px] uppercase tracking-[0.48px] font-medium">Prior Experience</p>
            <p className="flex items-start font-bold text-[56px] leading-[1] tracking-[-2px] text-white" data-scroll-fade>5</p>
          </div>
          {/* Right */}
          <div className="flex flex-col w-[444px] font-['Avantt',sans-serif] text-[#eaeaea]">
            {EXPERIENCE.map((item, i) => (
              <div key={i} data-scroll-fade className="py-5 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <p className="text-[11px] uppercase tracking-[0.48px] text-[#eaeaea]/60">{item.role}</p>
                  <p className="text-[11px] uppercase tracking-[0.48px] text-[#eaeaea]/60">{item.period}</p>
                </div>
                <p className="font-bold text-[28px] leading-[1.1] text-white uppercase">{item.company}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="flex items-start" style={{ paddingLeft: 256, paddingRight: 256, gap: "clamp(80px, calc((100vw - 1024px) / (1280 - 1024) * (240 - 80) + 80px), 240px)" }}>
          {/* Left */}
          <div className="flex flex-col gap-[24px] w-[333px] font-['Avantt',sans-serif] text-[#eaeaea]">
            <p data-scroll-label className="text-[12px] uppercase tracking-[0.48px] font-medium">Brands &amp; Organizations</p>
            <p className="flex items-start font-bold text-[56px] leading-[1] tracking-[-2px] text-white" data-scroll-fade>
              22<span className="text-[20px] mt-[4px]">+</span>
            </p>
          </div>
          {/* Right */}
          <div className="grid grid-cols-3 gap-x-[16px] gap-y-[24px] xl:gap-y-[40px] w-[444px]">
            {BRANDS.map((brand, i) => (
              <div key={i} data-scroll-fade className="flex items-center justify-start h-[40px]">
                <img src={brand.logo} alt={brand.name} className="w-[110px] h-[100px] object-contain object-left brightness-0 invert" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );

  return (
    <div
      ref={scrollRef}
      className={`bg-black relative overflow-y-auto overflow-x-hidden h-screen${isMobile ? "" : " min-w-[1020px]"}`}
      data-name={isMobile ? "About - Mobile" : "About - Desktop"}
    >
      <DotGrid fixed />
      {isMobile ? mobileLayout : desktopLayout}
      <SiteFooter theme="dark" onWorkClick={handleLogoClick} />
    </div>
  );
}
