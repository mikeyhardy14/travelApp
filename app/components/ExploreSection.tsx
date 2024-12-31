// app/components/ExploreSection.tsx
import React from 'react';

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
  const selectedLocation = fakeData[Math.floor(Math.random() * fakeData.length)];

  return (
    <div className="bg-white p-8 w-full max-w-[1000px] mx-auto">
      <div className="mb-8">
        <p className="text-gray-500 text-sm">Best location</p>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-black font-bold text-3xl mr-6">{selectedLocation.name}, {selectedLocation.location}</h3>
          <p className="text-gray-500 text-sm max-w-[400px] text-right">{selectedLocation.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-6">
        {selectedLocation.images.slice(0, 2).map((image, index) => (
          <div
            key={index}
            className={`${index === 0 ? 'col-span-3' : 'col-span-2'} h-80 bg-gray-200 rounded-xl relative overflow-hidden shadow-md`}
            style={{ backgroundImage: `url(${image.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute bottom-0 left-0 text-white text-sm font-bold p-4">
              <p>{image.event}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-6 mt-6">
        {selectedLocation.images.slice(2).map((image, index) => (
          <div
            key={index}
            className={`${index === 0 ? 'col-span-2' : 'col-span-3'} h-80 bg-gray-200 rounded-xl relative overflow-hidden shadow-md`}
            style={{ backgroundImage: `url(${image.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute bottom-0 left-0 text-white text-sm font-bold p-4">
              <p>{image.event}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-2 gap-8 items-center">
        <div className="bg-gray-200 rounded-xl overflow-hidden shadow-md">
          <img
            src="/images/sample-how-it-works.jpg"
            alt="How it works"
            className="w-full h-full object-cover"
          />
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Embark on a journey to find your dream destination, where adventure and relaxation await, creating unforgettable memories along the way.
            </p>
            <div className="flex items-center space-x-4">
              <button className="bg-black text-white text-sm py-2 px-4 rounded">Search</button>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-gray-500 text-sm mb-2">How it works</h4>
          <h2 className="text-black font-bold text-3xl mb-6">One click for you</h2>
          <ul className="space-y-4">
            <li>
              <h3 className="text-black font-bold text-lg">Find your destination</h3>
              <p className="text-gray-500 text-sm">
                Embark on a journey to discover your dream destination, where adventure and relaxation await.
              </p>
            </li>
            <li>
              <h3 className="text-black font-bold text-lg">Book a ticket</h3>
              <p className="text-gray-500 text-sm">
                Ensure a smooth travel experience by booking tickets to your preferred destination via our platform.
              </p>
            </li>
            <li>
              <h3 className="text-black font-bold text-lg">Make payment</h3>
              <p className="text-gray-500 text-sm">
                We offer a variety of payment options to meet your preferences and ensure a hassle-free transaction.
              </p>
            </li>
            <li>
              <h3 className="text-black font-bold text-lg">Explore destination</h3>
              <p className="text-gray-500 text-sm">
                You’ll be immersed in a captivating tapestry of sights, sounds, and tastes as you wind your way through the ancient streets.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExploreSection;