# Qava Design Standards

## Overview
This document defines the comprehensive design system extracted from the Qava landing page (`index.html`). Use these standards consistently across all pages to maintain visual harmony and user experience.

---

## 🎨 Color Palette

### Primary Colors
- **Primary Blue (CTA)**: `#0F62FE`
  - Hover: `#0053E5`
  - Used for primary buttons, links, and interactive elements
  - Shadow on hover: `rgba(0, 43, 255, 0.25)`

- **Text Black**: `#000000`
  - Primary text color for all headings and important content

- **Text Gray**: `rgba(55, 53, 47, 0.6)` or `rgba(0, 0, 0, 0.7)`
  - Secondary text for descriptions and subheadings
  - Note: Uses RGB value `rgba(55, 53, 47, X)` for opacity control

- **Background White**: `white` or `#fafafa`
  - Page background (white for main sections)
  - Light gray (`#fafafa`) for alternating sections

### Interactive States
- **Hover Background**: `rgba(0, 0, 0, 0.06)` - Light hover state
- **Active Background**: `rgba(55, 53, 47, 0.08)` - More prominent hover/active state
- **Secondary Hover**: `rgba(55, 53, 47, 0.04)` - Subtle hover state

### Border Colors
- **Light Border**: `rgba(0, 0, 0, 0.06)` - Subtle borders for cards and dropdowns
- **Featured Badge**: Blue `#0F62FE` background with white text

---

## 📝 Typography

### Font Family
- **Primary**: `'Inter', sans-serif`
- **Weights Available**: 200, 300, 400, 500, 700
- **Source**: Google Fonts CDN

### Font Sizes

#### Desktop
- **Hero Title**: `64px` (h1, main hero headline)
- **Section Titles**: `36px` (h2, major section headers)
- **Card Titles**: `24px` (h3, card headers)
- **Subheadings**: `18px` (hero subheadline, section subheadings)
- **Body Text**: `13px` (navigation, general text)
- **Small Text**: `12px` (descriptions, quotes, meta information)
- **Tiny Text**: `9px` (badges, labels)

#### Mobile (≤768px)
- **Hero Title**: `40px`
- **Section Titles**: `28px`
- **Card Titles**: `20px`
- **Subheadings**: `16px`
- **Body Text**: `13px`
- **Small Text**: `12px`

#### Small Mobile (≤480px)
- **Hero Title**: `32px`
- **Section Titles**: `24px`
- **Card Titles**: `18px`
- **Subheadings**: `14px`
- **Body Text**: `13px`
- **Small Text**: `12px`

### Font Weights
- **700 (Bold)**: Hero titles, section titles, card titles
- **500 (Medium)**: Navigation links, dropdown titles, buttons
- **400 (Regular)**: Body text, general content
- **300 (Light)**: Descriptions, secondary text, subheadings
- **200 (Extra Light)**: Rarely used, for subtle emphasis

### Line Heights
- **Standard**: `1.5` (paragraphs, body text)
- **Compact**: `1.3` (dropdown subtitles, short descriptions)
- **Tight**: `1.2` (button text, labels)

---

## 📏 Spacing System

### Padding

#### Container Padding
- **Desktop**: `32px` (standard section containers)
- **Tablet**: `24px` (reduced for smaller screens)
- **Mobile**: `20px` (compact mobile padding)
- **Very Small**: `16px` (tight mobile spaces)

#### Section Padding
- **Major Sections (Top/Bottom)**: `100px 0 60px 0` (standard vertical rhythm)
- **Minor Sections**: `60px 0 20px 0` (shorter vertical rhythm)
- **Special Sections**: `80px 0` (hero section)
- **Compact Sections**: `40px 0 20px 0` (minimal vertical space)

#### Component Padding
- **Cards**: `16px 24px` (comfortable card internal spacing)
- **Buttons**: `6px 12px` (standard button padding)
- **Buttons (Large)**: `12px 24px` (prominent CTAs)
- **Dropdown Items**: `12px` (clickable menu items)
- **Nav Items**: `6px 12px` (navigation links)

### Margins

#### Vertical Margins
- **Large**: `32px` (major section separation)
- **Medium**: `24px` (standard element spacing)
- **Small**: `12px` (tight element grouping)
- **Micro**: `8px` (minimal spacing between related items)

#### Horizontal Margins
- **Auto**: `margin: 0 auto` (centering containers)
- **Standard**: `24px` (side spacing on mobile)
- **Compact**: `16px` (tight side spacing)

### Gaps (Flexbox/Grid)
- **Large**: `60px` (hero content gap)
- **Medium**: `40px` (major component gaps)
- **Standard**: `24px` (card grid gaps)
- **Small**: `16px` (tight gaps between elements)
- **Micro**: `8px` (minimal gaps, navigation)
- **Tiny**: `4px` (between icons and text)

---

## 🎯 Component Standards

### Buttons

#### Primary Button (Join for free)
```css
background: #0F62FE;
color: white;
font-size: 13px;
padding: 6px 12px;
border-radius: 6px;
transition: all 0.15s ease;
```
**Hover State:**
```css
background: #0053E5;
transform: translateY(-1px);
box-shadow: 0 4px 8px rgba(0, 43, 255, 0.25);
```

#### Secondary Button (Search)
```css
background: transparent;
color: #0F62FE;
font-size: 13px;
padding: 12px 24px;
border-radius: 6px;
transition: all 0.3s ease;
```
**Hover State:**
```css
background-color: rgba(0, 0, 0, 0.06);
```

### Cards

#### Summary Cards (Projects, Jobs, Internships)
```css
background: white;
border-radius: 12px;
padding: 24px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
transition: all 0.2s ease;
```
**Hover State:**
```css
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
```

#### Listing Cards
```css
background: white;
border-radius: 8px;
padding: 16px;
border: 1px solid rgba(0, 0, 0, 0.06);
transition: all 0.2s ease;
```
**Active/Hover State:**
```css
background: white;
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
transform: translateY(-2px);
```

### Badges

#### Featured Badge
```css
background: #0F62FE;
color: white;
font-size: 10px;
font-weight: 500;
padding: 4px 8px;
border-radius: 12px;
```

#### Type Badge (Project Type)
```css
background: #fafafa;
color: inherit;
font-size: 9px;
font-weight: 500;
padding: 4px 8px;
border-radius: 6px;
border: none;
```

### Inputs and Form Elements
- **Border Radius**: `6px` (consistent with buttons)
- **Font Size**: `13px`
- **Padding**: `12px 16px`
- **Border**: `1px solid rgba(0, 0, 0, 0.06)`

---

## 🏗️ Layout Standards

### Container Widths
- **Max Width**: `1440px` (hero and major sections)
- **Standard Width**: `900px` (standard content containers)
- **Mobile Width**: `100%` with side padding

### Container Structure
```css
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 32px;
}
```

### Grid Systems

#### Two-Column Grid
```css
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 24px;
```

#### Three-Column Grid
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 16px;
```

#### Responsive Grid
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 24px;
```

### Flexbox Patterns

#### Horizontal Layout
```css
display: flex;
align-items: center;
gap: 24px;
```

#### Vertical Stack
```css
display: flex;
flex-direction: column;
gap: 16px;
```

#### Centered Content
```css
display: flex;
align-items: center;
justify-content: center;
```

---

## 🎭 Effects & Animations

### Transitions
- **Standard**: `transition: all 0.2s ease` (most interactive elements)
- **Quick**: `transition: all 0.15s ease` (buttons)
- **Smooth**: `transition: all 0.3s ease` (larger elements)

### Hover Effects
- **Elevation**: `transform: translateY(-1px to -2px)` + increased `box-shadow`
- **Background Change**: `background-color: rgba(0, 0, 0, 0.06)`
- **Color Shift**: Darker blue on primary buttons

### Shadows
- **Subtle**: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)`
- **Medium**: `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12)`
- **Primary Hover**: `box-shadow: 0 4px 8px rgba(0, 43, 255, 0.25)`

### Animations
- **Slide Down**: `@keyframes slideDown` (mobile menu, 0.2s ease-out)
- **Text Color Pulse**: Animation for hero title (slow color transition)

---

## 📱 Responsive Breakpoints

### Desktop First Approach
- **Desktop**: Default (all styles above)
- **Tablet**: `@media (max-width: 768px)`
- **Mobile**: `@media (max-width: 480px)`

### Mobile-Specific Adjustments

#### Navigation
- **Sticky Header**: `position: sticky; top: 0;`
- **Mobile Menu**: Full-screen overlay with slide-down animation
- **Hamburger Icon**: `32px x 32px`, 3 lines

#### Typography Scale
- Reduce hero titles by ~50% on mobile
- Maintain readable body text size (13px minimum)
- Increase line-height for better readability

#### Layout Transformations
- **Two-Column → Single Column**: `flex-direction: column`
- **Three-Column → Two-Column**: Grid adjustments
- **Horizontal → Vertical**: Stack elements vertically

---

## 🎨 Visual Hierarchy

### Z-Index Layers
- **Overlay/Modal**: `10000` (dropdowns, mobile menu)
- **Sticky Header**: `1000`
- **Floating Elements**: `50`
- **Standard**: `10`
- **Base**: `1`

### Opacity Values
- **Hidden**: `opacity: 0; visibility: hidden`
- **Subtle**: `rgba(0, 0, 0, 0.06)` - hover states
- **Medium**: `rgba(55, 53, 47, 0.6)` - secondary text
- **Visible**: `opacity: 1`

---

## 🔲 Border Radius Standards
- **Buttons**: `6px`
- **Cards**: `8px` (small cards), `12px` (large cards)
- **Badges**: `12px` (pill-shaped), `6px` (rectangular)
- **Dropdowns**: `8px`
- **Inputs**: `6px`

---

## 📐 Image Standards

### Aspect Ratios
- **Hero Images**: Flexible (contained)
- **Cards**: Square or flexible based on content
- **Logos**: Preserve original aspect ratio

### Image Paths
- **Project Type Images**: `Project Type Images Oct 2025/[Name].svg`
- **Company Logos**: `Landing Page Trusted by/[name].svg`
- **Testimonials**: `Testimonial images/[name].png`

---

## 🎪 Special Sections

### Hero Section
- **Padding**: `80px 0`
- **Title**: `64px`, bold, black
- **Subtitle**: `18px`, lighter gray
- **Max Width**: `1440px`
- **Gap**: `60px` between content and image

### Feature Cards Section
- **Background**: White
- **Padding**: `100px 0 60px 0`
- **Container**: `900px max-width`
- **Grid**: Responsive 4-column → 2-column → 1-column

### Customer Stories Section
- **Background**: `#fafafa` (light gray)
- **Padding**: `40px 0 20px 0`
- **Cards**: White background, 3-column grid

### Network Effect Section
- **Padding**: `20px 0 100px 0`
- **Layout**: Horizontal flex with centered circle and text
- **Mobile**: Vertical stack with scaled-down circle

---

## ✅ Accessibility Standards

### Color Contrast
- **Text on White**: Black (`#000000`) meets WCAG AAA
- **White on Blue**: White on `#0F62FE` meets WCAG AA
- **Gray Text**: Ensure sufficient contrast ratio

### Interactive Elements
- **Minimum Touch Target**: `44px x 44px` (buttons, links)
- **Focus States**: Include visible focus indicators
- **Hover States**: Always provide visual feedback

### Semantics
- Use proper heading hierarchy (h1 → h2 → h3)
- Semantic HTML5 elements (nav, header, main, section, footer)
- ARIA labels where needed

---

## 🚀 Performance Considerations

### Image Optimization
- Use SVG format for illustrations and icons
- Optimize PNG/JPG for photos
- Lazy load images below the fold

### Animation Performance
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `margin`, `padding`
- Set `will-change` for animated elements

### Font Loading
- Load Inter from Google Fonts CDN
- Specify `display=swap` for better performance

---

## 📋 Quick Reference

### Most Common Values
- **Font Size**: `13px`
- **Padding**: `6px 12px` (buttons/nav), `16px 24px` (cards)
- **Border Radius**: `6px`
- **Transition**: `0.2s ease`
- **Color**: `#0F62FE` (primary), `#000000` (text)
- **Spacing**: `24px` (standard), `40px` (large)
- **Shadow**: `0 4px 12px rgba(0, 0, 0, 0.08)`

---

## 📝 Notes

- All measurements use `px` units (no `rem` or `em` in current implementation)
- Consistent use of `rgba()` for opacity control
- Standard section spacing creates visual rhythm (`100px top, 60px bottom`)
- Mobile-first responsive design with graceful degradation
- Clean, minimal aesthetic with generous white space

---

**Document Version**: 1.0  
**Last Updated**: Based on index.html analysis  
**Maintained By**: Qava Design Team


















