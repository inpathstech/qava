# Navbar & Footer Specifications for Next.js Implementation

## 📋 Table of Contents
1. [Global Styles](#global-styles)
2. [Navbar Specifications](#navbar-specifications)
3. [Footer Specifications](#footer-specifications)
4. [Responsive Breakpoints](#responsive-breakpoints)
5. [JavaScript/Interactions](#javascriptinteractions)

---

## Global Styles

### Typography
```css
font-family: 'Inter', sans-serif;
/* Import from Google Fonts: */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;700&display=swap');
```

### Reset
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: white;
}
```

---

## Navbar Specifications

### 🎨 Structure
```
├── header-container (sticky navigation bar)
    ├── header-logo (left section)
    │   └── logo (36x36px)
    ├── header-center (center section)
    │   └── navigation
    │       ├── nav-item (Create Listing)
    │       ├── nav-item (Search Listings)
    │       ├── nav-item (Pricing)
    │       └── nav-item (About)
    └── header-right (right section)
        ├── auth-section
        │   ├── auth-item (How Qava Works)
        │   ├── auth-item (Log in)
        │   └── join-button (Join for free)
        └── hamburger-menu (mobile only)
```

### 📏 Container Specs

#### `.header-container`
```css
.header-container {
  width: 100%;
  padding: 16px 32px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 64px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 1000;
  overflow: visible;
}
```

#### `.header-logo`
```css
.header-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo img {
  width: 36px;
  height: 36px;
}
```

#### `.header-center`
```css
.header-center {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  margin-left: 40px;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

#### `.header-right`
```css
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

### 🔗 Navigation Items

#### `.nav-item` (center navigation links)
```css
.nav-item {
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 13px;
  font-weight: 400;
  line-height: 1;
  height: 25px;
  color: #000000;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  position: relative;
  gap: 4px;
  text-decoration: none;
  vertical-align: middle;
  box-sizing: border-box;
}

.nav-item:hover,
.nav-item.active {
  background-color: rgba(0, 0, 0, 0.06);
  color: #000000;
}

.nav-item:visited,
.nav-item:active {
  color: #000000;
}
```

#### `.auth-item` (right-side auth links)
```css
.auth-item {
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 400;
  color: #000000;
  white-space: nowrap;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.auth-item:hover {
  background-color: rgba(0, 0, 0, 0.06);
  color: #000000;
}
```

### 🔵 Primary Button (Join for free)

#### `.join-button`
```css
.join-button {
  padding: 6px 12px;
  background: #0F62FE;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  font-family: inherit;
  white-space: nowrap;
  text-decoration: none;
}

.join-button:hover {
  background: #0053E5;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 43, 255, 0.25);
}

.join-text {
  color: white;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;
}
```

### 🍔 Hamburger Menu (Mobile)

#### `.hamburger-menu`
```css
.hamburger-menu {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 6px;
  z-index: 1001;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.hamburger-menu:hover {
  background-color: rgba(55, 53, 47, 0.08);
}

.hamburger-line {
  width: 18px;
  height: 2px;
  background-color: #000000;
  margin: 2px 0;
  transition: 0.2s ease;
  border-radius: 1px;
}
```

### 📱 Mobile Menu

#### `.mobile-menu`
```css
.mobile-menu {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: white;
  z-index: 1000;
  flex-direction: column;
  padding: 80px 16px 32px 16px;
  overflow-y: auto;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-menu.active {
  display: flex;
}

.mobile-nav-item {
  padding: 12px 24px;
  border-bottom: none;
  text-align: left;
  font-size: 13px;
  font-weight: 400;
  color: #000000;
  transition: color 0.2s ease;
  cursor: pointer;
  text-decoration: none;
}

.mobile-nav-item:hover {
  color: rgba(55, 53, 47, 1);
}
```

---

## Footer Specifications

### 🎨 Structure
```
├── footer-section
    └── footer-container
        └── footer-content
            ├── footer-logo (39% width, left)
            │   └── logo (40x40px)
            └── footer-links (60% width, 3-column grid)
                ├── footer-column (Welcome)
                ├── footer-column (Get Started)
                ├── footer-column (Resources)
                ├── footer-column (Learn)
                ├── footer-column (Legal)
                └── footer-copyright (© 2025 qava)
```

### 📏 Container Specs

#### `.footer-section`
```css
.footer-section {
  background: white;
  width: 100%;
  max-width: 1070px;
  margin: 0 auto;
  padding: 78px 0 46px 0;
  margin-top: 50px;
  border-top: 1px solid #EBEBEB;
}
```

#### `.footer-container`
```css
.footer-container {
  max-width: 940px;
  margin: 0 auto;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
}
```

#### `.footer-logo`
```css
.footer-logo {
  width: 39%;
  padding: 2px 15px 0 0;
  margin-bottom: 30px;
}

.footer-logo-img {
  width: 40px;
  height: auto;
  cursor: pointer;
}
```

#### `.footer-links`
```css
.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 60%;
  gap: 16px 25px;
  padding: 0 15px 0 10px;
}
```

### 📑 Column Specs

#### `.footer-column`
```css
.footer-column {
  display: flex;
  flex-direction: column;
}
```

#### `.footer-heading`
```css
.footer-heading {
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  color: #000000;
  margin-bottom: 8px;
  font-weight: 600;
  margin: 0 0 8px 0;
}
```

#### `.footer-link-list`
```css
.footer-link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-link-list li {
  margin: 0;
  padding: 0;
}
```

### 🔗 Footer Links

#### `.footer-link`
```css
.footer-link {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #797979;
  text-decoration: none;
  line-height: 1.2;
  transition: text-decoration 0.2s ease;
}

.footer-link:hover {
  text-decoration: underline;
}
```

#### `.footer-link.disabled-link` (Coming Soon items)
```css
.footer-link.disabled-link {
  cursor: not-allowed;
  opacity: 0.6;
  position: relative;
}

.footer-link.disabled-link:hover {
  text-decoration: none;
  opacity: 0.8;
  color: #999999;
}

.footer-link.disabled-link:hover::before {
  content: "Coming Soon";
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: #000000;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
```

#### `.footer-copyright`
```css
.footer-copyright {
  grid-column: 1 / -1;
  margin-top: 14px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #797979;
}
```

---

## Responsive Breakpoints

### 🖥️ Desktop Large (1400px and below)
```css
@media (max-width: 1400px) {
  .header-container {
    padding: 16px 24px;
  }
  
  .navigation {
    gap: 28px;
  }
}
```

### 💻 Desktop (1200px and below)
```css
@media (max-width: 1200px) {
  .header-container {
    padding: 16px 20px;
  }
  
  .navigation {
    gap: 24px;
  }
  
  .nav-item {
    padding: 6px 8px;
    font-size: 13px;
  }
}
```

### 📱 Tablet (1100px and below)
```css
@media (max-width: 1100px) {
  .header-container {
    padding: 12px 20px;
  }
  
  .navigation {
    display: none;
  }
  
  .hamburger-menu {
    display: flex;
  }
  
  .header-right {
    flex-shrink: 0;
    gap: 8px;
  }
}
```

### 📱 Mobile (768px and below)
```css
@media (max-width: 768px) {
  .header-container {
    padding: 12px 16px;
  }
  
  .header-right {
    gap: 12px;
  }
  
  .auth-item {
    display: none;
  }
  
  .auth-section {
    display: flex;
  }
  
  .hamburger-menu {
    display: flex;
    margin-left: 0;
    padding: 6px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    order: 2;
  }
  
  .hamburger-menu:hover {
    background-color: rgba(55, 53, 47, 0.08);
  }
  
  /* Footer Mobile */
  .footer-logo {
    width: 100%;
    padding: 2px 20px 0 20px;
    margin-bottom: 30px;
  }
  
  .footer-links {
    width: 100%;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 20px 0 20px;
  }
  
  .footer-column {
    gap: 4px;
  }
}
```

---

## JavaScript/Interactions

### Toggle Mobile Menu
```javascript
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  mobileMenu.classList.toggle('active');
  
  // Prevent body scroll when mobile menu is open
  if (mobileMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}
```

### Close Menu on Outside Click
```javascript
document.addEventListener('click', function(event) {
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  
  if (mobileMenu.classList.contains('active') && 
      !mobileMenu.contains(event.target) && 
      !hamburgerMenu.contains(event.target)) {
    toggleMobileMenu();
  }
});
```

### Responsive Behavior
```javascript
window.addEventListener('resize', function() {
  if (window.innerWidth > 1100) {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  }
});
```

---

## 📊 Key Metrics Summary

### Colors
- **Primary Brand Color:** `#0F62FE` (Join button background)
- **Primary Brand Hover:** `#0053E5` (Join button hover)
- **Text Primary:** `#000000` (nav items, headings)
- **Text Secondary:** `#797979` (footer links)
- **Text Tertiary:** `rgba(55, 53, 47, 0.6)` (dropdown subtitles)
- **Background Hover:** `rgba(0, 0, 0, 0.06)` (nav item hover)
- **Border:** `#EBEBEB` (footer top border)

### Spacing
- **Container Padding (Desktop):** `16px 32px`
- **Container Padding (Mobile):** `12px 16px`
- **Nav Items Gap:** `8px`
- **Auth Section Gap:** `8px`
- **Footer Top Padding:** `78px`
- **Footer Bottom Padding:** `46px`

### Typography Weights
- **Thin:** `300` (footer links, dropdown subtitles)
- **Regular:** `400` (nav items, auth items)
- **Medium:** `500` (dropdown titles)
- **Semibold:** `600` (footer headings)

### Border Radius
- **Small:** `4px` (hamburger hover, tooltip)
- **Medium:** `6px` (nav items, buttons)
- **Large:** `8px` (dropdown menu)

---

## 🎯 Next.js Implementation Notes

### Recommended Approach:
1. Create separate components:
   - `<Navbar />` component
   - `<Footer />` component
   - `<MobileMenu />` component

2. Use CSS Modules or Tailwind CSS for styling

3. Store navigation links in a config file:
```typescript
export const navLinks = [
  { label: 'Create Listing', href: '/create' },
  { label: 'Search Listings', href: '/projects' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' }
];

export const authLinks = [
  { label: 'How Qava Works', href: '/howqavaworks' },
  { label: 'Log in', href: '/login' }
];
```

4. Use Next.js `<Link>` component for client-side navigation

5. Implement `useState` for mobile menu toggle

6. Use `useEffect` for scroll prevention and window resize handling

---

## ✅ Checklist for Implementation

- [ ] Install Inter font from Google Fonts
- [ ] Create Navbar component with all states (default, hover, active)
- [ ] Create Footer component with 5 columns
- [ ] Implement responsive breakpoints (1400px, 1200px, 1100px, 768px)
- [ ] Add hamburger menu with animations
- [ ] Test mobile menu toggle functionality
- [ ] Implement "Coming Soon" tooltip for disabled links
- [ ] Test all link hover states
- [ ] Verify z-index layering (sticky nav, mobile menu)
- [ ] Test smooth animations and transitions
- [ ] Ensure accessibility (ARIA labels, keyboard navigation)

---

**Document Version:** 1.0  
**Last Updated:** January 6, 2025  
**Source:** index.html from Qava.ai

