import React from 'react';
import UserSection from './components/UserSection';
import ExploreSection from './components/ExploreSection';
import SearchBar from './components/SearchBar';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Orange Banner Section */}
      <div className="bg-orange-500 text-white py-40 px-8 md:px-16 flex flex-col items-center relative rounded-b-3xl">
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
          className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 flex justify-between gap-6 z-10"
          style={{ width: '80%' }}
        >
          <div className="flex-1 bg-white text-gray-800 rounded-2xl shadow-lg p-6 text-center font-bold text-sm h-36">
            <div className="text-3xl font-bold text-black">Chat</div>
            <div className="text-sm text-gray-500 mt-2">Talk to Friends</div>
          </div>
          <div className="flex-1 bg-white text-gray-800 rounded-2xl shadow-lg p-6 text-center font-bold text-sm h-36">
            <div className="text-3xl font-bold text-black">Book</div>
            <div className="text-sm text-gray-500 mt-2">Get the Best Prices</div>
          </div>
          <div className="flex-1 bg-white text-gray-800 rounded-2xl shadow-lg p-6 text-center font-bold text-sm h-36">
            <div className="text-3xl font-bold text-black">Coordinate</div>
            <div className="text-sm text-gray-500 mt-2">Plan Trips Together</div>
          </div>
          <div className="flex-1 bg-white text-gray-800 rounded-2xl shadow-lg p-6 text-center font-bold text-sm h-36">
            <div className="text-3xl font-bold text-black">5.0</div>
            <div className="text-sm text-gray-500 mt-2">Average Rating</div>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="mt-48">
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
