import React from 'react';

const LogoSlider = ({ logos = [] }) => {
  // Duplicate the logos array to create seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      
      {/* Logo container with animation */}
      <div className="flex animate-scroll">
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-6 py-4 transition-opacity duration-300"
            style={{ minWidth: '200px' }} // Ensure consistent logo width
          >
            <div className="flex items-center justify-center h-12 opacity-70 hover:opacity-100 transition-opacity duration-200">
              <img
                src={logo.src}
                alt={logo.alt || `Logo ${index + 1}`}
                className="h-8 w-auto max-w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoSlider;
