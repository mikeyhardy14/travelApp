import { User } from './users';
import { TravelPlan } from './travelPlans';

export interface Message {
  _id: string;
  chatId: string;
  fromUserId: string;
  fromUserName: string;
  message: string;
  timestamp: Date;
  attachment?: {
    type: 'image' | 'file' | 'link' | 'voice';
    url: string;
    fileName?: string;
    thumbnailUrl?: string;
    duration?: number; // For voice messages
  };
}

export interface ChatListItem {
  _id: string;
  type: 'dm' | 'group';
  name: string;
  avatar?: string;
  participants?: User[];
  lastMessage?: string;
  timestamp?: Date;
  travelPlans?: TravelPlan[]; // Added for trip itineraries
}

// Import necessary data - in a real implementation, these would be fetched from a database
import { getAllUsers, getCurrentUser } from './users';
import { getAllTravelPlans } from './travelPlans';

const users = getAllUsers();
const currentUser = getCurrentUser();
const travelPlans = getAllTravelPlans();

// Mock chat data with participants
const mockChatListItems: ChatListItem[] = [
  {
    _id: "group1",
    type: 'group',
    name: "Paris Trip Planning",
    avatar: "https://img.icons8.com/color/96/000000/paris.png",
    participants: [
      currentUser,
      users.find(u => u._id === "user1")!,
      users.find(u => u._id === "user2")!,
    ],
    lastMessage: "Alice: Sounds good!",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    travelPlans: travelPlans
  },
  {
    _id: "user3",
    type: 'dm',
    name: users.find(u => u._id === "user3")!.name,
    avatar: users.find(u => u._id === "user3")!.avatar,
    participants: [currentUser, users.find(u => u._id === "user3")!],
    lastMessage: "See you then!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    _id: "user1",
    type: 'dm',
    name: users.find(u => u._id === "user1")!.name,
    avatar: users.find(u => u._id === "user1")!.avatar,
    participants: [currentUser, users.find(u => u._id === "user1")!],
    lastMessage: "Okay, let me check.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
];

// Mock messages data
const mockMessages: Message[] = [
  {
    _id: "msg1", 
    chatId: "group1", 
    fromUserId: "user1", 
    fromUserName: users.find(u => u._id === "user1")!.name, 
    message: "Hey everyone! Excited for Paris!", 
    timestamp: new Date(Date.now() - 1000 * 60 * 60)
  },
  {
    _id: "msg2", 
    chatId: "group1", 
    fromUserId: "user2", 
    fromUserName: users.find(u => u._id === "user2")!.name, 
    message: "Me too! When are we thinking of going?", 
    timestamp: new Date(Date.now() - 1000 * 60 * 58)
  },
  {
    _id: "msg3", 
    chatId: "group1", 
    fromUserId: currentUser._id, 
    fromUserName: currentUser.name, 
    message: "How about next month?", 
    timestamp: new Date(Date.now() - 1000 * 60 * 56)
  },
  {
    _id: "msg4", 
    chatId: "group1", 
    fromUserId: "user1", 
    fromUserName: users.find(u => u._id === "user1")!.name, 
    message: "Sounds good!", 
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    attachment: { 
      type: 'image', 
      url: 'https://source.unsplash.com/random/400x300?paris'
    }
  },
  {
    _id: "msg5", 
    chatId: "group1", 
    fromUserId: "user2", 
    fromUserName: users.find(u => u._id === "user2")!.name, 
    message: "Check out this hotel I found!", 
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    attachment: { 
      type: 'link', 
      url: 'https://example.com/paris-hotel',
      fileName: 'Grand Hotel Paris' 
    }
  },
  {
    _id: "msg6", 
    chatId: "group1", 
    fromUserId: currentUser._id, 
    fromUserName: currentUser.name, 
    message: "Here's my flight info", 
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    attachment: { 
      type: 'file', 
      url: '#',
      fileName: 'flight_confirmation.pdf' 
    }
  },
  {
    _id: "msg7", 
    chatId: "group1", 
    fromUserId: "user1", 
    fromUserName: users.find(u => u._id === "user1")!.name, 
    message: "Quick audio note about our meetup point", 
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    attachment: { 
      type: 'voice', 
      url: '#',
      duration: 12 
    }
  },
  // DM messages
  { 
    _id: "msg8", 
    chatId: "user3", 
    fromUserId: "user3", 
    fromUserName: users.find(u => u._id === "user3")!.name, 
    message: "Hey! Are you free for a call?", 
    timestamp: new Date(Date.now() - 1000 * 60 * 35) 
  },
  { 
    _id: "msg9", 
    chatId: "user3", 
    fromUserId: currentUser._id, 
    fromUserName: currentUser.name, 
    message: "Sure, how about in 5?", 
    timestamp: new Date(Date.now() - 1000 * 60 * 32) 
  },
  { 
    _id: "msg10", 
    chatId: "user3", 
    fromUserId: "user3", 
    fromUserName: users.find(u => u._id === "user3")!.name, 
    message: "See you then!", 
    timestamp: new Date(Date.now() - 1000 * 60 * 30) 
  },
];

// API functions
export function getAllChats(): ChatListItem[] {
  return mockChatListItems;
}

export function getChatById(chatId: string): ChatListItem | undefined {
  return mockChatListItems.find(chat => chat._id === chatId);
}

export function getMessagesByChatId(chatId: string): Message[] {
  return mockMessages
    .filter(message => message.chatId === chatId)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

export function addMessage(message: Omit<Message, '_id'>): Message {
  const newMessage: Message = {
    ...message,
    _id: `msg${Date.now()}`,
  };
  mockMessages.push(newMessage);
  
  // Update the last message in chat
  const chatIndex = mockChatListItems.findIndex(chat => chat._id === message.chatId);
  if (chatIndex !== -1) {
    mockChatListItems[chatIndex].lastMessage = 
      `${message.fromUserId === currentUser._id ? 'You' : message.fromUserName.split(' ')[0]}: ${message.message}`.substring(0, 30);
    mockChatListItems[chatIndex].timestamp = message.timestamp;
  }
  
  return newMessage;
}

// Simulate API calls
export async function fetchAllChats(): Promise<ChatListItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockChatListItems);
    }, 250);
  });
}

export async function fetchChatById(chatId: string): Promise<ChatListItem | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getChatById(chatId));
    }, 200);
  });
}

export async function fetchMessagesByChatId(chatId: string): Promise<Message[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMessagesByChatId(chatId));
    }, 350);
  });
}

export async function sendMessage(message: Omit<Message, '_id'>): Promise<Message> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage = addMessage(message);
      resolve(newMessage);
    }, 300);
  });
} 