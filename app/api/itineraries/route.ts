import { NextResponse } from 'next/server';

const itineraries = [
    {
      id: '1',
      title: 'Exploring Paris',
      profile: {
        name: 'Alice Johnson',
        avatarUrl: '/images/avatar1.jpg',
      },
      flights: ['AF203'],
      accommodations: 'Le Meurice Hotel',
      restaurants: ['Le Cinq', 'Café de la Paix', 'Pierre Hermé'],
      activities: ['Louvre Museum', 'Eiffel Tower', 'Seine River Cruise'],
      media: [
        { url: '/images/paris1.jpg', type: 'image' },
        { url: '/videos/paris.mp4', type: 'video' },
      ],
      likes: 120,
      comments: [
        { text: 'Looks amazing!' },
        { text: 'Can’t wait to visit Paris myself!' },
        { text: 'That river cruise is on my list!' },
      ],
    },
    {
      id: '2',
      title: 'Tokyo Adventures',
      profile: {
        name: 'Ben Tanaka',
        avatarUrl: '/images/avatar2.jpg',
      },
      flights: ['JL123', 'NH456'],
      accommodations: 'Shinjuku Granbell Hotel',
      restaurants: ['Sukiyabashi Jiro', 'Ichiran Ramen', 'Ginza Kojyu'],
      activities: ['Shibuya Crossing', 'Tokyo Tower', 'Akihabara'],
      media: [
        { url: '/images/tokyo1.jpg', type: 'image' },
        { url: '/images/tokyo2.jpg', type: 'image' },
      ],
      likes: 85,
      comments: [
        { text: 'Tokyo is incredible!' },
        { text: 'Shibuya Crossing is a must-see.' },
      ],
    },
    {
      id: '3',
      title: 'Safari in Kenya',
      profile: {
        name: 'Claire Adams',
        avatarUrl: '/images/avatar3.jpg',
      },
      flights: ['KQ101'],
      accommodations: 'Mara Serena Safari Lodge',
      restaurants: ['Lodge Dining', 'Boma Dinner Experience'],
      activities: ['Game Drive', 'Balloon Safari', 'Maasai Village Tour'],
      media: [
        { url: '/images/kenya1.jpg', type: 'image' },
        { url: '/videos/kenya.mp4', type: 'video' },
      ],
      likes: 150,
      comments: [
        { text: 'This looks like a dream!' },
        { text: 'Did you see any lions?' },
      ],
    },
    {
      id: '4',
      title: 'Weekend in New York',
      profile: {
        name: 'David Kim',
        avatarUrl: '/images/avatar4.jpg',
      },
      flights: ['DL404'],
      accommodations: 'The Plaza Hotel',
      restaurants: ['Katz’s Delicatessen', 'Carbone', 'Eleven Madison Park'],
      activities: ['Central Park', 'Broadway Show', 'Statue of Liberty'],
      media: [
        { url: '/images/nyc1.jpg', type: 'image' },
        { url: '/images/nyc2.jpg', type: 'image' },
      ],
      likes: 200,
      comments: [
        { text: 'NYC is always a great time!' },
        { text: 'The Plaza is such a beautiful hotel!' },
      ],
    },
    {
      id: '5',
      title: 'Beach Escape in the Maldives',
      profile: {
        name: 'Emma Brown',
        avatarUrl: '/images/avatar5.jpg',
      },
      flights: ['QR302'],
      accommodations: 'Overwater Villa',
      restaurants: ['Ithaa Undersea Restaurant', 'M6M', 'Sea.Fire.Salt.Sky'],
      activities: ['Snorkeling', 'Scuba Diving', 'Sunset Cruise'],
      media: [
        { url: '/images/maldives1.jpg', type: 'image' },
        { url: '/images/maldives2.jpg', type: 'image' },
      ],
      likes: 180,
      comments: [
        { text: 'The Maldives are so beautiful!' },
        { text: 'Undersea restaurant?! That’s amazing.' },
      ],
    },
    {
      id: '6',
      title: 'Exploring Iceland',
      profile: {
        name: 'Olaf Sigurdsson',
        avatarUrl: '/images/avatar6.jpg',
      },
      flights: ['FI101'],
      accommodations: 'Fosshotel Reykjavik',
      restaurants: ['Dill Restaurant', 'Grillmarkadurinn', 'Snaps Bistro'],
      activities: ['Blue Lagoon', 'Golden Circle Tour', 'Northern Lights'],
      media: [
        { url: '/images/iceland1.jpg', type: 'image' },
        { url: '/videos/iceland.mp4', type: 'video' },
      ],
      likes: 250,
      comments: [
        { text: 'Iceland is on my bucket list!' },
        { text: 'Did you see the Northern Lights?' },
        { text: 'Looks like an incredible adventure!' },
      ],
    },
    {
      id: '7',
      title: 'Adventure in Thailand',
      profile: {
        name: 'Lucas Lee',
        avatarUrl: '/images/avatar7.jpg',
      },
      flights: ['TG303'],
      accommodations: 'Bangkok Riverside Hotel',
      restaurants: ['Gaggan', 'Sorn', 'Pad Thai Fai Ta Lu'],
      activities: ['Grand Palace', 'Floating Market', 'Phi Phi Islands Tour'],
      media: [
        { url: '/images/thailand1.jpg', type: 'image' },
        { url: '/videos/thailand.mp4', type: 'video' },
      ],
      likes: 175,
      comments: [
        { text: 'The islands are so beautiful!' },
        { text: 'Did you try Pad Thai at the market?' },
      ],
    },
  ];
  
  
// GET request handler to fetch all itineraries
export async function GET() {
  return NextResponse.json({ itineraries });
}

// POST request handler to add a new itinerary
export async function POST(request: Request) {
  const newItinerary = await request.json();
  newItinerary.id = String(itineraries.length + 1); // Add a new ID
  itineraries.push(newItinerary);
  return NextResponse.json({ message: 'Itinerary added', itinerary: newItinerary });
}
