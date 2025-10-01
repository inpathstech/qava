import React, { useState, useEffect } from 'react';

const LogoSliderEnhanced = ({ 
  logos = [], 
  visibleCount = 5, 
  speed = 30, 
  pauseOnHover = true,
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Duplicate the logos array to create seamless loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  // Calculate animation duration based on speed prop
  const animationDuration = speed;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white via-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white via-white to-transparent pointer-events-none" />
      
      {/* Logo container with animation */}
      <div 
        className="flex"
        style={{
          animation: isHovered && pauseOnHover ? 'none' : `scroll ${animationDuration}s linear infinite`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.src}-${index}`}
            className="flex-shrink-0 px-4 py-3 transition-all duration-300"
            style={{ 
              minWidth: `${100 / visibleCount}%`,
              maxWidth: `${100 / visibleCount}%`
            }}
          >
            <div className="flex items-center justify-center h-12 opacity-70 hover:opacity-100 transition-opacity duration-200 group">
              <img
                src={logo.src}
                alt={logo.alt || `Logo ${index + 1}`}
                className="h-8 w-auto max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-200"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoSliderEnhanced;
