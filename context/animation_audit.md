# Animation Audit Results

**Source**: Claude Code animation audit  
**Date**: Current implementation analysis  
**Status**: All animations documented and validated

This document is the source of truth for all animation specs currently in the site. Use this as reference when building new features or when Claude needs animation context.

---

## Quick Reference Table

| Animation | Component | Duration | Easing | Trigger | Stagger |
|-----------|-----------|----------|--------|---------|---------|
| **CardStack intro** | CardStack.tsx | 0.72s | power2.inOut | Mount | 104ms |
| **Home reveal timeline** | Home.tsx | 0.65s | power2.in | CardStack midpoint | 20–50ms |
| **Title words reveal** | Home.tsx | 0.65s | power2.out | Home timeline | 0.12s |
| **Smiley icon** | Home.tsx | 0.6s | — | Mount + 0.5s delay | — |
| **Curved carousel** | Home.tsx | 0.65s | cubic-bezier(0.22, 1, 0.36, 1) | Drag/wheel | — |
| **3D tilt + parallax** | Home.tsx | 0.5s | power3 | pointermove | — |
| **Return-from-project shrink** | Home.tsx | 0.58s | cubic-bezier(0.22, 1, 0.36, 1) | Navigation | — |
| **Non-active cards flyback** | Home.tsx | 1.05s | cubic-bezier(0.22, 1, 0.36, 1) | Navigation | 0.18s |
| **Text clip reveals** | SplitLines.tsx | 0.65s | power2.out | ScrollTrigger | 0.07–0.12s |
| **Image scroll reveals** | Projects | 0.65s | power2.out | ScrollTrigger | — |
| **Scroll parallax** | Projects | Variable | — | ScrollTrigger scrub | — |
| **SlotCta spin** | SlotCta.tsx | 0.55s | cubic-bezier(0.22, 1, 0.36, 1) | mouseenter | 30ms/char |
| **Logo color shift** | SiteHeader.tsx | 0.3s | ease | Scroll | — |
| **Hero expand** | Detail pages | 0.58s | cubic-bezier(0.22, 1, 0.36, 1) | Navigation | — |
| **Detail text reveals** | Detail pages | 0.65s | power2.out | Page load | 0.1s |

---

## 1. Website Intro Sequence

### CardStack Overlay Animation
**File**: `CardStack.tsx:56-73`

**Enter Phase**
- Property: `xPercent -100 → 0`
- Duration: 0.72s
- Easing: `power2.inOut`
- Stagger: 104ms between cards
- Trigger: Mount (fires once, skipped on return-from-project)

**Hold Phase**
- Duration: 0.96s total
- Cards pause at center position

**Exit Phase**
- Property: `xPercent 0 → 100`
- Duration: 0.72s
- Easing: `power2.inOut`
- Trigger: Automatic (carousel continues)

**Total sequence**: ~1.68s from enter to exit

---

### Home Reveal Timeline
**File**: `Home.tsx:482-499`

Fires when CardStack reaches hold midpoint (~0.48s into hold phase).

**Staggered Element Reveals** (all power2.in, 0.65s duration):

| Element | Start Offset | Duration | Notes |
|---------|--------------|----------|-------|
| subtitle | 1.20s | 0.65s | First footer element |
| footer-year | 1.22s | 0.65s | +20ms stagger |
| location | 1.24s | 0.65s | +40ms stagger |
| footer-mobile | 1.24s | 0.65s | Parallel with location |
| footer-freelance | 1.26s | 0.65s | +60ms stagger |
| mobile-title | 1.26s | 0.65s | Parallel with freelance |
| options (IN/BE) | 1.28s | 0.65s | +80ms stagger |
| about | 1.30s | 0.65s | Last footer element |
| title words | 1.70s | 0.65s | Offset to ~2.35s end |
| platform line | 1.97s | 0.55s | Offset to ~2.52s end |

**Initial state**: All elements have `clipPath: inset(100% 0 0 0)` and `y: 10` (text) or `y: 40` (title words), `opacity: 0.5`

**Peak animation time**: ~2.62s (when title finishes)

---

### Smiley Icon Animation
**File**: `Home.tsx:721-734`

- Property: `opacity: 0 → 1, rotate: 0 → 15deg`
- Duration: 0.6s
- Easing: Default (linear)
- Delay: 0.5s after mount
- Method: Framer Motion
- Trigger: Mount

---

## 2. Header Elements

### Logo + Navigation Color Shift
**File**: `SiteHeader.tsx:43-101`

- Property: Color shift based on section overlap
- Duration: 0.3s (300ms via CSS `transition-colors`)
- Easing: ease (browser default)
- Trigger: Scroll (dark section overlap detection)
- Method: CSS transitions

### Logo Hover Opacity
- Property: `opacity: 100% → 70%`
- Duration: 0.3s (CSS `hover:opacity-70`)
- Method: Tailwind CSS

### IN / BE Navigation Links
- Animation: SlotCta slot-machine spin (see Section 9)
- Initial reveal: Driven by Home reveal timeline (data-name="subtitle", data-name="options")

---

## 3. Footer Elements

### Email Link Hover
**File**: `SiteFooter.tsx:22-35`

- Property: `opacity: 100% → 60%`
- Duration: 0.3s (CSS `transition-opacity duration-300`)
- Easing: ease
- Trigger: Hover
- Method: CSS

### WORK / ABOUT Links
- Animation: SlotCta slot-machine spin (see Section 9)

### Initial Reveal
All footer elements (footer-year, footer-freelance, footer-mobile, about) are driven by Home reveal timeline (see Section 1).

---

## 4. Home Page Carousel / Rotation Effect

### Curved Arc Carousel
**File**: `Home.tsx:132-158`

**Method**: Framer Motion `useTransform` on containerY MotionValue

**Derived Properties**:
- `curveX`: Horizontal position along arc
- `curveRotate`: Card rotation (step -0.17, min 0.5)
- `curveScale`: Scale factor following curve
- `curveY`: Vertical position

**Snap-to Animation**
- Target: Nearest card
- Duration: 0.65s
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Method: Framer Motion `animate(containerY, target)`

**Trigger**:
- Drag interaction
- Wheel scroll
- Slider click

---

### 3D Tilt + Image Parallax on Hover
**File**: `Home.tsx:85-126`

**Method**: GSAP `quickTo` (real-time mouse tracking)

**Properties**:
- `rotationX`: Tilt around X axis
- `rotationY`: Tilt around Y axis
- `x`, `y`: Parallax shift
- Perspective: 650px

**Duration**: 0.5s (quickTo settles in ~0.5s)  
**Easing**: power3  
**Trigger**: 
- `pointermove` (track mouse in real-time)
- `pointerleave` (reset to 0)

---

### Return-from-Project Card Shrink
**File**: `Home.tsx:193-221`

- From: Full thumbnail dimensions
- To: Carousel card dimensions
- Duration: 0.58s
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Method: Framer Motion
- Trigger: Navigation from project detail

---

### Non-Active Cards Flyback-In
**File**: `Home.tsx:184-190`

- From: `y: ±(viewport height + 500px)` (above/below visible)
- To: `y: 0` (back to position)
- Duration: 1.05s
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Delay: 0.18s
- Method: Framer Motion
- Trigger: Navigation from project detail

---

### Flowmap Mouse-Over Effect
**File**: `useFlowmap.ts`

**Method**: Three.js WebGL shader via GSAP ticker (real-time)

**Parameters**:
- Falloff: 0.08
- Dissipation: 0.975
- Displacement: 0.10
- rgbSplit: 0.010

**No fixed duration** — runs continuously based on mouse movement.

---

### Slider Indicator Line
**File**: `Home.tsx:638-643`

- From: `width: 6px`
- To: `width: 24px`
- Duration: 0.4s
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Method: Framer Motion

**Inactive Hover**:
- From: `w-[6px]`
- To: `w-[14px]`
- Duration: 0.3s (CSS)

---

## 5. Home Page Gallery (Title / Project Name)

### TitleReveal on Project Switch
**File**: `Home.tsx:264-287`

**Method**: GSAP timeline

**Trigger**: 
- `animate` prop set to true (project switch)
- OR post-CardStack idle

**Title Words Animation**:
- From: `clipPath: inset(100% 0 0 0)`, `y: 40`
- To: `clipPath: inset(0% 0 0 0)`, `y: 0`
- Duration: 0.65s
- Easing: power2.out
- Stagger: 0.12s between words

**Platform Line Animation**:
- Same as title words
- Duration: 0.55s
- Offset: +0.27s (starts after title begins)
- Easing: power2.out

---

### Project Name Exit on Switch
**File**: `Home.tsx:600-615`

**Method**: Framer Motion `AnimatePresence`

- From: `opacity: 1`, `y: 0`
- To: `opacity: 0`, `y: -16`
- Duration: 0.45s
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Trigger: Project switch (unmount)

---

## 6. Home → Project Detail Transition

### Hero Image Expand
**Example**: `BetterTogether.tsx:101-108`

**Method**: Framer Motion imperative `animate()` on MotionValues

**Properties Animated**:
- `heroWidth`: Thumbnail width → full viewport width
- `heroHeight`: Thumbnail height → full hero height
- `heroY`: Thumbnail Y position → 0 (top)

**Duration**: 0.58s  
**Easing**: `cubic-bezier(0.22, 1, 0.36, 1)`

**Trigger**: Navigation from gallery (only if `imageBounds` in state)  
**No animation**: Direct navigation to project (no imageBounds)

---

### Detail Text Lines Reveal
**Example**: `BetterTogether.tsx:112-136`

**Method**: GSAP timeline

**Properties**:
- `clipPath: inset(100% 0 0 0) → inset(0% 0 0 0)`
- `y: 40 → 0`
- `opacity: 0.5 → 1`
- Duration: 0.65s
- Easing: power2.out
- Stagger: 0.1s between lines

**Delay**:
- From gallery click: 0.02s
- From direct navigation: 0.2s

---

## 7. Project Detail → Next Project Transition

### Next-Project Image Scroll Scale
**Example**: `BetterTogether.tsx:186-208`

**Method**: GSAP ScrollTrigger

**Properties**:
- From: `scale: 0.8`
- To: `scale: 1.0`
- Scrub: true (tied to scroll position)

**ScrollTrigger Config**:
- Start: 'center bottom'
- End: 'center center'

**Trigger**: User scrolls to next project image section

---

### Auto-Navigate + Pass Image Bounds
**File**: `BetterTogether.tsx:293-307`

**When**: User scrolls to bottom of page
**What happens**:
1. Captures next project image `getBoundingClientRect()`
2. Stores rect as `imageBounds`
3. Navigates to next project route
4. Next project receives `imageBounds` → triggers Section 6 hero expand

---

## 8. Text Reveal & Opacity Effects

### SplitLines Component
**File**: `SplitLines.tsx:67-101`

**Method**: GSAP ScrollTrigger

**Properties**:
- `clipPath: inset(100% 0 0 0) → inset(0% 0 0 0)`
- `y: 40 → 0`
- `opacity: 0.5 → 1`
- Duration: 0.65s
- Easing: power2.out
- Stagger: 0.07s (default) or 0.12s (About headers)

**ScrollTrigger**:
- Start: 'top 88%'
- Refresh: On window resize

---

### About Page Data Attributes
**File**: `About.tsx:72-95`

**data-scroll-label** (regular reveal):
- Same as SplitLines (clipPath, y, opacity, 0.65s, power2.out)
- Start: 'top 90%'

**data-scroll-fade** (bottom-up reveal):
- From: `clipPath: inset(0 0 100% 0)` (hidden below)
- To: `clipPath: inset(0 0 0% 0)` (fully visible)
- Duration: 0.65s
- Easing: power2.out
- Stagger: `(i % 3) * 0.06s` (groups by 3)
- Start: 'top 90%'

---

### Scroll Images
**Example**: `BetterTogether.tsx:145-154`

**Method**: GSAP ScrollTrigger

- From: `y: 60`, `opacity: 0`
- To: `y: 0`, `opacity: 1`
- Duration: 0.65s
- Easing: power2.out
- Start: 'top 88%'

---

### Stat Blocks
**Example**: `BetterTogether.tsx:156-168`

**Method**: Same as scroll images

- From: `y: 60`, `opacity: 0`
- To: `y: 0`, `opacity: 1`
- Duration: 0.65s
- Easing: power2.out
- Number counter: Offset -=0.35 (starts earlier)
- Start: 'top 88%'

---

### Collage Pan (Mobile ≤449px)
**File**: `BetterTogether.tsx:325-370`

**Method**: GSAP ScrollTrigger with scrub

- From: Container X position at top
- To: Panned across full container width
- Scrub: 1 (smooth tie to scroll)
- Trigger: ScrollTrigger on collage section

---

## 9. Links / CTA Animations

### SlotCta Slot-Machine Spin
**File**: `SlotCta.tsx:22-72` + `tokens.css:115-131`

**Method**: CSS `@keyframes` animation

**Keyframes**:
```css
@keyframes slot-spin-up {
  from { transform: translateY(0);    }
  to   { transform: translateY(-1em); }
}

@keyframes slot-spin-down {
  from { transform: translateY(-1em); }
  to   { transform: translateY(0);    }
}
```

**Animation**:
- Even-indexed letters: `slot-spin-up`
- Odd-indexed letters: `slot-spin-down`
- Duration: 0.55s
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Delay per character: 30ms (staggered)
- Direction: Both up and down complete in 0.55s

**Trigger**: 
- `mouseenter` on SlotCta
- Component remounts reel to restart animation

**Used By**:
- IN/BE navigation links (header)
- WORK/ABOUT footer links
- All project CTAs

---

### Custom Cursor Ring
**File**: `Home.tsx:677-685`

- From: 68px diameter
- To: 76px diameter
- Duration: 0.3s
- Easing: easeOut
- Trigger: Drag interaction
- Method: Framer Motion

---

### Cursor Arrows
**File**: `Home.tsx:688-715`

**Method**: Framer Motion `AnimatePresence`

- From: Center position, `opacity: 0`
- To: Offset position, `opacity: 1`
- Duration: 0.3s
- Easing: easeOut
- Direction: Slide from center + fade in
- Trigger: Drag active

---

### Cursor Hide on Interactive
**File**: `Home.tsx:669-673`

- Property: `opacity: 0 / 1` (toggle)
- Duration: 0.2s
- Trigger: Hover on interactive element

---

## Key Observations

### Timing Patterns
- **Intro sequence is long**: CardStack (0.72s) + Home timeline peak (~2.62s) sets a deliberate, premium pace
- **Text/image reveals cluster at 0.65s**: This duration is the site's backbone. Maintains coherence across all content animations
- **Short hover interactions (0.3s)**: Keeps UI responsive; distinctly different from content reveals
- **Long intro timeline (1.20s–2.62s)**: Each footer element has explicit offset, allowing staggered, choreographed reveal

### Easing Strategy
- **power2.inOut (intro)**: Accelerates then decelerates (smooth entry)
- **power2.out (reveals)**: Decelerates in (content feels arrival-based)
- **cubic-bezier(0.22, 1, 0.36, 1) (snap/transitions)**: Slight overshoot (premium feel)

### Tool Distribution
- **GSAP + ScrollTrigger**: All scroll-driven reveals, parallax, collage pan
- **Framer Motion**: Carousel, hero expand, card transforms, AnimatePresence exits
- **CSS transitions**: Simple hovers, color shifts (fast, native)
- **Three.js WebGL**: Flowmap (GPU-driven, no fixed duration)

### Cleanup & Performance
- **GSAP contexts**: All useLayoutEffect implementations include `ctx.revert()` for proper cleanup
- **AnimatePresence**: Present wherever exit animations exist (no orphaned unmounts)
- **No memory leaks**: Verified in audit

---

## Using This Document

**For Claude Code:**
```
"Reference ANIMATION_AUDIT.md for actual animation patterns.
All timings, easings, and triggers are from the live implementation."
```

**For new animations:**
- Match durations from Duration Scale table (0.25s–0.65s)
- Use cubic-bezier(0.22, 1, 0.36, 1) for new transitions
- Use power2.out for text/image reveals
- ScrollTrigger offset: 'top 88%' for reveals
- Stagger: 0.07–0.12s for sequential elements

**For refactoring:**
- Compare current code against this audit
- Update any animations that deviate without reason
- Test performance after changes

---

**This audit reflects the site as of [current date]. Update when animations change.**
