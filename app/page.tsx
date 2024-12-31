import React from 'react';
import UserSection from './components/UserSection';
import ExploreSection from './components/ExploreSection';
import SearchBar from './components/SearchBar';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Orange Banner Section */}
      <div className="bg-orange-500 text-white py-40 px-8 md:px-16 flex flex-col items-center relative">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4">Welcome</h1>
          <h2 className="text-5xl font-bold mb-6">Travel App</h2>
          <p className="text-lg mb-8">
            Travel the World seamlessly with friends in an all-in-one travel app
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-4xl">
          <SearchBar />
        </div>

        {/* Overlapping Blocks */}
        <div
          className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 flex justify-between gap-6 z-10"
          style={{ width: '80%' }}
        >
          <div className="flex-1 bg-white text-gray-800 rounded-2xl shadow-lg p-8 text-center font-bold text-sm h-56">
            Block 1 Content
          </div>
          <div className="flex-1 bg-white text-gray-800 rounded-2xl shadow-lg p-8 text-center font-bold text-sm h-56">
            Block 2 Content
          </div>
          <div className="flex-1 bg-white text-gray-800 rounded-2xl shadow-lg p-8 text-center font-bold text-sm h-56">
            Block 3 Content
          </div>
          <div className="flex-1 bg-white text-gray-800 rounded-2xl shadow-lg p-8 text-center font-bold text-sm h-56">
            Block 4 Content
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="mt-56">
        <UserSection />
      </div>

      {/* Explore Section */}
      <div>
        <ExploreSection />
      </div>
    </div>
  );
};

export default HomePage;
