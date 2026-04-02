# Folder Structure Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove dead Figma Make artifacts, move hooks/shaders under `src/app/`, rename SVG path files to readable names, extract the footer into a shared `SiteFooter` component, and add it to all pages.

**Architecture:** Pure refactor — no logic changes. All tasks are file moves, import updates, or extractions. Each task ends with a build verification so breakage is caught immediately.

**Tech Stack:** React 18, TypeScript, Vite, GSAP, Framer Motion, Tailwind CSS v4

---

## File Map

| Action | Path |
|---|---|
| Create | `src/assets/iconPaths.ts` |
| Create | `src/assets/headerPaths.ts` |
| Create | `src/app/hooks/useFlowmap.ts` |
| Create | `src/app/shaders/flowmapShaders.ts` |
| Create | `src/app/components/ImageWithFallback.tsx` |
| Create | `src/app/components/SiteFooter.tsx` |
| Modify | `src/app/pages/Home.tsx` |
| Modify | `src/app/components/SiteHeader.tsx` |
| Modify | `src/app/components/Menu.tsx` → delete |
| Modify | `src/app/components/FlowmapImage.tsx` |
| Modify | `src/app/pages/About.tsx` |
| Modify | `src/app/pages/BetterTogether.tsx` |
| Modify | `src/app/pages/CarpoolingApp.tsx` |
| Modify | `src/app/pages/MariaHache.tsx` |
| Modify | `src/app/pages/ModularStoryboards.tsx` |
| Modify | `src/app/pages/WinterCircus.tsx` |
| Delete | `src/imports/` (entire folder) |
| Delete | `src/app/components/ui/` (entire folder) |
| Delete | `src/app/components/figma/` (entire folder) |
| Delete | `src/hooks/` (entire folder) |
| Delete | `src/shaders/` (entire folder) |
| Delete | `src/assets/home/` (entire folder) |

---

### Task 1: Move SVG path data files to `src/assets/`

**Files:**
- Create: `src/assets/iconPaths.ts` (copy of `src/imports/svg-za68zag2ck.ts`)
- Create: `src/assets/headerPaths.ts` (copy of `src/imports/svg-axxyf4m9e8.ts`)
- Modify: `src/app/pages/Home.tsx`
- Modify: `src/app/components/SiteHeader.tsx`
- Modify: `src/app/components/Menu.tsx`

- [ ] **Step 1: Copy `svg-za68zag2ck.ts` content to `src/assets/iconPaths.ts`**

Read `src/imports/svg-za68zag2ck.ts` and write identical content to `src/assets/iconPaths.ts`. No content changes — only the file location changes.

- [ ] **Step 2: Copy `svg-axxyf4m9e8.ts` content to `src/assets/headerPaths.ts`**

Read `src/imports/svg-axxyf4m9e8.ts` and write identical content to `src/assets/headerPaths.ts`. No content changes.

- [ ] **Step 3: Update imports in `Home.tsx`**

In `src/app/pages/Home.tsx`, replace:
```ts
import svgPaths from "../../imports/svg-za68zag2ck";
import headerSvgPaths from "../../imports/svg-axxyf4m9e8";
```
With:
```ts
import svgPaths from "@/assets/iconPaths";
import headerSvgPaths from "@/assets/headerPaths";
```

- [ ] **Step 4: Update import in `SiteHeader.tsx`**

In `src/app/components/SiteHeader.tsx`, replace:
```ts
import svgPaths from "../../imports/svg-axxyf4m9e8";
```
With:
```ts
import svgPaths from "@/assets/headerPaths";
```

- [ ] **Step 5: Update import in `Menu.tsx`**

In `src/app/components/Menu.tsx`, replace:
```ts
import svgPaths from "../../imports/svg-za68zag2ck";
```
With:
```ts
import svgPaths from "@/assets/iconPaths";
```

- [ ] **Step 6: Verify build passes**

Run: `npm run build`
Expected: Build completes with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/assets/iconPaths.ts src/assets/headerPaths.ts src/app/pages/Home.tsx src/app/components/SiteHeader.tsx src/app/components/Menu.tsx
git commit -m "refactor: move SVG path data to src/assets with readable names"
```

---

### Task 2: Move `useFlowmap` hook and `flowmapShaders` under `src/app/`

**Files:**
- Create: `src/app/hooks/useFlowmap.ts`
- Create: `src/app/shaders/flowmapShaders.ts`
- Modify: `src/app/components/FlowmapImage.tsx`

- [ ] **Step 1: Copy `flowmapShaders.ts` to `src/app/shaders/flowmapShaders.ts`**

Read `src/shaders/flowmapShaders.ts` and write identical content to `src/app/shaders/flowmapShaders.ts`. No content changes.

- [ ] **Step 2: Copy `useFlowmap.ts` to `src/app/hooks/useFlowmap.ts` with updated internal import**

Read `src/hooks/useFlowmap.ts`. The file imports:
```ts
import { flowmapVert, flowmapFrag, displacementVert, displacementFrag } from '@/shaders/flowmapShaders';
```
Write to `src/app/hooks/useFlowmap.ts` with that import updated to:
```ts
import { flowmapVert, flowmapFrag, displacementVert, displacementFrag } from '@/app/shaders/flowmapShaders';
```
All other content unchanged.

- [ ] **Step 3: Update import in `FlowmapImage.tsx`**

In `src/app/components/FlowmapImage.tsx`, replace:
```ts
import { useFlowmap } from '@/hooks/useFlowmap';
```
With:
```ts
import { useFlowmap } from '@/app/hooks/useFlowmap';
```

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: Build completes with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/hooks/useFlowmap.ts src/app/shaders/flowmapShaders.ts src/app/components/FlowmapImage.tsx
git commit -m "refactor: move hooks and shaders under src/app/"
```

---

### Task 3: Move `ImageWithFallback` out of the `figma/` subfolder

**Files:**
- Create: `src/app/components/ImageWithFallback.tsx`

- [ ] **Step 1: Copy file to new location**

Read `src/app/components/figma/ImageWithFallback.tsx` and write identical content to `src/app/components/ImageWithFallback.tsx`. No content changes needed — the file has no internal imports.

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: Build completes with no errors. (The old path still exists so nothing is broken yet — deletion happens in Task 6.)

- [ ] **Step 3: Commit**

```bash
git add src/app/components/ImageWithFallback.tsx
git commit -m "refactor: move ImageWithFallback out of figma/ subfolder"
```

---

### Task 4: Extract `SiteFooter` component from `Home.tsx`

**Files:**
- Create: `src/app/components/SiteFooter.tsx`
- Modify: `src/app/pages/Home.tsx`

- [ ] **Step 1: Create `src/app/components/SiteFooter.tsx`**

```tsx
import { useNavigate } from "react-router";
import { SlotCta } from "./SlotCta";
import headerPaths from "@/assets/headerPaths";

interface SiteFooterProps {
  onWorkClick?: () => void;
}

export function SiteFooter({ onWorkClick }: SiteFooterProps) {
  const navigate = useNavigate();

  const handleWorkClick = onWorkClick ?? (() => navigate("/"));

  return (
    <div className="fixed left-4 right-4 bottom-6 z-[110] lg:left-6 lg:right-6" data-name="Footer">
      <div className="hidden min-[768px]:block absolute left-0 bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black" data-name="footer-year">
        <p>©2026</p>
      </div>
      {/* Mobile: available for freelance + email + location */}
      <div className="md:hidden absolute left-0 bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black leading-normal" data-name="footer-mobile">
        <p className="mb-0">available for freelance</p>
        <a href="mailto:julianpatinoossa@gmail.com" className="underline hover:opacity-60 transition-opacity duration-300">julianpatinoossa@gmail.com</a>
        <div className="flex items-center gap-[8px] mt-6">
          <div className="h-[13px] w-[11px] relative shrink-0">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 13">
              <path d={headerPaths.p122a1c00} fill="black" />
            </svg>
          </div>
          <span>MDE, COL</span>
        </div>
      </div>
      {/* Desktop: available for freelance + email */}
      <div className="hidden md:block absolute left-[232px] bottom-0 font-['Space_Grotesk',sans-serif] text-[12px] uppercase text-black leading-normal" data-name="footer-freelance">
        <p className="mb-0">available for freelance</p>
        <a href="mailto:julianpatinoossa@gmail.com" className="underline hover:opacity-60 transition-opacity duration-300">julianpatinoossa@gmail.com</a>
      </div>
      <div className="absolute flex flex-col items-end right-0 bottom-0 text-black" data-name="about">
        <SlotCta text="WORK" className="text-[12px]" onClick={handleWorkClick} />
        <SlotCta text="ABOUT" className="text-[12px]" onClick={() => navigate("/about")} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace inline footer in `Home.tsx` with `<SiteFooter>`**

In `src/app/pages/Home.tsx`:

Add the import after other component imports:
```ts
import { SiteFooter } from "../components/SiteFooter";
```

Find the entire footer block (starts with `{/* ── Footer ── */}`, ends with the closing `</div>` of `data-name="Footer"`):
```tsx
      {/* ── Footer ── */}
      <div className="fixed left-4 right-4 bottom-6 z-[110] lg:left-6 lg:right-6" data-name="Footer">
        ...all footer content...
      </div>
```

Replace it with:
```tsx
      {/* ── Footer ── */}
      <SiteFooter onWorkClick={() => navigate(`/project/${currentProject.id}`)} />
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/SiteFooter.tsx src/app/pages/Home.tsx
git commit -m "refactor: extract SiteFooter as shared component"
```

---

### Task 5: Add `SiteFooter` to all other pages

**Files:**
- Modify: `src/app/pages/About.tsx`
- Modify: `src/app/pages/BetterTogether.tsx`
- Modify: `src/app/pages/CarpoolingApp.tsx`
- Modify: `src/app/pages/MariaHache.tsx`
- Modify: `src/app/pages/ModularStoryboards.tsx`
- Modify: `src/app/pages/WinterCircus.tsx`

For each file, the change is identical:

1. Add import:
```ts
import { SiteFooter } from "../components/SiteFooter";
```

2. Add `<SiteFooter />` just before the final closing tag of the root element (after `<SiteHeader .../>` and all page content).

- [ ] **Step 1: Add `SiteFooter` to `About.tsx`**

Add `import { SiteFooter } from "../components/SiteFooter";` to the imports.

Locate the last JSX element before the root closing tag (the `</div>` or `</>` that closes the page). Add `<SiteFooter />` just before it.

- [ ] **Step 2: Add `SiteFooter` to `BetterTogether.tsx`**

Add `import { SiteFooter } from "../components/SiteFooter";` to the imports.

Add `<SiteFooter />` just before the root closing tag.

- [ ] **Step 3: Add `SiteFooter` to `CarpoolingApp.tsx`**

Add `import { SiteFooter } from "../components/SiteFooter";` to the imports.

Add `<SiteFooter />` just before the root closing tag.

- [ ] **Step 4: Add `SiteFooter` to `MariaHache.tsx`**

Add `import { SiteFooter } from "../components/SiteFooter";` to the imports.

Add `<SiteFooter />` just before the root closing tag.

- [ ] **Step 5: Add `SiteFooter` to `ModularStoryboards.tsx`**

Add `import { SiteFooter } from "../components/SiteFooter";` to the imports.

Add `<SiteFooter />` just before the root closing tag.

- [ ] **Step 6: Add `SiteFooter` to `WinterCircus.tsx`**

Add `import { SiteFooter } from "../components/SiteFooter";` to the imports.

Add `<SiteFooter />` just before the root closing tag.

- [ ] **Step 7: Verify build passes**

Run: `npm run build`
Expected: Build completes with no errors.

- [ ] **Step 8: Commit**

```bash
git add src/app/pages/About.tsx src/app/pages/BetterTogether.tsx src/app/pages/CarpoolingApp.tsx src/app/pages/MariaHache.tsx src/app/pages/ModularStoryboards.tsx src/app/pages/WinterCircus.tsx
git commit -m "feat: add SiteFooter to all pages"
```

---

### Task 6: Delete all dead code and old file locations

**Files:**
- Delete: `src/app/components/ui/` (entire directory)
- Delete: `src/app/components/figma/` (entire directory)
- Delete: `src/app/components/Menu.tsx`
- Delete: `src/imports/` (entire directory)
- Delete: `src/hooks/` (entire directory)
- Delete: `src/shaders/` (entire directory)
- Delete: `src/assets/home/` (entire directory)

- [ ] **Step 1: Delete dead directories and files**

```bash
rm -rf src/app/components/ui
rm -rf src/app/components/figma
rm -f src/app/components/Menu.tsx
rm -rf src/imports
rm -rf src/hooks
rm -rf src/shaders
rm -rf src/assets/home
```

- [ ] **Step 2: Verify build still passes after deletions**

Run: `npm run build`
Expected: Build completes with no errors. If any import errors appear, a file was deleted that is still referenced — read the error, find the import, fix it.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: delete unused Figma Make artifacts and dead code"
```

---

## Self-Review

**Spec coverage:**
- ✅ Delete `ui/`, `figma/`, `Menu.tsx`, `imports/`, `assets/home/` → Task 6
- ✅ Move SVG path files → Task 1
- ✅ Move `hooks/` and `shaders/` under `src/app/` → Task 2
- ✅ Move `ImageWithFallback` out of `figma/` subfolder → Task 3
- ✅ Create `SiteFooter` with `onWorkClick` prop → Task 4
- ✅ Add `SiteFooter` to all pages → Task 5
- ✅ All import updates covered in their respective tasks

**Placeholder scan:** No TBDs or incomplete steps. Every code block is complete.

**Type consistency:** `SiteFooterProps.onWorkClick` defined in Task 4 Step 1 and used consistently. `headerPaths.p122a1c00` matches the key used in the original `Home.tsx` footer.
