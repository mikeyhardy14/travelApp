// app/page.tsx
import React from 'react';
import Header from './components/Header';
import UserSection from './components/UserSection';
import ExploreSection from './components/ExploreSection';
import { FaSearch } from 'react-icons/fa';

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="bg-orange-500 text-white p-8 md:p-16">
        <h1 className="text-4xl font-bold mb-2">Welcome</h1>
        <h2 className="text-4xl font-bold mb-6">Travel App</h2>
        <p className="text-sm mb-6">Travel the World seamlessly with friends in an all-in-one travel app</p>

        <div className="flex items-center text-black mb-6">
          <input 
            type="text" 
            placeholder="Search destinations" 
            className="p-3 w-full max-w-md rounded-l-lg border-0"
          />
          <button className="bg-orange-600 p-4 lg:p-4 rounded-r-lg">
            <FaSearch className="text-white text-lg lg:text-xl"/>
          </button>
        </div>

        <div className="flex space-x-4">
          <button className="bg-white text-orange-500 py-2 px-4 rounded-full font-bold">
            HOTELS
          </button>
          <button className="bg-gray-500 text-white py-2 px-4 rounded-full font-bold">
            FLIGHTS
          </button>
        </div>
      </div>

      <UserSection />
      <ExploreSection />
    </div>
  );
};

export default HomePage;
