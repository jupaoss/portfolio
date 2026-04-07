# Portfolio Website — Technical Context

## Stack & Environment
- **Node**: v20.20.0
- **npm**: 10.8.2
- **React**: 18.3.1 + TypeScript
- **Vite**: 6.4.1 (with Tailwind CSS v4 plugin)
- **Styling**: Tailwind CSS v4.1.12 (utility-first)
- **Animation**: GSAP 3.14.2 + Framer Motion / Motion 12.23.24
- **3D/WebGL**: Three.js 0.183.2 + CurtainsJS 8.1.6
- **Routing**: React Router 7.13.0
- **UI Components**: Radix UI (headless, unstyled)

**GitHub**: https://github.com/jupaoss/jupaoss-portfolio

---

## How to Use Each Tool (Claude's Decision Framework)

### GSAP (3.14.2)
**Use for:**
- Scroll-triggered animations (ScrollTrigger)
- Complex timeline sequences
- Staggered reveals (gallery, project lists)
- Parallax effects, morphing, distortion
- Performance-critical animations at scale

**Don't use for:**
- Simple fade-in/slide-in on component mount (use Framer Motion)
- Hover states on single elements (use Tailwind + CSS)
- Basic page transitions (use React Router + Framer Motion)

**Patterns to follow:**
- Create timelines, don't animate individual elements
- Use `.kill()` on cleanup (especially in `useEffect` returns)
- Avoid creating new timelines in render loops
- Leverage `gsap.matchMedia()` for responsive breakpoints
- Register plugins at top of file: `gsap.registerPlugin(ScrollTrigger)`

---

### Framer Motion / Motion (12.23.24)
**Use for:**
- Component entrance/exit animations
- Interactive micro-interactions (hover, click, focus)
- Gesture-based animations (drag, swipe)
- Staggered child animations (lists, grids)
- Page/route transitions

**Don't use for:**
- Scroll-heavy sequences (GSAP ScrollTrigger is better)
- Large-scale parallax (GSAP is more performant)
- Long, complex timelines (GSAP is clearer)

**Patterns to follow:**
- Keep animations under 500ms for micro-interactions
- Use `AnimatePresence` for exit animations
- Leverage `variants` for reusable animation patterns
- Compose animations, don't nest them deeply

---

### Tailwind CSS v4.1.12
**Use for:**
- All layout, spacing, alignment
- Colors, typography, shadows, borders
- Responsive design (mobile-first breakpoints: sm, md, lg, xl, 2xl)
- Opacity, transforms, filters
- Dark mode (if applicable)

**Don't use for:**
- Animation keyframes (use GSAP or Framer Motion)
- Complex transitions with easing (use Motion/GSAP)
- Non-standard spacing (stick to 4px/8px base unit)

**Patterns to follow:**
- No custom Tailwind config changes needed
- Use `clsx` or `tailwind-merge` for conditional classes
- Keep class strings readable (max ~60 chars per line)
- Responsive classes: `md:` prefix for tablet/desktop

---

### Three.js (0.183.2) + CurtainsJS (8.1.6)
**Use for:**
- WebGL effects (mesh distortion, liquid effects, RGB shift)
- Hover trails, particle systems
- Advanced 3D/canvas animations
- GPU-accelerated transforms

**Don't use for:**
- Simple 2D animations (use GSAP or Framer Motion)
- Full 3D scenes unless truly necessary
- Anything that should work on low-end devices (consider fallback)

**Patterns to follow:**
- Initialize in `useEffect` with cleanup
- Use `requestAnimationFrame` or GSAP's RAF
- Keep shader/mesh count low (performance)
- Test on mobile before shipping

---

## Component Structure (Claude's Autonomy)
- Claude will extract and suggest reusable components as it builds
- 3 page templates: **Home** (gallery), **Project Detail**, **About**
- Expected component categories: Layout, Navigation, Gallery, Card, CTA, Typography
- Naming: PascalCase, descriptive (e.g., `ProjectGallery`, `CaseStudyHero`)
- File structure: Each component gets its own folder with `index.tsx` + optional `styles.ts`

---

## Performance & Targets
- **Frame rate**: Smooth 60fps on desktop, 30–60fps on mobile (aim for 60)
- **Bundle size**: No hard limit; Vite will optimize. Keep animations in JS, not bloated SVG
- **Approach**: Desktop-first design, mobile-optimized (fully responsive)
- **Animation budget**: Limit simultaneous GSAP timelines (3–5 max per scroll)
- **Image optimization**: Use next-gen formats (WebP); lazy load below fold

---

## What Claude Should NOT Do
- Change Tailwind config without asking
- Add new npm packages without asking
- Use `setTimeout` for animations (use RAF or GSAP)
- Hardcode breakpoints (use Tailwind's responsive classes)
- Ignore mobile performance (test animations on 4G)
- Create new color/spacing values not in Figma

---

## Figma Reference
**Design file**: https://www.figma.com/design/aYIE5WoaNTYHVzxZba0pyG/Portfolio---Website

Extract from Figma:
- Color palette (primary, secondary, neutrals, accents)
- Typography scale (display, heading, body, caption)
- Spacing system (margins, padding, gaps)
- Component specs (all interactive states)
- Animation notes (duration, easing, triggers)

---

## Decision-Making Framework for Claude

**When unsure:**
1. Check if animation is scroll-driven → GSAP
2. Check if it's a component interaction → Framer Motion
3. Check if it's layout/style → Tailwind
4. Check if it needs WebGL → Three.js/CurtainsJS
5. Ask before adding deps or changing architecture

**When optimizing:**
- Prioritize 60fps over visual complexity
- Reduce animations on mobile (use `matchMedia`)
- GPU-accelerate transforms (use `will-change` sparingly)
- Test before shipping

**When proposing alternatives:**
- Explain trade-offs (performance vs. visual fidelity)
- Show code before/after
- Suggest if Awwwards-worthy (this is the bar)

---

## Context for Next Claude Code Session
Update **SESSION_CONTEXT.md** before starting:
- What's done (% per page)
- What's next (priority order)
- Known issues or blockers
- Animation checklist progress
- Any design decisions made since last session
