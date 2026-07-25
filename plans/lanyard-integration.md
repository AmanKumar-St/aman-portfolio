# Plan: Lanyard Component Integration

## Objective
Integrate the physics-simulated 3D Lanyard (ID card on lanyard) component from React Bits into the portfolio About section, with proper rendering, interaction, and tests.

## Current State
- **All dependencies installed** — three, @react-three/fiber, @react-three/drei, @react-three/rapier, meshline
- **Vite configured** — `assetsInclude: ['**/*.glb']` already present
- **Assets placed** — 3 GLB models + crepe_satin.png in `src/assets/lanyard/`
- **Lanyard.jsx** — exists at `src/components/ui/Lanyard.jsx`, adapted from React Bits with defensive GLB handling
- **About.jsx** — already imports `<Lanyard>` with placeholder front/back images
- **No tests** exist anywhere in project

## Gaps & Issues
1. `position` default is `[0,0,80]` vs spec `[0,0,30]` — intentional for this portfolio's camera
2. `rotation={[Math.PI/2, 0, 0]}` added on card group — fix for downward-facing issue, needs verification
3. `nodes?.card` guards + fallback for custom GLB — works but fallback may break UV compositing
4. Two Canvas instances (SceneCanvas background + Lanyard canvas) — potential GPU/layering conflict
5. No automated tests

## Steps

### Step 1: Audit GLB Models & Determine Best Fit
- Examine each GLB's node structure, UV layout, and material names
- Pick the one that matches the `card/clip/clamp` node naming expected by the component
- **Files:** `src/assets/lanyard/*.glb`
- **Exit:** One GLB chosen, import path updated in Lanyard.jsx if needed

### Step 2: Fix Lanyard Component
- Verify `rotation` fix on card group is correct and remove if not needed
- Ensure defensive material handling preserves UV atlas compositing for all GLB variants
- Ensure the `lanyardWidth` prop maps to `meshline` `lineWidth` correctly
- Verify mobile responsiveness (`isMobile` detection + `dpr` + `timeStep`)
- **Files:** `src/components/ui/Lanyard.jsx`
- **Exit:** Component renders without errors, card faces correctly, band visible

### Step 3: Fix About.jsx Integration
- Remove placeholder network images, use local assets or pass `frontImage`/`backImage` props for local card faces
- Ensure proper container sizing so Lanyard canvas fills the allotted space
- Verify GSAP animation doesn't interfere with R3F canvas mounting
- **Files:** `src/components/sections/About.jsx`
- **Exit:** About section shows interactive lanyard card, no console errors

### Step 4: Add Tests
- Install vitest + @testing-library/react
- Write structural tests for Lanyard rendering with default props
- Write interaction tests (pointer down/up for drag)
- Ensure test setup handles Canvas/R3F mocking
- **Files:** `src/components/ui/Lanyard.test.jsx`
- **Exit:** Tests pass, coverage report generated

### Step 5: Verify Build & Lint
- Run `npm run lint` — fix any issues
- Run `npm run build` — confirm successful production build
- Fix any ESLint warnings
- **Exit:** Clean lint, successful build, no warnings