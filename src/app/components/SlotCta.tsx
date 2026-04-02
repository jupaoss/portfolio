import { useState } from "react";

// Number of letter copies in each reel (= number of visible "spins")
const SPINS = 1;

interface SlotCtaProps {
  text: string;
  /** Wrapping element — defaults to a plain span */
  as?: "span" | "a";
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Slot-machine CTA hover effect.
 * Each letter is a mini reel with SPINS+1 copies.
 * Even-indexed letters spin upward; odd-indexed letters spin downward.
 * Triggering a new hover while animating restarts each reel cleanly.
 */
export function SlotCta({ text, as: Tag = "span", href, className = "", style, onClick }: SlotCtaProps) {
  const [animKey, setAnimKey] = useState(0);

  const sharedProps = {
    className: `inline-flex items-center cursor-pointer ${className}`,
    style: { lineHeight: 1, ...style },
    onMouseEnter: () => setAnimKey(k => k + 1),
    onClick,
    ...(Tag === "a" ? { href } : {}),
  };

  return (
    // @ts-ignore — dynamic tag
    <Tag {...sharedProps}>
      {text.split("").map((char, i) => {
        const isUp = i % 2 === 0;
        return (
          // Clipping window — exactly 1 character tall
          <span
            key={i}
            className="overflow-hidden inline-block"
            style={{ height: "1em" }}
          >
            {/* Reel — remounted on each hover via key change to restart the animation */}
            <span
              key={`${i}-${animKey}`}
              className={animKey > 0 ? (isUp ? "slot-spin-up" : "slot-spin-down") : ""}
              style={{
                display: "flex",
                flexDirection: "column",
                transform: "translateY(0)",
                animationDelay: `${i * 0.03}s`,
              }}
            >
              {Array(SPINS + 1)
                .fill(char)
                .map((c, j) => (
                  <span
                    key={j}
                    style={{ height: "1em", lineHeight: 1, display: "block" }}
                  >
                    {c}
                  </span>
                ))}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
