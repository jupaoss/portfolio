import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import svgPaths from "@/assets/headerPaths";

const GREETINGS = ["Hello", "你好", "Hola"];

// Timing and easing match header/footer text reveal in Home.tsx
const SPIN    = 0.45;
const STAGGER = 0.06;
const HOLD    = 0.72;
const EASE    = "power2.in";

// Logo height in px — must match the container's h-[20px]
const LOGO_H = 20;

interface IntroOverlayProps {
  onRevealStart: () => void;
  onComplete: () => void;
}

export function IntroOverlay({ onRevealStart, onComplete }: IntroOverlayProps) {
  const overlayRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef      = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current!;
    const logo      = logoRef.current!;
    const overlay   = overlayRef.current!;

    // Alive flag prevents new tweens starting after unmount
    let alive = true;

    // All letters enter from bottom, exit to top
    const EXIT_Y  = "-2em";
    const ENTER_Y = "2em";

    // Build per-letter DOM: each letter is an overflow:hidden clip with an inner span
    const setLetters = (text: string, startY: string) => {
      if (!alive) return;
      container.innerHTML = "";
      [...text].forEach((char, i) => {
        const clip = document.createElement("span");
        clip.style.cssText = "overflow:hidden;display:inline-block;height:1em;vertical-align:bottom";
        const inner = document.createElement("span");
        inner.dataset.letter = String(i);
        inner.style.cssText = "display:block;height:1em;line-height:1";
        inner.textContent = char;
        gsap.set(inner, { y: startY });
        clip.appendChild(inner);
        container.appendChild(clip);
      });
    };

    const getInners = () =>
      Array.from(container.querySelectorAll<HTMLElement>("[data-letter]"));

    // Each logo character group starts below the viewport (clipped by parent overflow-hidden)
    const getLogoChars = () =>
      Array.from(logo.querySelectorAll<SVGGElement>("[data-logo-char]"));

    gsap.set(getLogoChars(), { y: LOGO_H });

    const ctx = gsap.context(() => {
      const showLogo = () => {
        if (!alive) return;
        const chars = getLogoChars();
        // Enter each character from bottom — same stagger as greeting text
        gsap.to(chars, {
          y: 0,
          duration: SPIN,
          stagger: STAGGER,
          ease: EASE,
          onComplete: () => {
            if (!alive) return;
            gsap.delayedCall(HOLD, () => {
              if (!alive) return;
              // Exit each character to top
              gsap.to(chars, {
                y: -LOGO_H,
                duration: SPIN,
                stagger: STAGGER,
                ease: EASE,
                onComplete: () => {
                  if (!alive) return;
                  onRevealStart();
                  gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.45,
                    ease: "power2.inOut",
                    onComplete,
                  });
                },
              });
            });
          },
        });
      };

      const animate = (index: number) => {
        if (!alive) return;
        setLetters(GREETINGS[index], ENTER_Y);

        // Spin letters in
        gsap.to(getInners(), {
          y: 0,
          duration: SPIN,
          stagger: STAGGER,
          ease: EASE,
          onComplete: () => {
            if (!alive) return;
            gsap.delayedCall(HOLD, () => {
              if (!alive) return;
              // Spin letters out
              gsap.to(getInners(), {
                y: EXIT_Y,
                duration: SPIN,
                stagger: STAGGER,
                ease: EASE,
                onComplete: () => {
                  if (!alive) return;
                  if (index + 1 < GREETINGS.length) {
                    animate(index + 1);
                  } else {
                    container.innerHTML = "";
                    showLogo();
                  }
                },
              });
            });
          },
        });
      };

      animate(0);
    }, overlay);

    return () => {
      alive = false;
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-white pointer-events-none"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Letter-by-letter slot container — built dynamically by GSAP */}
        <div
          ref={containerRef}
          className="absolute font-['Space_Grotesk',sans-serif] font-medium text-[20px] leading-none text-black uppercase"
        />

        {/* Logo — each character group animates independently like greeting letters.
            Parent overflow-hidden clips the y-movement; SVG viewport does the same. */}
        <div className="absolute h-[20px] w-[58.962px] overflow-hidden">
          <svg
            ref={logoRef}
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 58.9619 20"
          >
            {/* Char 0 — J (x: 0–12) */}
            <g data-logo-char="0">
              <path d={svgPaths.p79ef5c0} fill="#404040" />
            </g>
            {/* Char 1 — diagonal stroke character (x: 11–25) */}
            <g data-logo-char="1">
              <path d={svgPaths.p3f2ef180} fill="#404040" />
              <path d={svgPaths.p3d018e00} fill="#404040" />
              <path d={svgPaths.p35174f00} fill="#404040" />
            </g>
            {/* Char 2 — P (x: 26–40) */}
            <g data-logo-char="2">
              <path d={svgPaths.p23e9dd00} fill="#404040" />
            </g>
            {/* Char 3 — O (x: 42–59) */}
            <g data-logo-char="3">
              <path d={svgPaths.p37f5c380} fill="#404040" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
