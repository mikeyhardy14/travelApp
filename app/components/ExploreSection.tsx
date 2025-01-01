"use client"; // If you're using Next.js 13+ (app dir), ensure this is a client component.

import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Example icons (gray) from react-icons
import { FaMapMarkerAlt, FaTicketAlt, FaMoneyCheckAlt, FaSuitcaseRolling } from 'react-icons/fa';

const ExploreSection: React.FC = () => {
  // Fake data for now
  const fakeData = [
    {
      id: 1,
      name: "Paris",
      location: "France",
      images: [
        { url: "/images/paris1.jpg", event: "Eiffel Tower Visit" },
        { url: "/images/paris2.jpg", event: "Louvre Museum Tour" },
        { url: "/images/paris3.jpg", event: "Seine River Cruise" },
        { url: "/images/paris4.jpg", event: "Montmartre Exploration" }
      ],
      description: "Paris is the capital of France, known for its art, fashion, gastronomy, and culture. It offers an unparalleled blend of history and modernity, making it one of the most visited cities in the world."
    },
    {
      id: 2,
      name: "Tokyo",
      location: "Japan",
      images: [
        { url: "/images/tokyo1.jpg", event: "Shibuya Crossing Experience" },
        { url: "/images/tokyo2.jpg", event: "Tokyo Tower Visit" },
        { url: "/images/tokyo3.jpg", event: "Cherry Blossom Viewing" },
        { url: "/images/tokyo4.jpg", event: "Akihabara Shopping" }
      ],
      description: "Tokyo is Japan's bustling capital, famous for its skyscrapers, shopping, and cuisine. It combines traditional temples with ultramodern architecture to create a truly unique experience."
    },
    {
      id: 3,
      name: "New York",
      location: "USA",
      images: [
        { url: "/images/new-york1.jpg", event: "Statue of Liberty Tour" },
        { url: "/images/new-york2.jpg", event: "Times Square Walk" },
        { url: "/images/new-york3.jpg", event: "Central Park Stroll" },
        { url: "/images/new-york4.jpg", event: "Broadway Show" }
      ],
      description: "New York City, USA, is a global hub for finance, culture, and entertainment. Known as the city that never sleeps, it offers iconic landmarks and diverse cultural experiences."
    },
    {
      id: 4,
      name: "Sydney",
      location: "Australia",
      images: [
        { url: "/images/sydney1.jpg", event: "Opera House Tour" },
        { url: "/images/sydney2.jpg", event: "Bondi Beach Visit" },
        { url: "/images/sydney3.jpg", event: "Harbor Bridge Climb" },
        { url: "/images/sydney4.jpg", event: "Taronga Zoo Exploration" }
      ],
      description: "Sydney, Australia, is renowned for its Opera House, harbor, and beaches. It provides a mix of vibrant city life and stunning natural scenery."
    },
  ];

  // Randomly select a location
  const [selectedLocation, setSelectedLocation] = useState(fakeData[0]);

  // Only pick a random location once when component mounts
  useEffect(() => {
    const randomLocation = fakeData[Math.floor(Math.random() * fakeData.length)];
    setSelectedLocation(randomLocation);
  }, []);

  // Steps data
  const steps = [
    {
      title: "Find your destination",
      description: "Embark on a journey to discover your dream destination, where adventure and relaxation await.",
      image: "/images/how-it-works-1.jpg",
      icon: <FaMapMarkerAlt className="text-2xl text-gray-600" />,
    },
    {
      title: "Book a ticket",
      description: "Ensure a smooth travel experience by booking tickets to your preferred destination via our platform.",
      image: "/images/how-it-works-2.jpg",
      icon: <FaTicketAlt className="text-2xl text-gray-600" />,
    },
    {
      title: "Make payment",
      description: "We offer a variety of payment options to meet your preferences and ensure a hassle-free transaction.",
      image: "/images/how-it-works-3.jpg",
      icon: <FaMoneyCheckAlt className="text-2xl text-gray-600" />,
    },
    {
      title: "Explore destination",
      description: "Immerse yourself in a tapestry of sights, sounds, and tastes as you wind through historic streets.",
      image: "/images/how-it-works-4.jpg",
      icon: <FaSuitcaseRolling className="text-2xl text-gray-600" />,
    }
  ];

  // Reference to the carousel
  const sliderRef = useRef<Slider | null>(null);

  // Hovered step index (if user hovers a bullet)
  const [hoveredStepIndex, setHoveredStepIndex] = useState<number | null>(null);

  // Active slide index from the carousel
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Slower rotation: 5s per slide, 800ms transition
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,        // Slower transition speed
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    // Called after each slide changes => we update activeSlideIndex
    afterChange: (current: number) => {
      setActiveSlideIndex(current);
    },
  };

  if (!selectedLocation) return null; // Safety check

  // Handle bullet hover => highlight and jump carousel
  const handleHover = (index: number | null) => {
    setHoveredStepIndex(index);
    if (index !== null) {
      sliderRef.current?.slickGoTo(index);
    }
  };

  // Decide which bullet is highlighted:
  // If hoveredStepIndex is NOT null, use that. Otherwise use activeSlideIndex.
  const highlightIndex = hoveredStepIndex !== null ? hoveredStepIndex : activeSlideIndex;

  return (
    <div className="bg-white p-8 w-full max-w-[1000px] mx-auto">
      {/* --- Best Location Header --- */}
      <div className="mb-8">
        <p className="text-gray-500 text-sm">Best location</p>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-black font-bold text-3xl mr-6">
            {selectedLocation.name}, {selectedLocation.location}
          </h3>
          <p className="text-gray-500 text-sm max-w-[400px] text-right">
            {selectedLocation.description}
          </p>
        </div>
      </div>

      {/* --- Top Row of Images --- */}
      <div className="grid grid-cols-5 gap-6">
        {selectedLocation.images.slice(0, 2).map((image, index) => (
          <div
            key={index}
            className={`
              ${index === 0 ? 'col-span-3' : 'col-span-2'}
              h-80 bg-gray-200 rounded-xl relative overflow-hidden shadow-lg
            `}
            style={{
              backgroundImage: `url(${image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute bottom-0 left-0 text-white text-sm font-bold p-4">
              <p>{image.event}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Bottom Row of Images --- */}
      <div className="grid grid-cols-5 gap-6 mt-6 mb-32">
        {selectedLocation.images.slice(2).map((image, index) => (
          <div
            key={index}
            className={`
              ${index === 0 ? 'col-span-2' : 'col-span-3'}
              h-80 bg-gray-200 rounded-xl relative overflow-hidden shadow-xl
            `}
            style={{
              backgroundImage: `url(${image.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute bottom-0 left-0 text-white text-sm font-bold p-4">
              <p>{image.event}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- How It Works Section --- */}
      <div className="mt-16 grid grid-cols-2 gap-8 items-start mb-32">
        {/* LEFT: Carousel (auto-rotates more slowly) */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <Slider ref={sliderRef} {...sliderSettings}>
            {steps.map((step, index) => (
              <div key={index}>
                <img
                  src={step.image}
                  alt={`Step ${index + 1}`}
                  className="w-full h-80 object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* RIGHT: Steps bullet list */}
        <div>
          <h4 className="text-gray-500 text-sm mb-2">How it works</h4>
          <h2 className="text-black font-bold text-3xl mb-6">One click for you</h2>
          <ul className="space-y-4">
            {steps.map((step, index) => {
              const isActive = highlightIndex === index;
              return (
                <li
                  key={index}
                  onMouseEnter={() => handleHover(index)}
                  onMouseLeave={() => handleHover(null)}
                  className={`
                    cursor-pointer rounded-md p-3
                    transition-shadow duration-300
                    ${isActive ? 'shadow-md bg-gray-100' : 'bg-white'}
                  `}
                >
                  <div className="flex items-start space-x-3">
                    {/* Step icon */}
                    <div className="text-2xl text-gray-600">
                      {step.icon}
                    </div>
                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {step.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ExploreSection;
