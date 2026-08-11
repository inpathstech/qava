# Pricing Page Hero Section Specifications

## 📋 Overview
Complete specifications for the hero section on the Pricing page at [https://www.theclubnyc.com/pricing](https://www.theclubnyc.com/pricing)

---

## 🎨 Hero Section Structure

```
├── pricing-content (main container)
    └── pricing-header (hero section)
        ├── pricing-title (h1: "Pricing")
        └── pricing-subtitle (p: "Tired of complicated pricing tiers? Us too.")
```

---

## 📏 Container Specifications

### `.pricing-content` (Main Container)
```css
.pricing-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 32px;
  min-height: 60vh;
}
```

**Key Details:**
- **Max Width:** `1200px`
- **Padding (Desktop):** `80px` top/bottom, `32px` left/right
- **Margin:** Auto-centered horizontally
- **Min Height:** `60vh` (60% of viewport height)

---

### `.pricing-header` (Hero Section Container)
```css
.pricing-header {
  text-align: center;
  margin-bottom: 60px;
}
```

**Key Details:**
- **Text Alignment:** Center
- **Bottom Margin:** `60px` (space between hero and content)

---

## 📝 Typography Specifications

### `.pricing-title` (Main Heading)
```css
.pricing-title {
  font-size: 48px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 16px;
}
```

**Key Details:**
- **Element:** `<h1>`
- **Font Size:** `48px`
- **Font Weight:** `700` (Bold)
- **Color:** `#000000` (Black)
- **Bottom Margin:** `16px` (space between title and subtitle)
- **Font Family:** `'Inter', sans-serif`

---

### `.pricing-subtitle` (Subheading)
```css
.pricing-subtitle {
  font-size: 18px;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.7);
  max-width: 600px;
  margin: 0 auto;
}
```

**Key Details:**
- **Element:** `<p>`
- **Font Size:** `18px`
- **Font Weight:** `300` (Light)
- **Color:** `rgba(0, 0, 0, 0.7)` (70% opacity black / dark gray)
- **Max Width:** `600px`
- **Margin:** Auto-centered horizontally
- **Font Family:** `'Inter', sans-serif`

---

## 📱 Responsive Design

### Mobile (768px and below)
```css
@media (max-width: 768px) {
  .pricing-content {
    padding: 60px 16px;
  }
  
  .pricing-title {
    font-size: 36px;
  }
  
  .pricing-subtitle {
    font-size: 16px;
  }
}
```

**Mobile Adjustments:**
- **Container Padding:** `60px` vertical, `16px` horizontal
- **Title Font Size:** `36px` (reduced from 48px)
- **Subtitle Font Size:** `16px` (reduced from 18px)

---

## 🎯 HTML Structure

```html
<div class="pricing-content">
  <div class="pricing-header">
    <h1 class="pricing-title">Pricing</h1>
    <p class="pricing-subtitle">Tired of complicated pricing tiers? Us too.</p>
  </div>
  
  <!-- Rest of pricing content below -->
</div>
```

---

## 📊 Visual Specifications Summary

### Desktop (>768px)
| Element | Font Size | Font Weight | Color | Max Width | Margin Bottom |
|---------|-----------|-------------|-------|-----------|---------------|
| **Title** | 48px | 700 | #000000 | - | 16px |
| **Subtitle** | 18px | 300 | rgba(0,0,0,0.7) | 600px | - |
| **Container** | - | - | - | 1200px | - |

### Mobile (≤768px)
| Element | Font Size | Font Weight | Color | Max Width | Padding |
|---------|-----------|-------------|-------|-----------|---------|
| **Title** | 36px | 700 | #000000 | - | - |
| **Subtitle** | 16px | 300 | rgba(0,0,0,0.7) | 600px | - |
| **Container** | - | - | - | 1200px | 60px 16px |

---

## 🎨 Color Palette

### Text Colors
- **Primary (Title):** `#000000` (Pure Black)
- **Secondary (Subtitle):** `rgba(0, 0, 0, 0.7)` (70% Black - #B3B3B3 equivalent)

### Background
- **Page Background:** `white`

---

## 📏 Spacing System

### Vertical Spacing
- **Container Top/Bottom Padding (Desktop):** `80px`
- **Container Top/Bottom Padding (Mobile):** `60px`
- **Header Bottom Margin:** `60px`
- **Title Bottom Margin:** `16px`

### Horizontal Spacing
- **Container Side Padding (Desktop):** `32px`
- **Container Side Padding (Mobile):** `16px`
- **Subtitle Max Width:** `600px` (auto-centered)

---

## 🔤 Typography Hierarchy

### Font Sizes
```css
Desktop:
- Title: 48px
- Subtitle: 18px

Mobile:
- Title: 36px
- Subtitle: 16px
```

### Font Weights
```css
- Title: 700 (Bold)
- Subtitle: 300 (Light)
```

### Line Heights
```css
/* Default browser line-height applies (typically ~1.2 for headings) */
```

---

## ⚡ Implementation Notes for Next.js

### Component Structure
```tsx
// PricingHero.tsx
export default function PricingHero() {
  return (
    <div className="pricing-content">
      <div className="pricing-header">
        <h1 className="pricing-title">Pricing</h1>
        <p className="pricing-subtitle">
          Tired of complicated pricing tiers? Us too.
        </p>
      </div>
    </div>
  );
}
```

### Tailwind CSS Equivalent
```tsx
<div className="max-w-[1200px] mx-auto px-8 py-20 min-h-[60vh] md:px-8 sm:px-4 sm:py-15">
  <div className="text-center mb-15">
    <h1 className="text-5xl font-bold text-black mb-4 md:text-4xl sm:text-[36px]">
      Pricing
    </h1>
    <p className="text-lg font-light text-black/70 max-w-[600px] mx-auto md:text-base">
      Tired of complicated pricing tiers? Us too.
    </p>
  </div>
</div>
```

### CSS Modules
```css
/* PricingHero.module.css */
.pricingContent {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 32px;
  min-height: 60vh;
}

.pricingHeader {
  text-align: center;
  margin-bottom: 60px;
}

.pricingTitle {
  font-size: 48px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 16px;
}

.pricingSubtitle {
  font-size: 18px;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.7);
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .pricingContent {
    padding: 60px 16px;
  }
  
  .pricingTitle {
    font-size: 36px;
  }
  
  .pricingSubtitle {
    font-size: 16px;
  }
}
```

---

## ✅ Implementation Checklist

- [ ] Install Inter font from Google Fonts
- [ ] Create PricingHero component
- [ ] Apply desktop styles (48px title, 18px subtitle)
- [ ] Implement responsive breakpoint at 768px
- [ ] Set max-width to 1200px and center container
- [ ] Apply 60px margin-bottom to header section
- [ ] Center-align all text
- [ ] Set subtitle max-width to 600px with auto-centering
- [ ] Use font-weight 700 for title, 300 for subtitle
- [ ] Set title color to #000000
- [ ] Set subtitle color to rgba(0, 0, 0, 0.7)
- [ ] Test on mobile devices (title 36px, subtitle 16px)
- [ ] Verify vertical spacing (80px desktop, 60px mobile)

---

## 🎯 Design Principles

1. **Simplicity:** Clean, centered layout with minimal distractions
2. **Hierarchy:** Clear visual hierarchy with bold title and lighter subtitle
3. **Breathing Room:** Generous spacing (60px below header) for content clarity
4. **Responsive:** Graceful degradation for smaller screens
5. **Typography:** Professional use of Inter font family with varied weights
6. **Alignment:** Everything centered for symmetry and focus

---

## 📐 Measurements Quick Reference

```
Desktop Container: 1200px max-width
Desktop Padding: 80px vertical, 32px horizontal
Mobile Padding: 60px vertical, 16px horizontal

Title Desktop: 48px / 700 weight / #000000
Title Mobile: 36px / 700 weight / #000000

Subtitle Desktop: 18px / 300 weight / rgba(0,0,0,0.7) / 600px max-width
Subtitle Mobile: 16px / 300 weight / rgba(0,0,0,0.7) / 600px max-width

Header Bottom Margin: 60px
Title Bottom Margin: 16px
```

---

**Document Version:** 1.0  
**Last Updated:** January 6, 2025  
**Source:** pricing.html from www.theclubnyc.com  
**Reference URL:** https://www.theclubnyc.com/pricing

