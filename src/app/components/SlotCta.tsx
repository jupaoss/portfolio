import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface SlotCtaProps {
  text: string;
  /** Wrapping element — defaults to a plain span */
  as?: "span" | "a";
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/** Whole-word bottom→top reveal on hover. Reverses smoothly on leave. */
export function SlotCta({ text, as: Tag = "span", href, className = "", style, onClick }: SlotCtaProps) {
  const reelRef = useRef<HTMLSpanElement>(null);
  const tlRef   = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;
    const ctx = gsap.context(() => {
      tlRef.current = gsap.timeline({ paused: true })
        .to(reel, { y: "-1em", duration: 0.38, ease: "power2.out" });
    });
    return () => { ctx.revert(); tlRef.current = null; };
  }, []);

  const sharedProps = {
    className: `inline-block overflow-hidden cursor-pointer ${className}`,
    style: { height: "1em", lineHeight: 1, ...style },
    "data-interactive": "true",
    onMouseEnter: () => tlRef.current?.play(),
    onMouseLeave: () => tlRef.current?.reverse(),
    onClick,
    ...(Tag === "a" ? { href } : {}),
  };

  return (
    // @ts-ignore — dynamic tag
    <Tag {...sharedProps}>
      <span ref={reelRef} style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ height: "1em", lineHeight: 1, display: "block" }}>{text}</span>
        <span style={{ height: "1em", lineHeight: 1, display: "block" }}>{text}</span>
      </span>
    </Tag>
  );
}
