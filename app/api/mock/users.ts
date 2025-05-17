// app/api/mock/users.ts
export interface User {
  _id: string;
  name: string;
  avatar?: string;
  role?: 'admin' | 'host' | 'guest';
}

const currentUser: User = {
  _id: "fakeUserId",
  name: "Test User (You)",
  avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  role: 'admin'
};

const mockUsers: User[] = [
  currentUser,
  { _id: "user1", name: "Alice Wonderland", avatar: "https://randomuser.me/api/portraits/women/76.jpg", role: 'host' },
  { _id: "user2", name: "Bob The Builder", avatar: "https://randomuser.me/api/portraits/men/77.jpg", role: 'guest' },
  { _id: "user3", name: "Charlie Brown", avatar: "https://randomuser.me/api/portraits/men/78.jpg", role: 'guest' },
];

export function getCurrentUser(): User {
  return currentUser;
}

export function getAllUsers(): User[] {
  return mockUsers;
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user._id === id);
}

// Simulate API call with async behavior
export async function fetchCurrentUser(): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(currentUser);
    }, 200);
  });
}

export async function fetchAllUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 200);
  });
} 