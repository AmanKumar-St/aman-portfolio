# Aman Kumar — "The Growing Mind" Portfolio

## Concept
An interactive living ecosystem where your professional journey blooms organically. Each scroll reveals a new biome — from a luminous seed (Hero) to a full garden (Experience).

## Visual Identity

| Element | Value |
|---------|-------|
| **Primary** | `#1F3A34` (Deep Evergreen) |
| **Light** | `#F4F8F9` (Frosted Snow) |
| **Accents** | Warm amber `#D4A853`, soft moss `#5A7D6E` |
| **Typography** | Playfair Display (headings), Inter (body) |
| **Vibe** | Bioluminescent forest / underwater garden — soft glow, ambient fog, organic curves |

## Content Data

```
Name:    Aman Kumar
Title:   Aspiring AI/ML Engineer
LinkedIn: linkedin.com/in/aman-kumar-81464417a

Projects:
  - "OnePiece Tribute" | Vite.js, GSAP, TailwindCSS, Figma
    Tagline: "If you don't take risks, you can't create a future." — Monkey D. Luffy
    Link: github.com/AmanKumar-St/OP-Tribute-website.git

  - "Movie App" | React.js, Appwrite, TailwindCSS, TMDB API
    Tagline: Browse trending movies, search titles, and explore TMDB content

Experience:
  - Cybersecurity Intern @ Acmegrade
  - B.Tech CSE, Punjab Technical University

Skills:
  - AI/ML: Python, TensorFlow, PyTorch
  - Cybersecurity: Network Security, Pentesting
  - Frontend: React, Vite, GSAP, TailwindCSS, Figma, Appwrite
```

## Sections & 3D Experience

| Section | 3D Visual | Interaction |
|---------|-----------|-------------|
| **Hero** | Luminous seed core pulsing at center, firefly particles orbiting | Mouse-follow camera, scroll to crack the seed open |
| **About** | Morphing organic shape (slowly transforming geometry) in background | Text reveals letter-by-letter like vines growing |
| **Skills** | Floating bioluminescent cells/spores, each category a different color & pulse | Hover to grow & emit particles |
| **Projects** | Each project = a unique crystal/gem | Click to inspect, rotate, see details |
| **Experience** | Gentle flowing vine/timeline winding down with leaf nodes at each milestone | Scroll reveals nodes, leaves unfurl |

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Vite + React** | Fast build, component architecture |
| **Three.js + React Three Fiber + Drei** | 3D rendering, cameras, lights |
| **GSAP + ScrollTrigger** | Scroll-driven animations, text reveals |
| **TailwindCSS v4** | Styling |
| **Custom GLSL Shaders** | Vertex displacement for organic morphing |
| **Framer Motion** | 2D UI transitions |

## Award-Winning Features

1. **Vertex displacement shaders** — 3D geometry breathes & morphs like a living organism
2. **Bioluminescent particles** — Custom particle system reacting to mouse & scroll
3. **Scroll-driven cinematic narrative** — Camera moves through the 3D world as you scroll
4. **Interactive project crystals** — Click+drag to rotate each project in 3D
5. **Organic text reveals** — Letters animate in like growing vines
6. **Smooth fog + ambient lighting** — Depth and atmosphere that feels immersive
7. **Performance adaptive** — Lower polygon count & particles on mobile

## File Structure

```
aman-portfolio/
├── public/
│   └── placeholder-avatar.svg
├── src/
│   ├── components/
│   │   ├── three/
│   │   │   ├── HeroScene.jsx
│   │   │   ├── OrganicMorph.jsx
│   │   │   ├── ParticleField.jsx
│   │   │   ├── SkillCell.jsx
│   │   │   ├── ProjectCrystal.jsx
│   │   │   └── ExperienceVine.jsx
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Experience.jsx
│   │   └── ui/
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       └── Loader.jsx
│   ├── data/
│   │   └── content.js
│   ├── shaders/
│   │   ├── vertex.glsl
│   │   └── fragment.glsl
│   ├── hooks/
│   │   ├── useScrollProgress.js
│   │   └── useMousePosition.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```
