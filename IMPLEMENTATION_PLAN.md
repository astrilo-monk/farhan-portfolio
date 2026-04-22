# ASTRILO Design Implementation Plan

## Current Scope
- Migrated the portfolio from a single static HTML page into a React + Vite app.
- Preserved the same cyberpunk visual language: glitch heading, HUD cards, scanlines, particles, neon gradients, and timeline.
- Kept responsive behavior across mobile, tablet, and desktop.

## Current Files
- index.html: Vite root document that bootstraps the React app.
- src/main.jsx: React mount entry.
- src/App.jsx: Componentized portfolio markup and data-driven section rendering.
- src/styles.css: Theme tokens, animations, and full layout styling.
- package.json and vite.config.js: Build and development configuration.

## Structure Mapping
- Navigation: fixed top nav with section anchors.
- Sections:
  - About/Hero
  - Projects
  - Skills
  - Experience
  - Contact
  - Footer
- Visual layers:
  - Background grid + glow blobs
  - Scanlines overlay
  - Particle canvas

## Behavior Implemented
- Particle animation via canvas in a React effect hook.
- Real-time clock for hero and footer status display.
- IntersectionObserver reveal sequence for fade-up elements.
- Hover states for project cards and navigation links.

## Responsive Decisions
- Collapsed desktop nav links into a simplified mobile action link.
- Converted fixed multi-column layouts to responsive grid breakpoints.
- Reduced large typography scales on mobile while preserving style hierarchy.

## Next Refactor Phases
1. Deeper component extraction
- Split App into section components under src/components.
- Move section heading and panel patterns into shared UI pieces.

2. Externalized content source
- Move profile, projects, skills, and experience into a dedicated data module.
- Optionally connect to CMS or JSON endpoint.

3. Accessibility hardening
- Add skip links and stronger focus-visible states.
- Add reduced-motion mode for heavy effects.

4. Performance optimization
- Adapt particle count and animation intensity by device capability.
- Defer non-critical effects for lower-end devices.

## Suggested Integration Paths
- Static deployment: serve index.html directly (Netlify, Vercel static, GitHub Pages).
- Framework migration: copy section markup into route-level components and extract scripts into lifecycle hooks.
