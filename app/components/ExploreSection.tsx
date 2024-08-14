// app/components/ExploreSection.tsx
import React from 'react';

const ExploreSection: React.FC = () => {
  return (
    <div className="bg-white p-8">
      <h3 className="text-lg font-bold mb-4">EXPLORE</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

export default ExploreSection;
