'use client';

import React, { useState, useRef, useEffect } from 'react';
import D3Map from '../components/D3Map';
import Map from '../components/Map';

interface CountryInfo {
  name: string;
  image: string;
  description: string;
}

const countryData: Record<string, CountryInfo> = {
  France: {
    name: 'France',
    image: 'https://example.com/france.jpg',
    description: 'France, in Western Europe, encompasses medieval cities, alpine villages, and Mediterranean beaches. Paris, its capital, is famed for its fashion houses, classical art museums including the Louvre and monuments like the Eiffel Tower.'
  },
  // Add more countries here...
};

const ExplorePage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typedDescription, setTypedDescription] = useState<string>('');
  const countryInfoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (countryInfo) {
      let index = 0;
      setTypedDescription(''); // Clear the previous description
      const typingInterval = setInterval(() => {
        setTypedDescription((prev) => prev + countryInfo.description[index]);
        index++;
        if (index === countryInfo.description.length) {
          clearInterval(typingInterval);
        } else if (countryInfoRef.current) {
          countryInfoRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 20); // Adjust the speed of typing here

      // Initial scroll to country info section
      if (countryInfoRef.current) {
        countryInfoRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [countryInfo]);

  const handleSearch = () => {
    if (searchTerm) {
      const matchedCountry = Object.keys(countryData).find(
        country => country.toLowerCase() === searchTerm.toLowerCase()
      );
      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        setCountryInfo(countryData[matchedCountry]);
      } else {
        alert('Country not found.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filteredSuggestions = Object.keys(countryData).filter((country) =>
        country.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    const matchedCountry = countryData[suggestion];
    if (matchedCountry) {
      setSelectedCountry(suggestion);
      setCountryInfo(matchedCountry);
    }
  };

  return (
    <div className="relative p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore the World</h1>

      <div className="relative flex justify-center mb-8 w-full max-w-md">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-l-lg w-full"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
          onClick={handleSearch}
        >
          Search
        </button>

        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-center w-full">
        <Map />
      </div>

      <section className="py-16"></section>

      <D3Map
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countryData={countryData}
        setCountryInfo={setCountryInfo}
      />

      {countryInfo && (
        <div ref={countryInfoRef} className="max-w-2xl w-full text-left space-y-8 px-4">
          <section className="py-16"></section>
          <img src={countryInfo.image} alt={countryInfo.name} className="max-w-full text-center h-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">{countryInfo.name}</h2>
          <p className="text-lg">{typedDescription}</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
