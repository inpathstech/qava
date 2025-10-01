import React from 'react';
import LogoSliderEnhanced from './LogoSliderEnhanced';
import './LogoSlider.css';

const LogoSliderIntegration = () => {
  // University logos data matching your existing structure
  const universityLogos = [
    {
      src: "Landing Page Trusted by/Stern.png",
      alt: "NYU Stern School of Business"
    },
    {
      src: "Landing Page Trusted by/Wharton.png", 
      alt: "Wharton School of Business"
    },
    {
      src: "Landing Page Trusted by/HBS.png",
      alt: "Harvard Business School"
    },
    {
      src: "Landing Page Trusted by/Haas.png",
      alt: "Berkeley Haas School of Business"
    },
    {
      src: "Landing Page Trusted by/Standford.png",
      alt: "Stanford Graduate School of Business"
    },
    {
      src: "Landing Page Trusted by/Said.png",
      alt: "Saïd Business School"
    },
    {
      src: "Landing Page Trusted by/Kellogg.png",
      alt: "Kellogg School of Management"
    },
    {
      src: "Landing Page Trusted by/MIT.png",
      alt: "MIT Sloan School of Management"
    }
  ];

  return (
    <div className="trusted-by-section-hero">
      <div className="trusted-by-text-hero">
        Trusted by +1000 top talent and institutions
      </div>
      
      {/* Replace the static logos with the animated slider */}
      <div className="trusted-by-logos-hero">
        <LogoSliderEnhanced 
          logos={universityLogos}
          visibleCount={5}
          speed={25}
          pauseOnHover={true}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default LogoSliderIntegration;
