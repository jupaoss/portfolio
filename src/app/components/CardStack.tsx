import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CardConfig {
  id: string | number;
  image: string;
}

interface CardStackProps {
  cards: CardConfig[];
  width: number;
  height: number;
  /** ms cards stay centered before exiting */
  holdDuration?: number;
  /** ms between each card entering and exiting */
  enterStagger?: number;
  className?: string;
  /** fired at the midpoint of the hold phase — use to start page reveals early */
  onRevealStart?: () => void;
  /** fired after all exit animations complete */
  onComplete?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CardStack = ({
  cards,
  width,
  height,
  holdDuration = 960,
  enterStagger = 104,
  className = "",
  onRevealStart,
  onComplete,
}: CardStackProps) => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Set initial off-screen position before first browser paint — prevents flash
  useLayoutEffect(() => {
    const els = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    gsap.set(els, { xPercent: -100 });
  }, []);

  useEffect(() => {
    const els = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    // Enter back→front: last card (lowest z-index) enters first, card[0] (highest) lands on top
    const enterEls = [...els].reverse();
    // Exit all except the last card (bottom of stack, stays visible)
    const exitEls = els.slice(0, -1);

    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: () => onComplete?.() })
        .to(enterEls, {
          xPercent: 0,
          duration: 0.72,
          ease: "power2.inOut",
          stagger: enterStagger / 1000,
        })
        // First half of hold, then fire reveal, then second half
        .to({}, { duration: holdDuration * 0.5 / 1000 })
        .call(() => onRevealStart?.())
        .to({}, { duration: holdDuration * 0.5 / 1000 })
        .to(exitEls, {
          xPercent: 100,
          duration: 0.72,
          ease: "power2.inOut",
          stagger: enterStagger / 1000,
        });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      className={`relative overflow-hidden  ${className}`}
      style={{ width, height }}
    >
      {cards.map((card, i) => (
        <div
          key={card.id}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="absolute inset-0  will-change-transform overflow-hidden"
          style={{ zIndex: cards.length - i }}
        >
          <img
            src={card.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
};

export default CardStack;
