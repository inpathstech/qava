import React from 'react';
import CheckmarkIcon from './CheckmarkIcon';

const CheckmarkExample = () => {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Checkmark Icon Examples</h1>
      
      {/* Different sizes */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Different Sizes:</h2>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <CheckmarkIcon size={32} />
            <span className="text-sm mt-2">32x32</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckmarkIcon size={64} />
            <span className="text-sm mt-2">64x64</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckmarkIcon size={128} />
            <span className="text-sm mt-2">128x128</span>
          </div>
        </div>
      </div>

      {/* With custom styling */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">With Custom Styling:</h2>
        <div className="flex items-center space-x-4">
          <CheckmarkIcon size={64} className="shadow-lg" />
          <CheckmarkIcon size={64} className="shadow-lg hover:scale-110 transition-transform" />
          <CheckmarkIcon size={64} className="shadow-lg hover:bg-gray-800 transition-colors" />
        </div>
      </div>

      {/* Usage in context */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Usage in Context:</h2>
        <div className="flex items-center space-x-3 p-4 border rounded-lg">
          <CheckmarkIcon size={24} />
          <span>Task completed successfully</span>
        </div>
        <div className="flex items-center space-x-3 p-4 border rounded-lg">
          <CheckmarkIcon size={32} />
          <span>Form validation passed</span>
        </div>
      </div>
    </div>
  );
};

export default CheckmarkExample;
