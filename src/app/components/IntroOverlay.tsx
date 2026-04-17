import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import svgPaths from "../../../graphic-assets/headerPaths";

const GREETINGS = ["WELCOME"];

// Timing and easing match header/footer text reveal in Home.tsx
const SPIN           = 0.55;
const STAGGER_AMOUNT = 0.18;
const HOLD           = 0.65;
const EASE_ENTER     = "power3.out";
const EASE_EXIT      = "power3.in";

// Logo height in px — must match the container's h-[20px]
const LOGO_H = 19;

// Total duration until overlay fade begins
const STAGGER_TOTAL = STAGGER_AMOUNT + SPIN;
const WORD_CYCLE    = STAGGER_TOTAL * 2 + HOLD;
const TOTAL_DUR     = (GREETINGS.length + 1) * WORD_CYCLE;

interface IntroOverlayProps {
  onRevealStart: () => void;
  onComplete: () => void;
}

export function IntroOverlay({ onRevealStart, onComplete }: IntroOverlayProps) {
  const overlayRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef      = useRef<SVGSVGElement>(null);
  const barRef       = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current!;
    const logo      = logoRef.current!;
    const overlay   = overlayRef.current!;
    const bar       = barRef.current!;

    let alive = true;

    const EXIT_Y  = "-2em";
    const ENTER_Y = "2em";

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

    const getLogoChars = () =>
      Array.from(logo.querySelectorAll<SVGGElement>("[data-logo-char]"));

    gsap.set(getLogoChars(), { y: LOGO_H });

    const ctx = gsap.context(() => {
      // Progress bar — smooth linear fill over the full sequence duration
      const proxy = { value: 0 };
      gsap.to(proxy, {
        value: 100,
        duration: TOTAL_DUR,
        ease: "none",
        onUpdate() {
          if (!alive) return;
          bar.style.width = `${proxy.value}%`;
        },
      });

      const showLogo = () => {
        if (!alive) return;
        const chars = getLogoChars();
        gsap.to(chars, {
          y: 0,
          duration: SPIN,
          stagger: { amount: STAGGER_AMOUNT },
          ease: EASE_ENTER,
          onComplete: () => {
            if (!alive) return;
            gsap.delayedCall(HOLD, () => {
              if (!alive) return;
              gsap.to(chars, {
                y: -LOGO_H,
                duration: SPIN,
                stagger: { amount: STAGGER_AMOUNT },
                ease: EASE_EXIT,
                onComplete: () => {
                  if (!alive) return;
                  onRevealStart();
                  gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.55,
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

        gsap.to(getInners(), {
          y: 0,
          duration: SPIN,
          stagger: { amount: STAGGER_AMOUNT },
          ease: EASE_ENTER,
          onComplete: () => {
            if (!alive) return;
            gsap.delayedCall(HOLD, () => {
              if (!alive) return;
              gsap.to(getInners(), {
                y: EXIT_Y,
                duration: SPIN,
                stagger: { amount: STAGGER_AMOUNT },
                ease: EASE_EXIT,
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
      className="fixed inset-0 z-[100] bg-[#ebebeb] pointer-events-none"
    >
      {/* Full-width 2px bar pinned to top edge */}
      <div className="absolute top-0 left-0 w-full h-[2px]">
        <div ref={barRef} className="h-full bg-black" style={{ width: "0%" }} />
      </div>

      {/* Centered greeting / logo area */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Letter-by-letter slot container — built dynamically by GSAP */}
        <div
          ref={containerRef}
          className="absolute font-['Avantt',sans-serif] font-bold text-[20px] leading-none text-black uppercase"
        />

        {/* Logo — each character group animates independently like greeting letters.
            Parent overflow-hidden clips the y-movement; SVG viewport does the same. */}
        <div className="absolute h-[19px] w-[59px] overflow-hidden">
          <svg
            ref={logoRef}
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 59 19"
          >
            {/* Char 0 — J */}
            <g data-logo-char="0">
              <path d={svgPaths.p79ef5c0} fill="#000000" fillRule="evenodd" clipRule="evenodd" />
            </g>
            {/* Char 1 — diagonal + dot */}
            <g data-logo-char="1">
              <path d={svgPaths.p3f2ef180} fill="#000000" />
              <path d={svgPaths.p35174f00} fill="#000000" />
            </g>
            {/* Char 2 — P */}
            <g data-logo-char="2">
              <path d={svgPaths.p23e9dd00} fill="#000000" />
            </g>
            {/* Char 3 — O */}
            <g data-logo-char="3">
              <path d={svgPaths.p37f5c380} fill="#000000" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
