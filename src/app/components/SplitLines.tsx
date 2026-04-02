import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Per-line reveal for multi-line paragraphs.
// Measures real browser line breaks, wraps each line in its own mask, then
// animates line-by-line so each reveals independently (no single big mask).
export function SplitLines({ text, className, animationDelay = 0, stagger = 0.07, scroller }: {
  text: string;
  className?: string;
  animationDelay?: number;
  stagger?: number;
  scroller?: React.RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const revealedRef = useRef(false);
  const words = text.split(' ');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTriggerInstance: ScrollTrigger | null = null;

    const split = () => {
      container.innerHTML = '';
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.dataset.word = 'true';
        span.style.display = 'inline';
        span.textContent = (i > 0 ? ' ' : '') + word;
        container.appendChild(span);
      });

      const wordSpans = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-word]'));
      const lineMap = new Map<number, string[]>();
      wordSpans.forEach(span => {
        const top = Math.round(span.offsetTop);
        if (!lineMap.has(top)) lineMap.set(top, []);
        lineMap.get(top)!.push(span.textContent?.trim() ?? '');
      });

      container.innerHTML = '';
      const innerSpans: HTMLSpanElement[] = [];
      Array.from(lineMap.values()).forEach(lineWords => {
        const outer = document.createElement('span');
        outer.style.cssText = 'display:block; overflow:hidden';
        const inner = document.createElement('span');
        inner.style.display = 'block';
        inner.textContent = lineWords.join(' ');
        outer.appendChild(inner);
        container.appendChild(outer);
        innerSpans.push(inner);
      });

      if (revealedRef.current) {
        gsap.set(innerSpans, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)' });
      } else {
        gsap.set(innerSpans, { y: 40, opacity: 0.5, clipPath: 'inset(100% 0 0 0)' });
      }

      return innerSpans;
    };

    const attachAnimation = (innerSpans: HTMLSpanElement[]) => {
      scrollTriggerInstance?.kill();
      scrollTriggerInstance = null;

      const revealTween = () => {
        revealedRef.current = true;
        return gsap.timeline().to(innerSpans, {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger,
          ease: 'power2.out',
        });
      };

      if (scroller?.current) {
        const scrollerEl = scroller.current;
        // If the element is already above the 88% threshold at init, fire immediately
        const scrollerBounds = scrollerEl.getBoundingClientRect();
        const elemBounds = container.getBoundingClientRect();
        const relTop = elemBounds.top - scrollerBounds.top;
        if (relTop < scrollerEl.clientHeight * 0.88) {
          revealTween();
        } else {
          scrollTriggerInstance = ScrollTrigger.create({
            trigger: container,
            scroller: scrollerEl,
            start: 'top 88%',
            onEnter: revealTween,
          });
        }
      } else {
        gsap.delayedCall(animationDelay, revealTween);
      }
    };

    const spans = split();
    attachAnimation(spans);

    const ro = new ResizeObserver(() => {
      const newSpans = split();
      if (!revealedRef.current) attachAnimation(newSpans);
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      scrollTriggerInstance?.kill();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p ref={containerRef} className={className} />;
}
