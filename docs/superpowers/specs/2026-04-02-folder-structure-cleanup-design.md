# Folder Structure Cleanup

**Date:** 2026-04-02

## Goal

Remove dead code from Figma Make generation, align `hooks/` and `shaders/` with the `src/app/` convention, extract the footer into a shared component, and eliminate redundant asset folders. No functional changes — imports updated to match new paths.

## Deletions

| Path | Reason |
|---|---|
| `src/app/components/ui/` | 40+ shadcn components, none imported anywhere |
| `src/app/components/figma/` | Single-file subfolder; file moved to `src/app/components/` |
| `src/app/components/Menu.tsx` | Unused Figma Make duplicate of SiteHeader |
| `src/imports/HomeDesktop.tsx` | Unused Figma Make artifact |
| `src/imports/ProjectDesktop.tsx` | Unused Figma Make artifact |
| `src/imports/svg-nodui.tsx` | Only imported by deleted files |
| `src/imports/` | Empty after migrations |
| `src/assets/home/` | Only referenced by deleted Figma files |

## Moves & Renames

| From | To |
|---|---|
| `src/imports/svg-za68zag2ck.ts` | `src/assets/iconPaths.ts` |
| `src/imports/svg-axxyf4m9e8.ts` | `src/assets/headerPaths.ts` |
| `src/app/components/figma/ImageWithFallback.tsx` | `src/app/components/ImageWithFallback.tsx` |
| `src/hooks/useFlowmap.ts` | `src/app/hooks/useFlowmap.ts` |
| `src/shaders/flowmapShaders.ts` | `src/app/shaders/flowmapShaders.ts` |

## New Component: SiteFooter

Extract the footer from `Home.tsx` into `src/app/components/SiteFooter.tsx`.

**Props:**
```ts
interface SiteFooterProps {
  onWorkClick?: () => void; // defaults to navigate("/")
}
```

**Keeps:**
- `data-name="footer-year"`, `data-name="footer-freelance"`, `data-name="footer-mobile"` — required by Home's GSAP timeline
- All existing markup, styles, and responsive behavior
- Location pin SVG (imports from `@/assets/headerPaths`)

**WORK link behavior:**
- Default: `navigate("/")`
- Home overrides with `navigate(`/project/${currentProject.id}`)`

**ABOUT link behavior:**
- Always `navigate("/about")` — no override needed

**Usage after extraction:**
- `Home.tsx` — renders `<SiteFooter onWorkClick={() => navigate(...)} />`, removes inline footer markup
- `About.tsx`, case study pages — render `<SiteFooter />` with default behavior

## Import Updates Required

| File | Old import | New import |
|---|---|---|
| `src/app/pages/Home.tsx` | `../../imports/svg-za68zag2ck` | `@/assets/iconPaths` |
| `src/app/pages/Home.tsx` | `../../imports/svg-axxyf4m9e8` | `@/assets/headerPaths` |
| `src/app/components/SiteHeader.tsx` | `../../imports/svg-axxyf4m9e8` | `@/assets/headerPaths` |
| `src/app/components/FlowmapImage.tsx` | `@/hooks/useFlowmap` | `@/app/hooks/useFlowmap` |
| `src/app/hooks/useFlowmap.ts` (after move) | `@/shaders/flowmapShaders` | `@/app/shaders/flowmapShaders` |

## Final Structure

```
src/
  app/
    components/
      CardStack.tsx
      CtaBe.tsx / CtaIn.tsx / CtaMail.tsx
      DotGrid.tsx
      FlowmapImage.tsx
      ImageWithFallback.tsx
      SiteFooter.tsx       ← new
      SiteHeader.tsx
      SlotCta.tsx
      SplitLines.tsx
    data/
      projects.ts
    hooks/
      useFlowmap.ts
    pages/
      About.tsx
      BetterTogether.tsx
      CarpoolingApp.tsx
      Home.tsx
      MariaHache.tsx
      ModularStoryboards.tsx
      WinterCircus.tsx
    shaders/
      flowmapShaders.ts
    App.tsx
    routes.tsx
  assets/
    headerPaths.ts
    iconPaths.ts
    Julian.png
    project_1_better_together/
      [images...]
  styles/
    fonts.css
    index.css
    tailwind.css
    theme.css
    tokens.css
  declarations.d.ts
  main.tsx
```

## Out of Scope

- Renaming asset image files (hash-named files in `project_1_better_together/`)
- Any changes to component logic or animation behavior
- Footer animation wiring on About/case study pages (separate task)
