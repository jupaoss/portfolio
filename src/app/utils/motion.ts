// ─────────────────────────────────────────────────────────────
// Motion constants — JS mirror of --duration-brand-* and
// --ease-brand tokens in src/styles/index.css.
//
// Use these in all GSAP and Framer Motion calls instead of
// hardcoding numbers, so token values stay in sync.
// ─────────────────────────────────────────────────────────────

// Primary easing — matches --ease-brand: cubic-bezier(0.22, 1, 0.36, 1)
export const EASE_BRAND = [0.22, 1, 0.36, 1] as const;

// Duration scale — matches --duration-brand-* tokens
export const DUR_FAST   = 0.25; // quick resize
export const DUR_SHORT  = 0.35; // reserved — not yet in use
export const DUR_BASE   = 0.4;  // slider indicator, short UI transitions
export const DUR_SLOT   = 0.55; // slot-machine spin
export const DUR_HERO   = 0.58; // hero zoom on page enter
export const DUR_SNAP   = 0.65; // primary — text reveals, image reveals, snap
export const DUR_COLORS = 0.3;  // header color shifts
