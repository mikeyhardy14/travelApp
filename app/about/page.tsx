import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div>
      <div className="bg-green-900 text-white p-8 md:p-40">
        <h1 className="text-4xl font-bold mb-2">The best place to travel is TravelApp</h1>
      </div>
      <section className="py-32">
      </section>
      <div className='flex flex-col justify-center items-center'>
        <h2 className="text-6xl font-bold text-center mb-8">
          Hello
        </h2>
      <section className="py-32">
      </section>
        <div className="max-w-2xl w-full text-left space-y-8 px-4">
          <p className="font-serif text-lg">
            Today, we process billions of queries across our platforms each year for travel information, helping millions of travelers around the globe make confident decisions. With every query, TravelApp searches hundreds of travel sites to show travelers the information they need to find the right flights, hotels, rental cars and vacation packages.
          </p>
          <p className="font-sans text-lg">
            In over a decade, we've grown from a small office of 14 employees into a company of over 1,000 travel-loving teammates working across 7 international brands; TravelApp, SWOODOO, checkfelix, momondo, Cheapflights, Mundi and HotelsCombined. <strong>Together, we make it easier for everyone to experience the world.</strong>
          </p>
          <p className="font-mono text-lg"> 
            In 2013, we were acquired by Booking Holdings, the world leader in online travel.
          </p>
        <section className="py-32">
        </section>
          </div>
        </div>
    </div>
  );
};

export default AboutPage;
