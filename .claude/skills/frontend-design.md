# Frontend Design Skill (Anthropic)
Source: https://officialskills.sh/anthropics/skills/frontend-design

## Aesthetic Commitment Protocol
Before writing ANY code, commit to a specific visual tone. Do NOT default to:
- Purple gradients on white
- Generic Inter font on #fff background  
- Material UI defaults
- Bootstrap-style card grids

## MakerLab Brand Aesthetic: NEOBRUTALIST MAKER-PUNK
Core visual DNA:
- **Color system**: Brand red (#c0272d), orange (#e87722), blue (#2563a8), green (#27a060), black borders
- **Border style**: 4px solid black everywhere — neobrutalist hard edges
- **Shadows**: offset box-shadows (neo-shadows) — never soft/blurry
- **Typography**: Space Grotesk (display, black weight) + Fredoka (body)
- **Motion**: Bold, snappy transitions — not soft fades. Think: industrial snap, elastic bounce
- **Spatial composition**: Asymmetric, rotated elements, overlapping layers

## Design Principles to Apply
1. **Atmospheric backgrounds**: Use diagonal hatch patterns, dot grids, or noise — never plain white
2. **Kinetic typography**: Animated word reveals, scale transforms on key words
3. **Bold spatial hierarchy**: Giant text (140px+) anchored left, with contrasting elements right
4. **Micro-interactions**: Every clickable element must have a distinct hover state (translate + shadow-collapse)
5. **Depth layers**: Use z-index layering with decorative elements behind, content above
6. **Motion timing**: 
   - Entrances: 0.6s ease-out (not linear)
   - Hover: 0.15s ease-out (snappy)
   - Looping: Use CSS keyframes, not JS intervals where possible

## Web Design Guidelines (Vercel Labs)
- Hierarchy must be immediately readable in 3 seconds
- Primary CTA must be visually dominant — largest or brightest element
- Navigation must clearly indicate current page
- Mobile-first: design at 375px, enhance for 1280px+
- Animations must not block interactivity (use pointer-events: none on decorative)
- Color contrast: text on colored backgrounds must pass WCAG AA

## Hero Section Rules
- H1 must be the largest element on the page
- Subheading max 2 lines, supporting role
- Single primary CTA above the fold
- Visual anchor (image/illustration) balances the text side
- Scroll indicator hints at content below
