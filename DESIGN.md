# Design

## Color Palette

| Token | Value | Role |
|---|---|---|
| `brand-maroon` | `#7E0D0D` | Primary action, CTA buttons, active states, badges |
| `brand-accent` | `#922222` | Hover state for maroon elements |
| `brand-navy` | `#1B2A44` | Headings, body text, dark backgrounds |
| `brand-bg` | `#FDF5F5` | Page background, card fills, subtle washes |
| `brand-border` | `#F3DCDC` | Dividers, card borders, input borders |
| `brand-white` | `#FFFFFF` | Card surfaces, nav background |

**Usage rules:**
- Use `brand-maroon` for exactly one CTA per section — never two competing red buttons
- `brand-navy` for all headings; `brand-navy/70` for body; `brand-navy/50` for captions
- Section alternation: white → brand-bg → brand-navy (dark) → repeat. Never two dark sections back-to-back.

## Typography

**Fonts:** Inter (UI, body, headings) + JetBrains Mono (scores, ranks, stats, code)

| Scale | Size | Weight | Usage |
|---|---|---|---|
| Display | 4xl–6xl | 800 | Hero headlines |
| H1 | 3xl–4xl | 800 | Page titles |
| H2 | 2xl–3xl | 700 | Section headings |
| H3 | lg–xl | 700 | Card titles |
| Body | sm–base | 400–500 | Paragraphs |
| Caption | xs–sm | 400–600 | Labels, badges, metadata |
| Mono | xs–sm | 700 | Stats, ranks, scores |

**Hierarchy rule:** Maximum 3 font-size steps on any single screen. Headlines should be 2–3× larger than body text — never subtle differences.

## Spacing & Layout

- **Max-width:** `max-w-7xl` (80rem) with `px-4 sm:px-6 lg:px-8` side padding
- **Section padding:** `py-14` to `py-20` — breathing room between sections
- **Card padding:** `p-5` to `p-6` — consistent internal spacing
- **Grid gutters:** `gap-4` (tight), `gap-6` (standard), `gap-8` (spacious)
- **Mobile-first:** all grids collapse to 1-col; course cards go 1→2→3 columns

## Component Patterns

### Buttons
- **Primary:** `bg-brand-maroon hover:bg-brand-accent text-white font-bold px-6 py-3 rounded-xl`
- **Secondary:** `bg-brand-bg border border-brand-border text-brand-navy font-semibold px-6 py-3 rounded-xl`
- **Ghost:** text link with `text-brand-maroon font-bold` + arrow icon
- Never use outlined-only buttons for primary CTAs — they look too soft for this brand

### Cards
- `bg-white border border-brand-border rounded-2xl` with `hover:shadow-lg transition-all`
- Image cards: real photo + gradient overlay, title overlaid on image
- Course cards: category badge (colored) → title → bullets → price → dual CTA
- Testimonial cards: quote mark decoration, avatar initials, score badge

### Badges / Tags
- Category badges: colored solid (`bg-blue-600 text-white`) — one per card, top-left
- Status badges: pill shape, `rounded-full`, small (`text-xs px-2.5 py-0.5`)

### Section headings
- Always: eyebrow label (`text-[11px] uppercase tracking-widest text-brand-accent`) → H2 → optional one-line subtitle
- Never more than 2 lines of subtitle text under a section heading

### Navigation
- Sticky white navbar, `h-16`, logo left, links center, CTAs right
- Dropdown menus: hover-triggered, white card with `rounded-xl shadow-xl border border-brand-border`
- Active/hover nav link: `text-brand-maroon`

### Forms
- Input: `bg-brand-bg/50 border border-brand-border rounded-lg px-3.5 py-2.5 text-sm`
- Focus: `focus:border-brand-maroon outline-none`
- Labels: `text-xs font-bold text-brand-navy/80` above the input
- Submit: full-width primary button with uppercase tracking

## Motion & Animation

- **Marquee** (notice ticker): CSS `animate-marquee` — pause on `prefers-reduced-motion`
- **Fade-in**: `animate-fade-in` on page entry — 0.3s, opacity 0→1
- **Hover lifts**: `hover:-translate-y-1` on cards — subtle, not bouncy
- **Ping**: `animate-ping` on live indicator dot — always paired with solid dot behind it
- **Pulse**: `animate-pulse` on "Live Now" badge
- All animations: `@media (prefers-reduced-motion: reduce) { animation: none }`

## Image Strategy

- **Category cards:** Real Unsplash photos with colored gradient overlay (`bg-gradient-to-t opacity-70`)
- **Course cards:** `image_url` from CMS, fallback to `bg-gradient-to-br from-brand-maroon to-brand-accent`
- **Blog cards:** Gradient placeholder (navy → maroon), no stock photos needed
- **Avatars:** Initials circle (`h-10 w-10 rounded-full bg-brand-border text-brand-maroon font-extrabold`)
- **Aspect ratios:** 16:9 for course hero images, square for avatars, free-height for page banners

## Dark Sections

Used for: Toppers/Results section, course page callback strip
- Background: `bg-brand-navy`
- Text: `text-white`, muted: `text-white/60`
- Cards inside: `bg-white/5 border border-white/10 hover:bg-white/10`
- Accent highlight: `text-yellow-400` for scores/ranks (high contrast on navy)

## Don'ts

- No more than 2 red/maroon elements competing on the same row
- No full-width solid maroon backgrounds (use navy for dark sections instead)
- No default gray (`gray-*`) colors — always use brand tokens
- No Tailwind defaults like `rounded-md` — use `rounded-xl` or `rounded-2xl` for brand consistency
- No decorative illustrations or clip-art — photography + gradients only
- No more than 3 sentences of body copy in any card
