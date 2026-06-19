# INVICTO Landing Page - Project Documentation

## Overview
This is a modern, high-performance landing page for INVICTO, a social scouting platform that democratizes professional football by connecting talent with real opportunities. Built with Next.js 16 and React 19, featuring animations with Framer Motion and styling with Tailwind CSS.

**Live Demo**: Deployed on Vercel
**Status**: Production-ready landing page with download CTAs and modal flows

## Tech Stack
- **Framework**: Next.js 16.2.6 (App Router)
- **React**: 19.2.4 with TypeScript
- **Styling**: Tailwind CSS 4 with custom CSS variables for theming
- **Animations**: Framer Motion 12.40.0
- **Fonts**: Google Fonts (Chakra Petch, Hanken Grotesk, JetBrains Mono)
- **Icons**: Material Symbols Outlined + Custom SVG icons
- **Dev Tools**: ESLint, TypeScript, Playwright

## Color Scheme & Branding
The design uses a premium dark theme with neon green accents:
- **Background**: `#0D0D0D` (deep black) — primary bg color
- **Surface**: Multiple shades from `#060606` to `#282828` for layering
- **Text**: `#F0F0F0` (off-white) with semantic opacity variants
- **Neon Accent**: `#AAFF00` (lime green) — primary brand color, used for CTAs and highlights
- **Secondary**: `#88DD00` (darker green)

### Key CSS Variables (in globals.css)
```css
--color-background: #0D0D0D
--color-neon: #AAFF00
--font-headline: Chakra Petch (bold, italic, 700)
--font-body: Hanken Grotesk (normal weights)
--font-mono: JetBrains Mono (code/labels)
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Home page entry (renders Landing)
│   └── globals.css         # Global styles, theme vars, animations
├── components/
│   ├── Landing.tsx         # Main landing component (orchestrates sections)
│   ├── Navbar.tsx          # Fixed header with scroll behavior
│   ├── Footer.tsx          # Footer with social links
│   ├── DownloadModal.tsx   # Modal for app download
│   └── sections/           # Page sections
│       ├── Hero.tsx        # Hero section with parallax phone mockup
│       ├── Problem.tsx     # Problem/solution comparison
│       ├── HowItWorks.tsx  # 3-step feature explanation
│       ├── Features.tsx    # Feature cards grid
│       ├── Ratings.tsx     # Rating stats section
│       ├── Testimonials.tsx # User testimonials carousel
│       └── DownloadCTA.tsx # Call-to-action section
public/
├── Imagen-BG.png           # Background image (opacity 0.15)
└── logo.png                # INVICTO logo (inverted on dark bg)
```

## Key Features & Components

### Landing.tsx
**Purpose**: Orchestrates the full landing page experience
- Manages `modalOpen` state for download modal
- Renders grain overlay effect (film grain texture)
- Renders fixed background image (`Imagen-BG.png`) at 15% opacity
- Coordinates all sections with shared CTA callback

**Grain Overlay**: Fixed position pseudo-animation using SVG fractal noise for subtle texture

### Navbar.tsx
**Purpose**: Sticky navigation with scroll detection
- Shows/hides blur backdrop on scroll (60px threshold)
- Navigation links: "Cómo funciona", "Características", "Testimonios"
- Download button triggers modal
- Brand logo in top-left

### Hero.tsx
**Key Details**:
- Parallax effects using Framer Motion's `useScroll` and `useTransform`
- Phone mockup with ambient glow
- Floating cards (Rating: 94⭐, Scout contact notification)
- Line-by-line headline reveal animation
- Stats row: 50K+ players, 2K+ active scouts, 120+ countries
- Two CTAs: Primary (Download), Secondary (How it works)
- Scroll indicator at bottom

### Footer.tsx
**Updated with Social Links**:
- Facebook: `https://www.facebook.com/share/1D96FHkkMi/`
- Instagram: `https://www.instagram.com/invictoapp?utm_source=qr&igsh=MzVwb2NjOTV4cnZo`
- TikTok: `https://www.tiktok.com/@invicto.app?_r=1&_t=ZS-974saShwmG1`
- Icons open in new tabs (`target="_blank"`)
- Hover animation: scale 1.15 with neon color transition
- Navigation links: Privacy, Terms, Contact
- Download buttons for iOS/Android
- Copyright and tagline: "NO EXCUSES"

### Problem.tsx
Contrasts before/after scenarios with evidence cards showing the pain points INVICTO solves.

### Other Sections
- **HowItWorks**: 3-step process explanation
- **Features**: Grid of platform capabilities
- **Ratings**: Global rating/statistics display
- **Testimonials**: User success stories
- **DownloadCTA**: Strong conversion-focused CTA

## Development Guide

### Running the Project
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # Run ESLint
```

### Adding New Sections
1. Create a new file in `src/components/sections/`
2. Use Framer Motion for animations
3. Implement `whileInView` for scroll-triggered reveals
4. Follow the existing styling patterns (Tailwind + custom CSS variables)
5. Export and import in `Landing.tsx`

### Tailwind + CSS Variables
- Use Tailwind classes wherever possible
- Reference CSS variables via `--color-*` in custom classes
- Example: `text-neon` uses `--color-neon` internally
- Dark mode is forced: `<html className="dark">`

### Animations Pattern
```jsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  viewport={{ once: true, margin: "-100px" }}
>
  Content
</motion.div>
```

Use `whileInView` + `viewport={{ once: true }}` for performance on long pages.

## Styling Conventions

### Responsive Classes
- Mobile-first: default styles apply to small screens
- `md:`, `lg:` prefixes for larger breakpoints
- Flexbox preferred over Grid for most layouts
- `max-w-7xl` container with `mx-auto` and `px-6` padding

### Color Usage
- **Primary actions**: `bg-neon text-background` with scale hover effects
- **Secondary actions**: `border border-white/15` with neon hover state
- **Text hierarchy**: 
  - Headlines: `text-on-background` (full opacity)
  - Body: `text-on-background/50` (50% opacity)
  - Labels: `text-on-background/30` (30% opacity)

### Typography
- **Headlines**: `font-headline font-black italic` (Chakra Petch)
- **Body**: `font-body` (Hanken Grotesk)
- **Labels/Code**: `font-mono` (JetBrains Mono)
- Sizes: Use `clamp()` for fluid sizing between breakpoints

### Common Classes
- `skew-card` + `skew-content`: 6° skew effect on primary buttons
- `text-glow`: Neon text shadow effect for emphasis
- `kinetic-border`: Left 3px neon border (unused in current design)
- `radar-grid`: Radial gradient grid background

## Image Assets
- **Imagen-BG.png**: Background image, placed in `public/`, displayed at 15% opacity in Landing
- **logo.png**: INVICTO logo, inverted (brightness-0 invert filter) for display on dark bg
- **Phone Mockup**: Loaded from Google Photos URL in Hero (external)

## State Management
- **Simple useState** for modal open/close (`Landing.tsx`)
- Props drilling for `onCTAClick` callbacks
- Framer Motion for animation state
- No Redux or Context API needed (keep it simple)

## Metadata & SEO
- **Title**: "INVICTO | Democratizando el Fútbol Profesional"
- **Description**: "La plataforma de social scouting que conecta el talento con las oportunidades reales mediante tecnología de élite."
- Set in `layout.tsx` via Next.js Metadata API

## Deployment
- Deployed on **Vercel** (production environment)
- Configured for Next.js with automatic optimizations
- Environment: Spanish language (`lang="es"`)
- No required environment variables currently

## Common Patterns & Best Practices

1. **Avoid premature optimization**: Use `once: true` in viewport for animations
2. **Performance**: Lazy load sections (Framer Motion handles this)
3. **Accessibility**: Use semantic HTML, ARIA where needed, ensure link titles
4. **Code style**: 
   - TypeScript strict mode enabled
   - No unused variables
   - Use interfaces for component props
5. **Naming**: kebab-case for CSS classes, camelCase for JS variables/functions

## Known Limitations & TODOs
- Phone mockup uses external Google Photos URL (consider hosting locally)
- Modal state is local; in future could integrate with app store links
- No dynamic content yet (all hardcoded copy)
- Analytics not implemented

## Future Enhancements
- Add email collection for waitlist
- Integrate with actual app store links (iOS/Android)
- Add blog section with success stories
- Implement i18n for multiple languages
- Performance optimizations (image optimization, dynamic imports)
- A/B testing for CTAs
