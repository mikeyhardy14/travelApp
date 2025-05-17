// app/api/mock/travelPlans.ts
export interface TravelPlan {
  userId: string;
  departure: {
    location: string;
    date: Date;
    time?: string;
    transport?: string;
  };
  arrival: {
    location: string;
    date: Date;
    time?: string;
  };
  activities?: {
    date: Date;
    name: string;
    location?: string;
    time?: string;
    participants?: string[];
  }[];
}

const mockTravelPlans: TravelPlan[] = [
  {
    userId: "fakeUserId", // currentUser
    departure: {
      location: "New York",
      date: new Date(2023, 6, 15),
      time: "08:30 AM",
      transport: "Flight AF23"
    },
    arrival: {
      location: "Paris",
      date: new Date(2023, 6, 15),
      time: "10:45 PM"
    },
    activities: [
      {
        date: new Date(2023, 6, 16),
        name: "Eiffel Tower Visit",
        location: "Eiffel Tower",
        time: "10:00 AM",
        participants: ["fakeUserId", "user1", "user2"]
      },
      {
        date: new Date(2023, 6, 17),
        name: "Louvre Museum",
        location: "Louvre",
        time: "09:30 AM",
        participants: ["fakeUserId", "user1"]
      }
    ]
  },
  {
    userId: "user1", // Alice
    departure: {
      location: "Boston",
      date: new Date(2023, 6, 14),
      time: "02:15 PM",
      transport: "Flight DL456"
    },
    arrival: {
      location: "Paris",
      date: new Date(2023, 6, 15),
      time: "06:30 AM"
    },
    activities: [
      {
        date: new Date(2023, 6, 15),
        name: "Notre-Dame Cathedral",
        location: "Notre-Dame",
        time: "02:00 PM",
        participants: ["user1"]
      }
    ]
  },
  {
    userId: "user2", // Bob
    departure: {
      location: "Chicago",
      date: new Date(2023, 6, 15),
      time: "10:00 AM",
      transport: "Flight UA789"
    },
    arrival: {
      location: "Paris",
      date: new Date(2023, 6, 16),
      time: "08:15 AM"
    }
  }
];

export function getTravelPlansByUserId(userId: string): TravelPlan | undefined {
  return mockTravelPlans.find(plan => plan.userId === userId);
}

export function getAllTravelPlans(): TravelPlan[] {
  return mockTravelPlans;
}

// Simulate API call with async behavior
export async function fetchTravelPlansByUserId(userId: string): Promise<TravelPlan | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getTravelPlansByUserId(userId));
    }, 300);
  });
}

export async function fetchAllTravelPlans(): Promise<TravelPlan[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTravelPlans);
    }, 300);
  });
} 