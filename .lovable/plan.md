

# CodePlayground by azhar0i0 — Implementation Plan

## Overview
A real-time HTML/CSS/JS code editor SaaS with live preview, npm package imports, responsive device simulation, and project sharing — all running entirely in the browser.

---

## Pages & Structure

### 1. Landing Page (Hero + Features + CTA)
- **Hero Section**: Bold headline ("Code. Preview. Ship."), animated gradient background, floating code snippet visual, primary CTA ("Start Coding") and secondary CTA ("See Examples")
- **Features Section**: Cards showcasing real-time preview, npm imports, responsive simulation, project sharing
- **How It Works**: 3-step visual flow
- **Footer**: Branding, links, social icons

### 2. Editor Page (`/editor` and `/editor/:projectId`)
- **Three-pane code editor** (HTML, CSS, JS tabs or split panels) using `textarea` with syntax-highlighting styling
- **Live preview iframe** that updates in real-time as you type
- **Toolbar**: Run, Save, Share, Device simulation toggle, npm package import dialog
- **Responsive device simulator**: Toggle between mobile (375px), tablet (768px), desktop (1280px) frames around the preview iframe
- **npm Import Dialog**: Search and add packages via unpkg/skypack CDN URLs, auto-injected into the preview

### 3. Shared Project View (`/share/:id`)
- Read-only or forkable view of a shared project
- Shows code + live preview side by side

---

## Core Features

### Real-Time Code Editor & Preview
- Three code panels (HTML, CSS, JS) with resizable splits
- Debounced live preview rendering in a sandboxed iframe using `srcdoc`
- Error overlay for JS runtime errors caught via `window.onerror`

### NPM Package Imports
- Dialog to search/add packages by name
- Packages loaded via `<script>` tags from unpkg.com or cdn.skypack.dev
- Injected into the preview iframe's `<head>`

### Save & Share Projects
- **Local save**: Projects stored in localStorage with project list management
- **Shareable links**: Encode project data into URL-safe compressed strings (using base64 + compression), generating links like `/share/:encodedData`

### Responsive Device Simulation
- Preview iframe wrapped in device frames (phone/tablet/desktop bezels)
- Toggle buttons in toolbar to switch viewport sizes
- Smooth animated transitions between device sizes

---

## Design System

### Visual Style
- Dark-mode-first editor with glassmorphism panels
- Gradient accents (purple → blue → cyan palette)
- Premium typography: Inter for UI, JetBrains Mono for code
- Soft shadows, rounded corners, subtle blur effects
- Noise texture overlay for depth

### Animations
- Hero: Staggered fade-in + floating code elements
- Scroll reveals on landing page sections
- Smooth panel resizing in editor
- Micro-interactions: button hover scales, toolbar icon transitions
- Page transitions between landing and editor

---

## Responsive Design
- Landing page: Mobile-first, fluid grid, stacked on small screens
- Editor: Switches to tabbed (stacked) layout on mobile instead of side-by-side panels
- All touch-friendly controls and appropriate sizing

---

## SEO & Meta
- Proper meta tags, OG tags, and page titles on all routes
- Semantic HTML throughout
- Fast initial load (code editor lazy-loaded)

---

## File Structure
- `src/pages/Landing.tsx` — Marketing homepage
- `src/pages/Editor.tsx` — Main playground editor
- `src/pages/SharedProject.tsx` — Shared project viewer
- `src/components/editor/` — CodePanel, PreviewFrame, Toolbar, DeviceSimulator, PackageImporter
- `src/components/landing/` — Hero, Features, HowItWorks, Footer
- `src/hooks/useProject.ts` — Project save/load/share logic
- `src/lib/projectEncoder.ts` — URL encoding/decoding for sharing
- Updated `README.md` with full documentation, azhar0i0 branding

