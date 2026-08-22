# Aman Kumar — Interactive 3D Portfolio

A visually-rich, interactive portfolio built with **React 19**, **Vite 8**, **Three.js** (via `@react-three/fiber`), **GSAP 3**, and **Tailwind CSS 4**. The site combines a parallax 3D scene, six distinct section-to-section transitions, radial navigation, and a staggered GSAP loader into a cohesive storytelling experience about risk, curiosity, and creative engineering.

---

## Table of Contents

- [Demo](#demo)
- [Features](#features)
  - [Six Animated Sections](#six-animated-sections)
  - [Immersive 3D Scene](#immersive-3d-scene)
  - [Six Unique Section Transitions](#six-unique-section-transitions)
  - [Radial & Hamburger Navigation](#radial--hamburger-navigation)
  - [GSAP Loader](#gsap-loader)
  - [Dynamic Background Color Tweening](#dynamic-background-color-tweening)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
  - [Custom Event System](#custom-event-system)
  - [Deterministic 3D with Seeded PRNG](#deterministic-3d-with-seeded-prng)
- [Color Palette](#color-palette)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Accessibility](#accessibility)
- [Dependencies](#dependencies)

---

## Demo

The portfolio lives at: [https://aman-portfolio.vercel.app](https://aman-portfolio.vercel.app) *(or local dev URL)*

---

## Features

### Six Animated Sections

Each section is a full-height, CSS scroll-snap panel with its own entrance animation and content theme:

| # | Section | Target ID | Content |
|---|---------|-----------|---------|
| 1 | **Hero** | `hero` | Staggered GSAP character/slide-in animation for the name & title, scroll-cue hint |
| 2 | **About** | `about` | Scroll-triggered entrance, avatar badge (AK initials), bio, LinkedIn link |
| 3 | **Skills** | `skills` | Scroll-staggered skill category cards with gradient dot indicators and hover color-swap tags |
| 4 | **Projects** | `projects` | Scroll-staggered project cards with glowing borders — teal for Web, purple for Full-Stack |
| 5 | **Experience** | `experience` | Timeline with a center line that grows, staggered dual-sided items, and clip-path reveals |
| 6 | **Contact** | `contact` | Contact cards (email, location, LinkedIn) + a form with submission-state feedback |

### Immersive 3D Scene

A fixed-position `<Canvas>` from `@react-three/fiber` renders a parallax 3D scene that responds to scroll progress and mouse position. The scene is orchestrated by `SceneManager`, which lerps the camera through six predefined waypoints (`CAMERA_SECTIONS`) as the user scrolls.

**Five interactive Three.js components:**

| Component | Description |
|-----------|-------------|
| `ParticleField` | 1,200 seeded-random particles with additive blending that rotate with scroll and offset toward the mouse |
| `OrganicMorph` | An animated icosahedron with vertex displacement (sin/cos noise), rendered as a solid emissive mesh and a wireframe shell |
| `SkillCell` | Floating spheres with additive-glow shells, positioned radially in a circle with a per-index animation cadence |
| `ProjectCrystal` | Animated, distorted octahedra with inner glow, wireframe shells, and a floating Y-bob — one per project |
| `ExperienceVine` | A Catmull-Rom curve vine with mirrored leaf pairs that appear progressively based on scroll progress |

### Six Unique Section Transitions

The `TransitionOverlay` component is the transition engine. Each section triggers a **distinct** visual technique and color:

| # | Trigger Section | Technique | Color |
|---|-----------------|-----------|-------|
| 1 | **Home / Hero** | Scale & inset-clip-path wipe veil | `#F2b759` (amber) |
| 2 | **About** | WebGL ShaderMaterial value-noise dissolve (custom vertex + fragment shaders) | `#f2efe7` (off-white) |
| 3 | **Skills** | SVG Bézier curve morphing | `#8b004a` (deep magenta) |
| 4 | **Projects** | Dynamic title overlay with polygon clip-path | `#00a19b` (teal) |
| 5 | **Experience** | GSAP Draw SVG spiral (stroke-dashoffset + strokeWidth animation) | `#D4A853` (same amber as Home) |
| 6 | **Contact** | Dual clip-path curtain lift (curtain + target element) | `#C87740` (warm orange) |

### Radial & Hamburger Navigation

- **`Navbar`** — A radial/circular nav with a profile badge (AK) and arc-layout of the six `NAV_ITEMS`. Supports wheel and arrow-key navigation with CSS counter numbering (01–06).
- **`HamburgerNav`** — Wraps `StaggeredMenu` with section items plus GitHub and LinkedIn social links.
- **`StaggeredMenu`** — A full-screen hamburger menu with a layered parallax backdrop, staggered item reveal, and CSS counter numbering.

> **Note:** A `FloatingNav` component (desktop dock + mobile drawer using framer-motion) exists in the codebase but is **not currently imported** in `App.jsx` — it is unused/dead code.

### GSAP Loader

A full-screen entry experience:
- Staggered character reveal for "AMAN" / "PORTFOLIO"
- `00`–`100%` counter animation
- Progress bar
- Liquid SVG curtain exit when loading completes

### Dynamic Background Color Tweening

A fixed full-screen div (`bgRef` in `App.jsx`) has its `background-color` smoothly tweened by the `useSectionBackground` hook. An `IntersectionObserver` tracks `data-section` elements and transitions through a six-color array matching the section order:

```
#0A3625 → #00A19B → #F2EFE7 → #E4DDD3 → #0A3625 → #2E1F26
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 (ESM, JSX transform) |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **3D Engine** | Three.js 0.184 (via `@react-three/fiber` + `@react-three/drei`) |
| **Animation** | GSAP 3 (with `@gsap/react`) |
| **Menu Animation** | Framer Motion |
| **Shader Language** | GLSL (custom WebGL ShaderMaterial) |

---

## Architecture

### Custom Event System

Section transitions are fully decoupled from the navigation components via a custom DOM event pattern:

1. **Dispatch** — `src/utils/navigation.js` provides `triggerSectionTransition(target, label)`, which dispatches a `CustomEvent` named `'trigger-section-transition'` on `window`.
2. **Listen** — `TransitionOverlay.jsx` registers a `window.addEventListener('trigger-section-transition', ...)` listener in a `useEffect`.
3. **Execute** — The listener reads `e.detail.target` and routes to the appropriate `runTransitionN` function.

This design means any navigation element (radial nav, hamburger menu, keyboard shortcut, or future component) can trigger a transition without importing or knowing about `TransitionOverlay` internals.

### Deterministic 3D with Seeded PRNG

To ensure the 3D scene is deterministic across renders (no visual jitter or flicker), all random positions, rotations, and geometry distortions use a **seeded xorshift PRNG** defined in `src/utils/random.js`:

```javascript
// 32-bit xorshift — same seed = same sequence every time
export function createSeededRandom(seed) {
  let state = seed >>> 0;
  return function () {
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return ((state >>> 0) / 4294967296);
  };
}
```

This ensures that `ParticleField`, `OrganicMorph`, `SkillCell`, `ProjectCrystal`, and `ExperienceVine` always generate the same geometry — critical for a stable, reproducible 3D experience.

---

## Color Palette

Defined in `src/constants/colors.js` and extended as CSS variables in `src/index.css`:

| Name | Hex | Usage |
|------|-----|-------|
| **Amber** | `#D4A853` | Primary accent, skill tags, selection highlight |
| **Moss** | `#5A7D6E` | Scrollbar thumb, secondary UI elements |
| **Purple** | `#7C6FE0` | AI/ML skill category color |
| **Teal** | `#00A19B` | Contact section transition, project type color |
| **Dark** | `#0A3625` | Base background, deep greens |
| **Magenta** | `#8b004a` | Skills section transition |
| **Warm Orange** | `#C87740` | Contact section transition |
| **Off-White** | `#F2EFE7` | About section transition |
| **Deep** | `#060d0a` | Darkest background variant |

---

## Getting Started

### Prerequisites

- **Node.js** >= 20 (ESM support)
- **npm** or **pnpm**

### Installation

```bash
git clone https://github.com/AmanKumar-St/aman-portfolio.git
cd aman-portfolio
npm install
```

### Development

```bash
npm run dev
```

This starts the Vite dev server with **Hot Module Replacement (HMR)** at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

The build output goes to `dist/`, with tree-shaking, minification, and asset hashing provided by Vite.

To preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```
aman-portfolio/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Experience.jsx
│   │   │   └── Contact.jsx
│   │   ├── three/
│   │   │   ├── SceneCanvas.jsx
│   │   │   ├── SceneManager.jsx
│   │   │   ├── ParticleField.jsx
│   │   │   ├── OrganicMorph.jsx
│   │   │   ├── SkillCell.jsx
│   │   │   ├── ProjectCrystal.jsx
│   │   │   └── ExperienceVine.jsx
│   │   └── ui/
│   │       ├── Navbar.jsx
│   │       ├── HamburgerNav.jsx
│   │       ├── StaggeredMenu.jsx
│   │       ├── TransitionOverlay.jsx
│   │       ├── Loader.jsx
│   │       ├── Footer.jsx
│   │       ├── FloatingNav.jsx
│   │       └── ProfileLogo.jsx
│   ├── constants/
│   │   ├── colors.js
│   │   ├── nav.js
│   │   └── scene.js
│   ├── data/
│   │   └── content.js
│   ├── hooks/
│   │   ├── useScrollProgress.js
│   │   ├── useSectionBackground.js
│   │   └── useMousePosition.js
│   ├── utils/
│   │   ├── random.js
│   │   └── navigation.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
├── package.json
└── README.md
```

---

## Data Model

All portfolio content is centralized in `src/data/content.js` under the `personalData` export:

```javascript
export const personalData = {
  name: "Aman Kumar",
  title: "Aspiring AI/ML Engineer",
  linkedin: "https://...",
  bio: "Driven by curiosity at the intersection of artificial intelligence, cybersecurity, and creative engineering...",
  avatarPlaceholder: true,
  skills: {
    "AI & Machine Learning": ["Python", "TensorFlow", "PyTorch"],
    "Cybersecurity": ["Network Security", "Pentesting"],
    "Frontend Development": ["React", "Vite", "GSAP", "TailwindCSS", "Figma", "Appwrite"]
  },
  projects: [
    { title: "OnePiece Tribute", type: "treasure", ... },
    { title: "Movie App", type: "reel", ... }
  ],
  experience: [
    { role: "Cybersecurity Intern", company: "Acmegrade", ... },
    { role: "B.Tech Computer Science", company: "Punjab Technical University", ... }
  ],
  contact: {
    email: "aman.kumar.dev@example.com",
    location: "Punjab, India",
    availability: "Open for AI/ML & Engineering Roles",
    github: "https://github.com/AmanKumar-St",
    linkedin: "https://..."
  }
};
```

This is consumed by the section components, the radial nav, and the skill/project cards — making content updates a single-file change.

---

## Accessibility

- `prefers-reduced-motion` media query disables radial-nav transitions
- SVG titles and ARIA labels on navigation items
- Semantic HTML structure with scroll-snap
- Selection highlight colors designed for readability

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@gsap/react` | `^2.1.2` | React integration for GSAP |
| `@react-three/drei` | `^10.7.7` | Helpers for `@react-three/fiber` |
| `@react-three/fiber` | `^9.6.1` | Declarative Three.js for React |
| `@tailwindcss/vite` | `^4.3.1` | Tailwind plugin for Vite |
| `framer-motion` | `^12.40.0` | Hamburger menu animations |
| `gsap` | `^3.15.0` | Scroll & transition animations |
| `react` | `^19.2.6` | UI framework |
| `react-dom` | `^19.2.6` | React DOM renderer |
| `tailwindcss` | `^4.3.1` | Utility-first CSS |
| `three` | `^0.184.0` | 3D WebGL engine |

**Dev Dependencies:**

- `vite` `^8.0.12`, `@vitejs/plugin-react` `^6.0.1`, `eslint` `^10.3.0`, `@types/react` `^19.2.14`
