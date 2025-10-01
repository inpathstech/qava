import React from 'react';
import LogoSlider from './LogoSlider';
import './LogoSlider.css';

const LogoSliderExample = () => {
  // University logos data
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Trusted by +1000 top talent and institutions
        </h2>
        <p className="text-gray-600">
          Leading business schools and universities choose our platform
        </p>
      </div>
      
      <LogoSlider logos={universityLogos} />
    </div>
  );
};

export default LogoSliderExample;
