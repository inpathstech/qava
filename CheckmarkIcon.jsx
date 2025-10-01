import React from 'react';

const CheckmarkIcon = ({ size = 64, className = '' }) => {
  return (
    <div 
      className={`bg-black rounded-lg flex items-center justify-center ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px` 
      }}
    >
      <svg 
        width={`${size * 0.6}`} 
        height={`${size * 0.6}`} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path 
          d="M20 6L9 17L4 12" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default CheckmarkIcon;
