# Deployment Guide for New Landing Page (index.html)

## 📋 Pre-Deployment Checklist

### ✅ Files Required
Your new landing page requires these files to be uploaded:

#### Core Files:
- ✅ `index.html` - Main landing page
- ✅ `qava-logo.svg` - Logo file
- ✅ `shared-navbar.html` - Shared navigation component
- ✅ `load-navbar.js` - Navbar loader script

#### Image Folders (if used):
- `Landing Page Trusted by/` - University logos (MIT, Wharton, Harvard, etc.)
- `Rate card images/` - Project/job images (if any)
- `Testimonial company logos/` - Company logos for testimonials
- `Testimonial images/` - Profile photos for testimonials

## 🚀 Deployment Options

### Option 1: Using qava.ai Hosting (Recommended)

If you're deploying to https://qava.ai/, you likely have one of these setups:

**A. Static Site Hosting (Netlify, Vercel, GitHub Pages, etc.):**
1. Connect your repository to the hosting service
2. Set build directory to `/Users/reedlangridge/Figma Test/`
3. Set publish directory to root (`/`)
4. Deploy branch: `main`

**B. Traditional Web Server (Apache, Nginx, etc.):**
1. Upload files via FTP/SFTP to your web root directory
2. Ensure all image folders maintain their relative paths
3. Set proper file permissions (644 for files, 755 for directories)

**C. Using Git Deployment:**
```bash
# From your Figma Test directory
cd "/Users/reedlangridge/Figma Test"

# Add the new changes
git add index.html shared-navbar.html load-navbar.js DEPLOYMENT_GUIDE.md

# Commit with a message
git commit -m "Updated landing page with new navigation and design"

# Push to your hosting provider
git push origin main
```

### Option 2: Quick Test Before Publishing

Before deploying, test locally:

```bash
# Navigate to the directory
cd "/Users/reedlangridge/Figma Test"

# Start a local server (Python 3)
python3 -m http.server 8000

# Or use Python 2
python -m SimpleHTTPServer 8000

# Or use Node.js (if installed)
npx http-server -p 8000
```

Then open: http://localhost:8000/index.html

## 📁 File Structure Check

Your deployment should maintain this structure:
```
/
├── index.html
├── qava-logo.svg
├── shared-navbar.html
├── load-navbar.js
├── pricing.html
├── why-qava.html
├── clienthowitworks.html
├── talenthowitworks.html
├── demo.html
├── terms.html
├── Landing Page Trusted by/
│   ├── MIT.png
│   ├── Stern.png
│   ├── Wharton.png
│   ├── HBS.png
│   ├── Haas.png
│   ├── Standford.png
│   ├── Kellogg.png
│   ├── Said.png
│   └── AGSM.jpg
├── Testimonial company logos/
│   ├── Boon.svg
│   ├── Captable.svg
│   ├── mmento.svg
│   ├── Saturn Guard.svg
│   ├── Stum.svg
│   └── The Rise Group.svg
└── (other image folders as needed)
```

## 🔍 Post-Deployment Verification

After deployment, check these items:

### 1. Navigation Links
- [ ] "Create Listing" → https://app.qava.ai/
- [ ] "Search Listings" → https://app.qava.ai/
- [ ] "How It Works" dropdown works
  - [ ] "For Clients" → https://qava.ai/clienthowitworks
  - [ ] "For Talent" → https://qava.ai/talenthowitworks
- [ ] "Why Qava" → https://qava.ai/whyqava
- [ ] "Pricing" → https://qava.ai/pricing
- [ ] "Request a demo" → https://qava.ai/demo
- [ ] "Log in" → https://app.qava.ai/
- [ ] "Join for free" → https://app.qava.ai/

### 2. Visual Elements
- [ ] Qava logo displays correctly
- [ ] University logos display (9 schools)
- [ ] Testimonial cards display properly
- [ ] All sections load without layout issues
- [ ] Mobile menu works (hamburger icon)

### 3. Responsive Design
- [ ] Desktop view (1440px+)
- [ ] Tablet view (768px - 1100px)
- [ ] Mobile view (<768px)

### 4. Performance
- [ ] Page loads quickly
- [ ] Images are optimized
- [ ] No console errors in browser DevTools

## 🐛 Common Issues & Solutions

### Issue: Logo doesn't display
**Solution:** Check that `qava-logo.svg` is in the same directory as `index.html`

### Issue: University logos missing
**Solution:** Verify the `Landing Page Trusted by/` folder path is correct relative to `index.html`

### Issue: Navigation links don't work
**Solution:** Ensure URLs are correct:
- External links use full URLs (https://qava.ai/...)
- App links use https://app.qava.ai/

### Issue: Mobile menu doesn't open
**Solution:** Check that JavaScript is enabled and the mobile menu script is loading

## 📊 Analytics Setup (Optional)

If you want to track page performance, add Google Analytics or similar:

```html
<!-- Add before closing </head> tag in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

## 🔒 Security Checklist

- [ ] HTTPS is enabled
- [ ] No sensitive data in source code
- [ ] External links use proper target attributes
- [ ] Form submissions are secure (if applicable)

## 📞 Need Help?

If you encounter deployment issues:
1. Check browser console for errors (F12 → Console tab)
2. Verify all file paths are correct
3. Test on a local server first
4. Check hosting provider documentation

## ✅ Ready to Deploy?

Once you've verified everything works locally and all files are ready, proceed with your chosen deployment method above.

**Current Status:** All files are updated and ready for deployment! 🚀

---
*Last updated: October 25, 2025*



















