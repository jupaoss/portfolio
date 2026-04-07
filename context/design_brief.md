# Design Brief — Awwwards-Worthy Portfolio

## Core Thesis
A sophisticated, minimal portfolio that demonstrates 10+ years of strategic product design through elegant scroll-driven animations, refined typography, and a gallery-as-hero approach. Every interaction reinforces seniority and intentionality.

---

## Visual Direction & References

**Primary aesthetic**: Minimal, refined, premium
- **Gallery style**: DesignEmbraced (grid reveal on scroll, sophisticated spacing)
- **Visual polish**: Nothing.tech (clean typography, purposeful whitespace, understated interactions)
- **Animation quality**: Studio Lumio Props (smooth transitions, staggered reveals, subtle depth)
- **Mood**: Deliberate, confident, timeless

---

## Design System (UI Kit Specs)

### Colors
**Foundational colors** (consistent across all projects):
- **#131313**: Use for typography on light surfaces, and for dark backgrounds (instead of pure black)
- **#FFFFFF**: Use for typography on dark surfaces and for light backgrounds

**Project-specific colors**: Page backgrounds vary by brand being showcased. Extract accent colors from each project's context.

**Usage pattern:**
- Text: #131313 on light, #FFFFFF on dark
- Backgrounds: Project-dependent (light or dark per case study)
- Accents: Determined by featured brand/project
- Links: Accent color with animation on hover

---

### Typography Scale
All type scales are CSS custom properties:

| Usage | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|-----------------|
| **Display** (hero titles) | 80px | 400–700 | 0.86 (86% of height) | 0px |
| **H1** (project titles) | 48px | 400–700 | 1.1 | 0px |
| **H2** (section titles) | 36px | 400–700 | 1.1 | 0px |
| **Body** (case study copy) | 16px | 400–500 | 1.6 (readable) | 0px |
| **Label** (roles, metadata) | 14px | 400–700 | 1 (none) | +0.48px (caps) |
| **Caption** (nav, footer) | 12px | 400–500 | 1 (none) | +0.48px |

**Font weights available:**
- 400 (normal)
- 500 (medium)
- 700 (bold)

**Font family**: [Specified in your existing Vite setup; confirm actual family name]

---

### Spacing System
**Base unit**: 4px increments (multiples of 4, not 8)

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-brand-1` | 4px | micro spacing |
| `--spacing-brand-2` | 8px | minimal gaps |
| `--spacing-brand-3` | 12px | small padding |
| `--spacing-brand-4` | 16px | image margins, inner gaps |
| `--spacing-brand-6` | 24px | header padding, column gap |
| `--spacing-brand-8` | 32px | nav-to-hero gap |
| `--spacing-brand-10` | 40px | desktop image-to-image gap |
| `--spacing-brand-20` | 80px | mobile section gap |
| `--spacing-brand-30` | 120px | desktop section gap |

---

### Layout Grid
**Desktop Container**: 
- Max-width: ~1280px
- Inset (padding left/right): 24px from viewport edge
- Usable width: ~1232px

**Header**:
- Height: 80px (desktop), 60px (mobile)
- Logo: 20px height × 58.962px width
- Column 1 (logo): 0px from left edge
- Column 2 (subtitle): 232px from left edge
- Column 3 (location): 75% from left edge

**Gallery Cards**:
- Width: 380px
- Height: 476px
- Gap between cards: Determined by carousel/grid layout

**Hero Section (mobile)**:
- Top offset: 92px (nav 60px + 32px gap)
- Height: 410px

**Border Radius**:
- Small: 4px (icons, small components)
- Medium: 8px (cards, containers)
- Large: 10px (featured images)

**Z-index**:
- Navigation: z-50 (Tailwind)
- Gallery: z-10
- Overlay: z-40

---

## Page Templates & Animation Strategy

### 1. Home Page (Gallery as Hero)

**Structure:**
- Header/Navigation (persistent, minimal)
- Hero section with tagline (optional, depends on Figma)
- **Project Gallery** (main focal point)
- CTA section (explore work, contact)
- Footer

**Gallery Animation Approach:**
- **Grid layout**: [Masonry, regular grid, or asymmetric? Confirm in Figma]
- **Reveal pattern**: Staggered fade-in + subtle scale on scroll (0.9 → 1)
- **Timing**: 
  - Each item: 300–400ms
  - Stagger: 50–80ms between items
  - Total reveal: 1.5–2s for full gallery
- **Parallax**: Mild (10–20px vertical shift) on scroll, NOT aggressive
- **Hover state**: 
  - Image: +2% scale, slight glow or opacity shift
  - Card: Subtle shadow expansion
  - Duration: 200ms (snappy)
- **Click/Navigation**: Fade to black → project detail page loads (200ms transition)

**Performance note:** Limit gallery to visible viewport; lazy load images below fold

---

### 2. Project Detail Page (Storytelling + Seniority)

**Structure:**
- Hero image/video (full width, parallax scroll)
- Project metadata (client, role, year, team size)
- Problem statement (communicate strategic thinking)
- Case study sections (discovery → strategy → execution → outcomes)
- Gallery or embedded media (process work, iterations)
- Impact stats (numbers that show seniority)
- Next project CTA (related work)

**Storytelling Through Design:**
- **Typography hierarchy**: Use Display for problem, Heading for section titles
- **White space**: Generous (40% of page should be empty space)
- **Copy tone**: Conceptual, outcome-driven. Example: "Transformed user retention through deliberate information architecture"
- **Section transitions**: Fade-in as user scrolls; stagger text blocks

**Animation Moments:**
- **Hero image**: Parallax on scroll (20–30px, GPU-accelerated)
- **Section headings**: Fade-in + slight translate-y (-20px → 0) on scroll
- **Stats/outcomes**: Counter animation (0 → final number) when visible
- **Media reveals**: Staggered fade-in for process images
- **CTA buttons**: Underline animation on hover (left to right, 200ms)

**Duration targets:**
- Parallax: Continuous (tied to scroll)
- Fade-ins: 600–800ms
- Counters: 1.5s (for impact)
- Button interactions: 200ms

---

### 3. About Page (Seniority & Narrative)

**Structure:**
- Brief intro (who you are, 10+ years context)
- Skills/expertise (design systems, product thinking, etc.)
- Timeline or role progression (Publicis, Huge, Propelland, etc.)
- Values or philosophy
- Contact CTA

**Animation Approach:**
- Minimal (40% animations, 60% content)
- Fade-in on scroll for text blocks
- Timeline might have a subtle line-draw animation
- Keep interactions subtle—this page is about reading, not showing off

---

### 3. About Page (Seniority & Narrative)

**Structure:**
- Brief intro (who you are, 10+ years context)
- Skills/expertise (design systems, product thinking, etc.)
- Timeline or role progression (Publicis, Huge, Propelland, etc.)
- Values or philosophy
- Contact CTA

**Animation Approach:**
- Minimal (40% animations, 60% content)
- Fade-in on scroll for text blocks
- Timeline might have a subtle line-draw animation
- Keep interactions subtle—this page is about reading, not showing off

---

## Animation Principles (Current Implementation)

### Easing Curve (Brand Standard)
**Primary easing** (used for all reveals, transitions, animations):
```
cubic-bezier(0.22, 1, 0.36, 1)
```
Also uses `power2.out` (decelerate-in) for text/image reveals and `power2.inOut` for intro sequences.

In GSAP: `ease: "power2.out"` or custom cubic-bezier  
In Framer Motion: `transition: { ease: [0.22, 1, 0.36, 1] }`  
In CSS: `animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1)`

---

### Duration Scale
Actual durations used across the site:

| Animation | Value | Usage |
|-----------|-------|-------|
| **Fast** | 0.25s | Micro-interactions (icon opacity) |
| **Colors** | 0.3s | Header color shifts, cursor ring, nav hovers |
| **Short** | 0.35s | Project name exit animation |
| **Base** | 0.4s | Slider indicator width |
| **Slot** | 0.55s | Slot-machine CTA letter spin, platform line reveal |
| **Hero** | 0.58s | Hero image expand on detail page |
| **Snap** | 0.65s | Text reveals (clipPath+y), image reveals, title animations |

**Key Pattern**: Almost all text/image reveals land at 0.65s with power2.out easing for consistency.

---

### Core Animation Patterns

#### Text Reveals (SplitLines Component)
- **What**: clipPath: inset(100%→0%), y: 40→0, opacity: 0.5→1
- **Duration**: 0.65s
- **Easing**: power2.out
- **Stagger**: 0.07s (default) / 0.12s (About headers)
- **Trigger**: GSAP ScrollTrigger, start: 'top 88%'

#### Image Reveals
- **What**: y: 60→0, opacity: 0→1
- **Duration**: 0.65s
- **Easing**: power2.out
- **Trigger**: GSAP ScrollTrigger, start: 'top 88%'

#### Scroll Parallax
- **What**: scale: 0.8→1.0 (images)
- **Method**: GSAP ScrollTrigger with scrub: true
- **Trigger**: start: 'center bottom', end: 'center center'

#### Intro Sequence (CardStack + Home Timeline)
- **CardStack**: xPercent -100→0, 0.72s, power2.inOut, stagger 104ms
- **Home reveal**: Staggered from 1.20s–1.30s offset, each 0.65s, power2.in
- **Title words**: 1.70s offset, 0.65s, power2.out, stagger 0.12s
- **Total duration**: ~2.62s to full reveal

#### Slot CTA Spin
- **Letters**: Even: slot-spin-up, Odd: slot-spin-down
- **Duration**: 0.55s per spin
- **Easing**: cubic-bezier(0.22, 1, 0.36, 1)
- **Stagger**: 30ms per character
- **Trigger**: mouseenter (remounts to restart animation)

#### Hero Expand (Home → Detail Navigation)
- **What**: heroWidth, heroHeight, heroY from thumbnail rect → full hero
- **Duration**: 0.58s
- **Easing**: cubic-bezier(0.22, 1, 0.36, 1)
- **Method**: Framer Motion imperative animate()

#### Header/Navigation
- **Logo color shift**: CSS transition-colors, 300ms
- **Logo hover**: CSS hover:opacity-70, 300ms
- **Nav links**: SlotCta spin animation (see above)

#### 3D Tilt + Parallax (Carousel Cards)
- **What**: rotationX, rotationY, x, y via GSAP quickTo
- **Duration**: 0.5s
- **Easing**: power3
- **Perspective**: 650px
- **Trigger**: pointermove / pointerleave

---

### Mobile Considerations
- **Parallax intensity**: Reduce by ~50% (not fully disabled, but gentler)
- **Text stagger**: Same as desktop (0.07–0.12s)
- **Collage pan**: GSAP ScrollTrigger scrub: 1 on mobile ≤449px
- **Durations**: Keep consistent with desktop (no speed reduction)
- **Touch interactions**: Custom cursor animations disabled

---

### Tools Used
- **GSAP + ScrollTrigger**: Text reveals, scroll parallax, image animations, intro timeline, collage pan
- **Framer Motion**: Hero expand, carousel animations, card transforms, AnimatePresence for exits
- **CSS transitions**: Header colors, link hovers, opacity shifts (300ms default)
- **Three.js WebGL**: Flowmap mouse effect (real-time, no fixed duration; falloff 0.08, dissipation 0.975)

---

### Observations
- **Intro timing is long**: ~2.62s from CardStack entry to full title reveal. Main lever is title word offset.
- **Consistent duration cluster**: Almost everything 0.65s/power2.out = good coherence.
- **power2.in vs power2.out**: Intro uses power2.in (accelerate), content uses power2.out (decelerate). Intentional.
- **GSAP context cleanup**: All useLayoutEffect implementations include ctx.revert() for proper cleanup.
- **No orphaned animations**: Every AnimatePresence present where needed, no memory leaks detected.

---

## Awwwards Criteria (What We're Judging By)

1. **Design Excellence**
   - Consistent visual language across all pages
   - Typography hierarchy clear and purposeful
   - Color usage minimal and intentional
   - Mobile design equals desktop (not an afterthought)

2. **Interaction & Animation**
   - Every animation serves a purpose (no gratuitous effects)
   - Animations feel responsive and smooth (60fps)
   - Scroll interactions are performant
   - Micro-interactions delight without distraction

3. **Storytelling & Content**
   - Case studies communicate strategic thinking
   - Impact stats are specific and credible
   - Copy is concise and outcome-driven
   - 10+ years of experience is evident in detail & polish

4. **Technical Execution**
   - No jank, no stutter, no layout shift
   - Fast load time (Lighthouse score 90+)
   - Accessibility (WCAG AA minimum)
   - Works on all modern browsers

---

## What NOT to Do

- ❌ Don't add animations for animations' sake
- ❌ Don't use more than 3 colors in any one section
- ❌ Don't let animations distract from reading
- ❌ Don't ignore mobile (responsive is mandatory)
- ❌ Don't break accessibility for interactivity
- ❌ Don't use fonts that aren't optimized (web fonts should be < 100KB)

---

## Next Steps for Claude

1. Review Figma design file for exact colors, fonts, spacing
2. Confirm gallery grid layout (masonry, regular, or asymmetric)
3. Confirm which sections need animation vs. which should be static
4. Ask about any special requirements (dark mode, animations on reduced-motion, etc.)
5. Build component library first (Nav, Card, Button, Typography) before animating

---

## Reference Links
- **Design inspiration**: https://designembraced.com/, https://nothing.tech/, https://props.studiolumio.com/
- **Awwwards gallery**: Visit site to see award-winning portfolios
- **Animation resources**: 
  - GSAP docs: https://gsap.com/docs/
  - Framer Motion docs: https://www.framer.com/motion/
