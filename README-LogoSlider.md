# Logo Slider Component

A React component that displays company/university logos in a continuous sliding loop with fade effects.

## Features

- ✅ **Continuous sliding animation** - Logos slide infinitely without sharp jumps
- ✅ **Fade effects** - Logos fade in/out at the edges using gradient overlays
- ✅ **Responsive design** - Works well on desktop, tablet, and mobile
- ✅ **Hover pause** - Animation pauses when user hovers over the slider
- ✅ **Customizable** - Configurable speed, visible count, and styling
- ✅ **TailwindCSS** - Uses TailwindCSS for styling
- ✅ **Performance optimized** - Uses lazy loading and efficient animations

## Components

### 1. LogoSlider (Basic)
Simple version with basic functionality.

### 2. LogoSliderEnhanced (Recommended)
Enhanced version with more features and customization options.

## Usage

### Basic Usage

```jsx
import React from 'react';
import LogoSlider from './LogoSlider';
import './LogoSlider.css';

const MyComponent = () => {
  const logos = [
    { src: "/path/to/logo1.png", alt: "Company 1" },
    { src: "/path/to/logo2.png", alt: "Company 2" },
    // ... more logos
  ];

  return <LogoSlider logos={logos} />;
};
```

### Enhanced Usage with Customization

```jsx
import React from 'react';
import LogoSliderEnhanced from './LogoSliderEnhanced';
import './LogoSlider.css';

const MyComponent = () => {
  const logos = [
    { src: "/path/to/logo1.png", alt: "Company 1" },
    { src: "/path/to/logo2.png", alt: "Company 2" },
    // ... more logos
  ];

  return (
    <LogoSliderEnhanced 
      logos={logos}
      visibleCount={5}        // Number of logos visible at once
      speed={25}              // Animation speed in seconds
      pauseOnHover={true}     // Pause animation on hover
      className="custom-class" // Additional CSS classes
    />
  );
};
```

## Props

### LogoSliderEnhanced Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logos` | Array | `[]` | Array of logo objects with `src` and `alt` properties |
| `visibleCount` | Number | `5` | Number of logos visible at a time |
| `speed` | Number | `30` | Animation duration in seconds |
| `pauseOnHover` | Boolean | `true` | Whether to pause animation on hover |
| `className` | String | `""` | Additional CSS classes |

### Logo Object Structure

```javascript
{
  src: "path/to/logo.png",    // Required: Image source
  alt: "Company Name"         // Required: Alt text for accessibility
}
```

## Integration with Your Existing Page

To replace your current static logo section with the animated slider:

1. **Import the component:**
```jsx
import LogoSliderEnhanced from './LogoSliderEnhanced';
import './LogoSlider.css';
```

2. **Replace the static logos section:**
```jsx
// Instead of:
<div class="trusted-by-logos-hero">
  <div class="logo-item-hero">
    <img src="..." alt="..." />
  </div>
  // ... more static logos
</div>

// Use:
<LogoSliderEnhanced 
  logos={universityLogos}
  visibleCount={5}
  speed={25}
  pauseOnHover={true}
  className="w-full"
/>
```

## Styling

The component uses TailwindCSS classes and includes:

- **Gradient overlays** for fade effects
- **Responsive design** with different speeds for different screen sizes
- **Hover effects** with opacity and grayscale transitions
- **Smooth animations** with CSS transitions

### Custom Styling

You can customize the appearance by:

1. **Modifying the CSS file** (`LogoSlider.css`)
2. **Adding custom classes** via the `className` prop
3. **Overriding TailwindCSS classes** in your CSS

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance Tips

1. **Optimize images** - Use compressed PNG/JPG files
2. **Lazy loading** - Images are loaded with `loading="lazy"`
3. **Error handling** - Failed images are hidden automatically
4. **Efficient animations** - Uses CSS transforms for smooth performance

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check file paths are correct
   - Ensure images exist in the specified location

2. **Animation not smooth**
   - Reduce the number of visible logos
   - Increase animation speed
   - Check for CSS conflicts

3. **Mobile performance**
   - Reduce animation speed on mobile
   - Use fewer visible logos on small screens

## Example with University Logos

```jsx
const universityLogos = [
  {
    src: "Landing Page Trusted by/Stern.png",
    alt: "NYU Stern School of Business"
  },
  {
    src: "Landing Page Trusted by/Wharton.png", 
    alt: "Wharton School of Business"
  },
  // ... more university logos
];

<LogoSliderEnhanced 
  logos={universityLogos}
  visibleCount={5}
  speed={25}
  pauseOnHover={true}
/>
```

This will create a smooth, continuous sliding animation showing 5 university logos at a time with fade effects at the edges.
