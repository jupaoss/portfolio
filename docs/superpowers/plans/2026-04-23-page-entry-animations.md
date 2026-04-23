# Page Entry Animations — About + Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cinematic entry animations to the About page (image fade-in from black) and the Home page (carousel image scale 0.8 → 1.0 on intro exit).

**Architecture:** Two self-contained changes to existing files. About gets a `useLayoutEffect` that hides the hero image before paint and fades it in using GSAP. Home wraps the carousel inner content in a Framer Motion `motion.div` that scales from 0.8 → 1 when `revealStarted` becomes true (same moment the intro overlay begins fading and text reveals start).

**Tech Stack:** React 18, GSAP 3.14, Framer Motion / Motion 12.23

---

## Context & Decisions

### About Page — current state
- `bg-black` background is already in place.
- `HeroReveal` components each run their own `useLayoutEffect` to set `clipPath: inset(100%)` + `opacity: 0` before paint — text is already hidden on first frame.
- The hero `<img ref={heroImgRef}>` has **no initial hidden state** — it's fully visible on first frame, blocking the "completely black start" requirement.
- A separate scroll-triggered `gsap.to(img, { opacity: 0, scrub })` fades the image out as the user scrolls down. The entry animation and the scroll-fade are temporally separated (entry fires immediately; scroll-fade only activates when the user actually scrolls), so there is no GSAP conflict.

### Home Page — current state
- The `IntroOverlay` covers the carousel during the intro sequence.
- `onRevealStart` fires → `setRevealStarted(true)` → GSAP text reveal timeline starts → the overlay begins its 0.55s fade-out.
- `onComplete` fires → `setCardStackDone(true)` → overlay unmounts.
- The carousel image is rendered behind the overlay at scale 1.0 — no entry animation.
- **Target:** When `revealStarted` fires, the carousel image begins scaling from 0.8 → 1.0 over 0.65s. Text elements start revealing simultaneously, so "elements appear before scale ends" is naturally satisfied.
- The carousel inner container is a `<motion.div style={{ y: containerY }}>`. Wrapping it in a scale `motion.div` is safe — Framer Motion composes transforms cleanly with no interference from the outer CSS `transform: translateX(-50%)` on the parent div.
- This animation must **not run** when `isReturning` (coming back from a project detail page).

---

## File Map

| File | Change |
|------|--------|
| `src/app/pages/About.tsx` | Add `useLayoutEffect` to hide hero image before paint + fade-in animation |
| `src/app/pages/Home.tsx` | Wrap carousel inner content in a `motion.div` scale wrapper |

No new files. No new dependencies.

---

## Task 1 — About: Hide hero image before paint

**File:** `src/app/pages/About.tsx`

The hero `<img>` is currently rendered at full opacity. We need to set it to `opacity: 0` before the browser paints to achieve a true black-screen start.

- [ ] **Step 1: Add `useLayoutEffect` to About.tsx**

  Insert this hook directly after the existing state/ref declarations (before the resize `useEffect`), around line 117 in the current file:

  ```tsx
  useLayoutEffect(() => {
    const img = heroImgRef.current;
    if (!img) return;
    gsap.set(img, { opacity: 0 });
  }, []);
  ```

  This runs synchronously before the browser paints, so the image is never visible at full opacity on frame 0.

- [ ] **Step 2: Start dev server and verify**

  ```bash
  npm run dev
  ```

  Navigate to `/about`. On load, the hero photo should **not** be visible — only the black background and DotGrid. The HeroReveal text elements are also hidden (they manage their own state via their own `useLayoutEffect`). Result: completely black screen on first frame.

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/pages/About.tsx
  git commit -m "feat(about): hide hero image before first paint for black-screen entry"
  ```

---

## Task 2 — About: Fade-in hero image on mount

**File:** `src/app/pages/About.tsx`

Add the timed fade-in. The image should start appearing at ~0.05s (a beat before the name text at 0.1s), matching the site's standard 0.65s / power2.out reveal pattern.

- [ ] **Step 1: Extend the `useLayoutEffect` from Task 1**

  Replace the `useLayoutEffect` added in Task 1 with:

  ```tsx
  useLayoutEffect(() => {
    const img = heroImgRef.current;
    if (!img) return;
    const ctx = gsap.context(() => {
      gsap.set(img, { opacity: 0 });
      gsap.to(img, {
        opacity: 1,
        duration: 0.65,
        ease: "power2.out",
        delay: 0.05,
      });
    });
    return () => ctx.revert();
  }, []);
  ```

  **Why `delay: 0.05`?** The name text (`HeroReveal` with `delay={0.1}`) starts slightly after the image. Starting the image at 0.05s means it's already beginning to appear when the text starts revealing at 0.1s — image leads text, which feels natural and avoids a single frame of "just text, no image."

  **Why `opacity: 1`?** The scroll-triggered fade-out (separate `useEffect`, scrub-based) will take over from 1 → 0 when the user scrolls to the closing section. Starting at 1 is the correct "rest" value.

  **Why `gsap.context()`?** Proper cleanup on unmount / hot-reload, consistent with all other GSAP usage on the page.

- [ ] **Step 2: Verify the full About entry sequence**

  In the browser at `/about`:
  1. Page loads → completely black (no image, no text)
  2. ~50ms later: photo begins fading in
  3. ~100ms: "JULIÁN / PATIÑO / OSSA" text starts its clip-path reveal (via HeroReveal delay={0.1})
  4. ~220ms: "Based on" label reveals (HeroReveal delay={0.22})
  5. ~280ms: "MDE, COL" reveals (HeroReveal delay={0.28})
  6. ~420ms: "SOFTWARE & EXPERIENCE DESIGNER" starts (HeroReveal delay={0.42})
  7. All elements use `power2.out` and 0.65s duration — consistent with the rest of the site
  8. Scrolling to the closing section fades the image out (existing behavior, unchanged)

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/pages/About.tsx
  git commit -m "feat(about): fade-in hero image on page entry"
  ```

---

## Task 3 — Home: Add scale 0.8 → 1.0 entry to carousel image

**File:** `src/app/pages/Home.tsx`

Wrap the carousel's inner `motion.div` (the one with `style={{ y: containerY }}`) in a scale-animating `motion.div`. The scale transitions from 0.8 → 1.0 when `revealStarted` becomes `true`, which is the exact moment the intro overlay starts fading and text reveals begin.

- [ ] **Step 1: Locate the carousel container in Home.tsx**

  Find this block (around line 604–633 in the current file):

  ```tsx
  {/* ── Carousel ── */}
  <div
    className="absolute pointer-events-none z-[2]"
    data-name="carousel-container"
    style={{ left: isMobile ? "50%" : isTablet ? "55%" : "50%", top: "50%", transform: "translateX(-50%)", width: containerW, height: 0 }}
  >
    <motion.div className="relative" style={{ y: containerY }}>
      {itemsToRender.map(({ virtualPos, project }) => { ... })}
    </motion.div>
  </div>
  ```

- [ ] **Step 2: Insert the scale wrapper**

  Replace only the inner content — the outer positioning `<div>` stays untouched. Add one `motion.div` between the outer `<div>` and the existing `<motion.div style={{ y: containerY }}>`:

  ```tsx
  {/* ── Carousel ── */}
  <div
    className="absolute pointer-events-none z-[2]"
    data-name="carousel-container"
    style={{ left: isMobile ? "50%" : isTablet ? "55%" : "50%", top: "50%", transform: "translateX(-50%)", width: containerW, height: 0 }}
  >
    <motion.div
      initial={isReturning ? false : { scale: 0.8 }}
      animate={revealStarted ? { scale: 1 } : undefined}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="relative" style={{ y: containerY }}>
        {itemsToRender.map(({ virtualPos, project }) => { ... })}
      </motion.div>
    </motion.div>
  </div>
  ```

  **Why `initial={isReturning ? false : { scale: 0.8 }}`?**  
  When returning from a project detail page (`isReturning = true`), we skip the entry animation entirely — the carousel is already at its natural scale from the previous session. `false` tells Framer Motion to skip the initial state.

  **Why `animate={revealStarted ? { scale: 1 } : undefined}`?**  
  `revealStarted` becomes `true` at `onRevealStart()` in `IntroOverlay` — the exact moment the overlay starts fading (0.55s) and the GSAP text timeline begins. Animating to scale 1 here means the image breathes in to full size *while* the overlay is still fading and text elements are first appearing. The 0.65s scale duration outlasts the first few text reveals (which start at 0, 0.07, 0.14, 0.21s offsets), satisfying "elements appear before scale ends."

  **Why `ease: [0.22, 1, 0.36, 1]`?**  
  This is the site's premium snap easing (used for hero expand, carousel snapping, card flyback). The scale-in of the main image warrants this curve over power2.out (which is reserved for text/content reveals).

  **Why wrap `motion.div` in a plain `<div>` rather than make the outer div a `motion.div`?**  
  The outer div has `transform: "translateX(-50%)"` in its `style` prop. Framer Motion owns the `transform` CSS property on `motion` elements; mixing raw CSS `transform` with Framer Motion's transform pipeline causes conflicts. Keeping the outer div as a plain `<div>` (pure CSS) and adding a new inner `motion.div` for scale keeps concerns cleanly separated.

- [ ] **Step 3: Verify the full Home entry sequence**

  In the browser at `/`:
  1. Page loads → intro overlay visible (#ebebeb) covering everything
  2. "WELCOME" greeting animates in/out, then logo animates in/out (~2.5s total)
  3. As the logo exits: `onRevealStart()` fires → text reveal GSAP timeline starts + carousel begins scaling from 0.8 → 1.0
  4. Intro overlay starts its 0.55s fade-out simultaneously
  5. As overlay fades: logo, subtitle, location, nav links start revealing (per existing timeline)
  6. ~0.57s into the timeline: project title + slider items start revealing — scale animation is still in progress (0.65s total)
  7. By ~0.65s: carousel image reaches scale 1.0 — fully settled
  8. By ~0.80s: platform line reveals — all elements done
  
  **Verify returning from a project:** Click a project, return via back navigation — confirm the carousel renders at scale 1.0 immediately (no scale animation), consistent with pre-existing behavior.

  **Verify no visual conflicts:** The existing tilt/parallax (GSAP quickTo on `rotationX/Y`) and the carousel snap (Framer Motion animate on `containerY`) should both be unaffected — the new wrapper only controls `scale` and lives above the `y`-scroll layer.

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/pages/Home.tsx
  git commit -m "feat(home): scale carousel image 0.8 → 1 on intro exit for cinematic entry"
  ```

---

## Self-Review

### Spec coverage
| Requirement | Covered by |
|---|---|
| About: screen starts completely black | Task 1 — heroImg hidden before paint; HeroReveal already hides text |
| About: image fades from opacity 0 → current opacity | Task 2 — fade-in animation |
| About: rest of elements reveal after image starts | Task 2 — image at delay 0.05; text at delays 0.1–0.42 (existing, unchanged) |
| About: maintain current reveal order | Existing HeroReveal delays are untouched |
| About: smooth fade-in, site curves | Task 2 — power2.out, 0.65s, matching site standard |
| Home: image starts at scale 0.8 | Task 3 — `initial={{ scale: 0.8 }}` |
| Home: scales to 1.0 | Task 3 — `animate={{ scale: 1 }}` |
| Home: other elements appear before scale ends | Task 3 — both start at `revealStarted`; text stagger starts at 0s, scale ends at 0.65s |
| Home: no scale on return-from-project | Task 3 — `initial={isReturning ? false : ...}` |

### No placeholders
All code is complete and runnable.

### Type consistency
No new types introduced. All props used (`isReturning`, `revealStarted`) already exist in `Home.tsx` scope.
