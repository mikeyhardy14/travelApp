"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaPaperPlane, FaSmile, FaPaperclip, FaUsers, FaUser, FaImage, FaLink, 
  FaMicrophone, FaInfoCircle, FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaPlane, 
  FaSuitcase, FaCar, FaHotel, FaUtensils, FaCheck, FaEdit, FaTrash, FaPlus, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';

// Import types and API functions
import { User, fetchCurrentUser } from '../api/mock/users';
import { TravelPlan } from '../api/mock/travelPlans';
import { 
  Message, 
  ChatListItem, 
  fetchAllChats, 
  fetchMessagesByChatId, 
  sendMessage 
} from '../api/mock/chats';

// Mock data for trip itineraries
const mockTripItineraries = {
  "trip-123": {
    name: "Europe Summer Trip",
    destination: "Multiple Cities, Europe",
    dates: { start: "2023-06-15", end: "2023-07-05" },
    participants: [
      { id: "user1", name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { id: "user2", name: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { id: "user3", name: "Mike Johnson", avatar: "https://randomuser.me/api/portraits/men/45.jpg" }
    ],
    days: [
      {
        date: "2023-06-15",
        location: "Paris, France",
        activities: [
          { time: "09:00", description: "Arrival at Charles de Gaulle Airport", type: "transportation", assigned: ["user1", "user2", "user3"], completed: true },
          { time: "12:00", description: "Check-in at Hotel de Ville", type: "accommodation", assigned: ["user1"], completed: true },
          { time: "14:00", description: "Lunch at Le Petit Café", type: "food", assigned: ["user1", "user2", "user3"], completed: true },
          { time: "16:00", description: "Visit Eiffel Tower", type: "activity", assigned: ["user1", "user2", "user3"], completed: false }
        ]
      },
      {
        date: "2023-06-16",
        location: "Paris, France",
        activities: [
          { time: "08:30", description: "Breakfast at hotel", type: "food", assigned: ["user1", "user2", "user3"], completed: false },
          { time: "10:00", description: "Louvre Museum tour", type: "activity", assigned: ["user1", "user2"], completed: false },
          { time: "13:00", description: "Lunch at Montmartre", type: "food", assigned: ["user1", "user2", "user3"], completed: false },
          { time: "15:00", description: "Shopping at Champs-Élysées", type: "activity", assigned: ["user2", "user3"], completed: false },
          { time: "19:00", description: "Dinner cruise on Seine River", type: "food", assigned: ["user1", "user2", "user3"], completed: false }
        ]
      },
      {
        date: "2023-06-17",
        location: "Paris to Amsterdam",
        activities: [
          { time: "07:00", description: "Check-out from hotel", type: "accommodation", assigned: ["user1"], completed: false },
          { time: "08:30", description: "Train to Amsterdam", type: "transportation", assigned: ["user1", "user2", "user3"], completed: false },
          { time: "12:30", description: "Arrival in Amsterdam", type: "transportation", assigned: ["user1", "user2", "user3"], completed: false }
        ]
      }
    ]
  }
};

// Type definitions for trip itinerary
interface Activity {
  time: string;
  description: string;
  type: 'transportation' | 'accommodation' | 'food' | 'activity';
  assigned: string[];
  completed: boolean;
}

interface ItineraryDay {
  date: string;
  location: string;
  activities: Activity[];
}

interface TripItinerary {
  name: string;
  destination: string;
  dates: { start: string; end: string };
  participants: { id: string; name: string; avatar: string }[];
  days: ItineraryDay[];
}

const MessengerPage: React.FC = () => {
  // State variables
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  // State for group info sidebar
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState<'members' | 'media' | 'links' | 'itinerary'>('members');
  
  // State for trip details sidebar
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [currentTripItinerary, setCurrentTripItinerary] = useState<TripItinerary | null>(null);
  const [expandedDays, setExpandedDays] = useState<{[key: string]: boolean}>({});
  const [editModeActivity, setEditModeActivity] = useState<{dayIndex: number; activityIndex: number} | null>(null);
  const [newActivityValues, setNewActivityValues] = useState<Partial<Activity>>({});
  
  // Function to toggle trip details sidebar
  const toggleTripDetails = (tripId?: string) => {
    if (tripId) {
      setSelectedTripId(tripId);
      // Cast to TripItinerary to ensure type safety
      setCurrentTripItinerary(mockTripItineraries[tripId as keyof typeof mockTripItineraries] as unknown as TripItinerary);
      setShowTripDetails(true);
      
      // Initialize expanded state for all days
      const initialExpandedState: {[key: string]: boolean} = {};
      mockTripItineraries[tripId as keyof typeof mockTripItineraries].days.forEach((_, index) => {
        initialExpandedState[index.toString()] = index === 0; // Only expand first day by default
      });
      setExpandedDays(initialExpandedState);
    } else {
      setShowTripDetails(!showTripDetails);
    }
  };
  
  // Function to toggle expanded state of a day
  const toggleDayExpanded = (dayIndex: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex.toString()]: !prev[dayIndex.toString()]
    }));
  };
  
  // Function to toggle activity completion
  const toggleActivityCompletion = (dayIndex: number, activityIndex: number) => {
    if (!currentTripItinerary) return;
    
    const updatedItinerary = {...currentTripItinerary};
    updatedItinerary.days[dayIndex].activities[activityIndex].completed = 
      !updatedItinerary.days[dayIndex].activities[activityIndex].completed;
    
    setCurrentTripItinerary(updatedItinerary);
    // In a real app, you would save this change to your backend here
  };
  
  // Function to handle editing an activity
  const startEditActivity = (dayIndex: number, activityIndex: number) => {
    if (!currentTripItinerary) return;
    
    setEditModeActivity({ dayIndex, activityIndex });
    setNewActivityValues(currentTripItinerary.days[dayIndex].activities[activityIndex]);
  };
  
  // Function to save activity edits
  const saveActivityEdit = () => {
    if (!currentTripItinerary || !editModeActivity) return;
    
    const updatedItinerary = {...currentTripItinerary};
    updatedItinerary.days[editModeActivity.dayIndex].activities[editModeActivity.activityIndex] = {
      ...updatedItinerary.days[editModeActivity.dayIndex].activities[editModeActivity.activityIndex],
      ...newActivityValues
    } as Activity;
    
    setCurrentTripItinerary(updatedItinerary);
    setEditModeActivity(null);
    setNewActivityValues({});
    // In a real app, you would save this change to your backend here
  };
  
  // Function to cancel activity edit
  const cancelActivityEdit = () => {
    setEditModeActivity(null);
    setNewActivityValues({});
  };
  
  // Function to toggle group info sidebar
  const toggleGroupInfo = () => {
    setShowGroupInfo(!showGroupInfo);
  };
  
  // Function to change active tab in group info
  const changeInfoTab = (tab: 'members' | 'media' | 'links' | 'itinerary') => {
    setActiveInfoTab(tab);
  };

  // Check for sidebar state from AppHeader component
  useEffect(() => {
    const handleStorageChange = () => {
      const sidebarState = localStorage.getItem('appSidebarOpen');
      setIsSidebarOpen(sidebarState === 'true');
    };
    
    // Initial check
    handleStorageChange();
    
    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fetch current user and all chats when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingChats(true);
        // Fetch current user
        const user = await fetchCurrentUser();
        setCurrentUser(user);
        
        // Fetch all chats
        const chats = await fetchAllChats();
        setChatList(chats.sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)));
        
        // Select first chat by default
        if (chats.length > 0) {
          const defaultSelectedChat = chats.sort((a, b) => 
            (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))[0];
          setSelectedChat(defaultSelectedChat);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoadingChats(false);
      }
    };
    
    fetchData();
  }, [router]);

  // Fetch messages when selected chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) {
        setCurrentChatMessages([]);
        return;
      }
      
      try {
        setLoadingMessages(true);
        const messages = await fetchMessagesByChatId(selectedChat._id);
        setCurrentChatMessages(messages);
      } catch (error) {
        console.error(`Error fetching messages for chat ${selectedChat._id}:`, error);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchMessages();
  }, [selectedChat]);

  // Handle auto-scrolling when messages change
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!loadingMessages) {
      scrollToBottom();
    }
  }, [currentChatMessages, loadingMessages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !selectedChat) return;

    const messageToSend: Omit<Message, '_id'> = {
      chatId: selectedChat._id,
      fromUserId: currentUser._id,
      fromUserName: currentUser.name,
      message: newMessage,
      timestamp: new Date(),
    };

    // Optimistically update the UI
    const optimisticMessage: Message = {
      ...messageToSend,
      _id: `temp-${Date.now()}`,
    };
    
    setCurrentChatMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');

    try {
      // Send the message to the "API"
      await sendMessage(messageToSend);
      
      // Update chat list to reflect new message
      setChatList(prevChats => {
        const updatedChats = [...prevChats];
        const chatIndex = updatedChats.findIndex(chat => chat._id === selectedChat._id);
        
        if (chatIndex !== -1) {
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            lastMessage: `You: ${newMessage}`.substring(0, 30),
            timestamp: new Date()
          };
          
          // Sort chats by most recent message
          return updatedChats.sort((a, b) => 
            (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
          );
        }
        
        return prevChats;
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove optimistic message on error
      setCurrentChatMessages(prevMessages => 
        prevMessages.filter(msg => msg._id !== optimisticMessage._id)
      );
    }
  };

  // Function to select a chat
  const handleSelectChat = (chat: ChatListItem) => {
    setSelectedChat(chat);
    // Close group info panel if open when changing chats
    if (showGroupInfo) {
      setShowGroupInfo(false);
    }
  };

  // Helper function to get partner user from a DM chat
  const getChatPartner = (chat: ChatListItem): User | undefined => {
    if (chat.type === 'dm' && chat.participants && chat.participants.length > 0) {
      return chat.participants.find(p => p._id !== currentUser?._id);
    }
    return undefined;
  }

  // Helper function to get activity icon based on type
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'transportation':
        return <FaCar className="w-4 h-4" />;
      case 'accommodation':
        return <FaHotel className="w-4 h-4" />;
      case 'food':
        return <FaUtensils className="w-4 h-4" />;
      case 'activity':
        return <FaSuitcase className="w-4 h-4" />;
      default:
        return <FaMapMarkerAlt className="w-4 h-4" />;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Check if activity is assigned to current user
  const isActivityAssignedToMe = (activity: Activity) => {
    if (!currentUser) return false;
    return activity.assigned.includes(currentUser._id);
  };

  return (
    <div className={`flex justify-center h-[calc(100vh-57px)] bg-gray-100 transition-all duration-300 ${
      isSidebarOpen ? 'ml-64' : 'ml-0'
    }`}>
      {/* Chat container with trip details sidebar */}
      <div className="flex h-full w-full max-w-6xl justify-center">
        {/* Left side with chat list and messages */}
        <div className="flex h-full flex-grow" style={{ maxWidth: showTripDetails ? 'calc(100% - 320px)' : '100%' }}>
          {/* Chat List Sidebar */}
          <div className="flex-shrink-0 w-72 md:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700">Chats</h2>
            </div>
            <div className="overflow-y-auto flex-grow">
                <ul className="space-y-1 p-2">
                {chatList.map((chat) => (
                    <li
                    key={chat._id}
                    onClick={() => handleSelectChat(chat)}
                    className={`p-3 hover:bg-orange-100 rounded-lg cursor-pointer transition-colors duration-150 ease-in-out flex items-center space-x-3 ${
                        selectedChat?._id === chat._id ? 'bg-orange-500 text-white hover:bg-orange-600' : 'text-gray-700 hover:text-gray-900'
                    }`}
                    >
                    <div className="relative">
                        <img 
                            src={chat.avatar || (chat.type === 'dm' ? getChatPartner(chat)?.avatar : 'https://img.icons8.com/fluency/48/000000/user-group-man-woman.png')}
                            alt={chat.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <div className="flex justify-between items-center">
                            <span className="font-medium truncate">{chat.name}</span>
                            {chat.timestamp && (
                                <span className={`text-xs flex-shrink-0 ${selectedChat?._id === chat._id ? 'text-orange-200' : 'text-gray-400'}`}>
                                    {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </span>
                            )}
                        </div>
                        <p className={`text-sm truncate ${selectedChat?._id === chat._id ? 'text-orange-100' : 'text-gray-500'}`}>
                            {chat.lastMessage}
                        </p>
                    </div>
                    </li>
                ))}
                {chatList.length === 0 && (
                    <p className="text-gray-500 text-sm p-4 text-center">No chats found.</p>
                )}
                </ul>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-grow flex flex-col bg-gray-50 h-full">
            {selectedChat && currentUser ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-gray-200 p-4 bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                        src={selectedChat.avatar || (selectedChat.type === 'dm' ? getChatPartner(selectedChat)?.avatar : 'https://img.icons8.com/fluency/48/000000/user-group-man-woman.png')}
                        alt={selectedChat.name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{selectedChat.name}</h2>
                        {selectedChat.type === 'group' && selectedChat.participants && (
                            <p className="text-xs text-gray-500">
                                {selectedChat.participants.map(p => p.name.split(' ')[0]).join(', ')} ({selectedChat.participants.length} members)
                            </p>
                        )}
                        {selectedChat.type === 'dm' && (
                             <p className="text-xs text-gray-500">Direct Message</p>
                        )}
                    </div>
                  </div>
                  
                  {/* View Trip Details Button (for group chats) */}
                  {selectedChat.type === 'group' && (
                    <button 
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={() => toggleTripDetails('trip-123')}
                    >
                      <FaSuitcase className="mr-1" />
                      <span>{showTripDetails ? 'Hide Trip Details' : 'Show Trip Details'}</span>
                    </button>
                  )}
                </div>

                {/* Messages Area with Proper Scrolling */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-gray-500">Loading messages...</p>
                    </div>
                  ) : currentChatMessages.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-full text-gray-400">
                      <FaUsers className="w-16 h-16 mb-4" />
                      <p className="text-lg">No messages yet.</p>
                      <p className="text-sm">Be the first to say something!</p>
                    </div>
                  ) : (
                    <>
                      {currentChatMessages.map((msg) => (
                        <div key={msg._id} className={`flex ${msg.fromUserId === currentUser._id ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg ${msg.fromUserId === currentUser._id ? 'flex-row-reverse' : ''}`}>
                              {msg.fromUserId !== currentUser._id && (
                                  <img 
                                      src={chatList.find(u => u._id === msg.fromUserId)?.avatar || 'https://img.icons8.com/fluency/48/000000/user-male-circle.png'}
                                      alt={msg.fromUserName}
                                      className="w-6 h-6 rounded-full mr-2 ml-2 object-cover self-start"
                                  />
                              )}
                              <div
                              className={`p-3 rounded-xl shadow-sm ${
                                  msg.fromUserId === currentUser._id
                                  ? 'bg-orange-500 text-white rounded-br-none'
                                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                              }`}
                              >
                              {selectedChat.type === 'group' && msg.fromUserId !== currentUser._id && (
                                  <p className="text-xs font-semibold mb-1" style={{color: msg.fromUserId === chatList[1]?._id ? '#3B82F6' : '#10B981'}}>
                                      {msg.fromUserName.split(' ')[0]}
                                  </p>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              {msg.attachment && msg.attachment.type === 'image' && (
                                  <img src={msg.attachment.url} alt="attachment" className="mt-2 rounded-lg max-w-full h-auto max-h-60" />
                              )}
                              {msg.attachment && msg.attachment.type === 'file' && (
                                  <div className="mt-2 p-2 bg-gray-100 rounded-lg flex items-center space-x-2 border border-gray-300">
                                      <FaPaperclip className="text-gray-500" />
                                      <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                          {msg.attachment.fileName || 'Attached File'}
                                      </a>
                                  </div>
                              )}
                              <p className={`text-xs mt-1 ${msg.fromUserId === currentUser._id ? 'text-orange-100' : 'text-gray-400'} text-right`}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                              </p>
                              </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input Area */}
                <div className="border-t border-gray-200 p-3 sm:p-4 bg-white">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <button className="p-2 text-gray-500 hover:text-orange-500 transition-colors">
                      <FaSmile className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-orange-500 transition-colors">
                      <FaPaperclip className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <input
                      type="text"
                      className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-shadow duration-150 text-sm sm:text-base"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey && newMessage.trim()) { handleSendMessage(); e.preventDefault(); } }}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-150 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!newMessage.trim()}
                    >
                      <FaPaperPlane className="w-5 h-5" />
                      <span className="ml-2 hidden sm:inline text-sm sm:text-base font-medium">Send</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FaUsers className="w-24 h-24 mb-4 text-gray-300" />
                <p className="text-xl">Select a chat to start messaging</p>
                <p className="text-sm mt-1">Your conversations will appear here.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Trip Details Sidebar - always present in layout but conditionally displays content */}
        <div className={`h-full bg-white overflow-hidden flex flex-col border-l border-gray-200 transition-all duration-300 ${
          showTripDetails ? 'w-80 opacity-100' : 'w-0 opacity-0 border-l-0'
        }`}>
          {currentTripItinerary && (
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-blue-50">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FaPlane className="mr-2 text-blue-500" />
                    {currentTripItinerary.name}
                  </h2>
                  <p className="text-sm text-gray-600">{currentTripItinerary.destination}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/trips/${selectedTripId}`}
                    className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition flex items-center"
                  >
                    <FaMapMarkerAlt className="mr-1" />
                    See Travel Story
                  </Link>
                  <button 
                    onClick={() => setShowTripDetails(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Start Date</span>
                    <span className="text-sm font-medium">{formatDate(currentTripItinerary.dates.start)}</span>
                  </div>
                  <FaChevronRight className="text-gray-400 mx-2" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">End Date</span>
                    <span className="text-sm font-medium">{formatDate(currentTripItinerary.dates.end)}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Trip Participants</h3>
                <div className="flex flex-wrap gap-2">
                  {currentTripItinerary.participants.map(participant => (
                    <div key={participant.id} className="flex items-center space-x-1">
                      <img 
                        src={participant.avatar} 
                        alt={participant.name} 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-grow overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex justify-between items-center">
                    <span>Itinerary</span>
                    <button className="text-xs text-blue-600 flex items-center">
                      <FaEdit className="mr-1" />
                      Edit
                    </button>
                  </h3>
                  
                  {currentTripItinerary.days.map((day, dayIndex) => (
                    <div key={dayIndex} className="mb-3 border border-gray-200 rounded-md overflow-hidden">
                      <div 
                        className="bg-gray-50 p-3 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleDayExpanded(dayIndex)}
                      >
                        <div>
                          <h4 className="font-medium text-sm">{formatDate(day.date)}</h4>
                          <p className="text-xs text-gray-600">{day.location}</p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">
                            {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}
                          </span>
                          {expandedDays[dayIndex.toString()] ? (
                            <FaChevronDown className="text-gray-500" />
                          ) : (
                            <FaChevronRight className="text-gray-500" />
                          )}
                        </div>
                      </div>
                      
                      {expandedDays[dayIndex.toString()] && (
                        <div className="p-2">
                          {day.activities.map((activity, activityIndex) => (
                            <div 
                              key={`${dayIndex}-${activityIndex}`} 
                              className={`p-2 text-sm border-l-2 mb-2 rounded-r-md relative ${
                                activity.completed 
                                  ? 'border-green-400 bg-green-50' 
                                  : isActivityAssignedToMe(activity) 
                                    ? 'border-blue-400 bg-blue-50' 
                                    : 'border-gray-300 bg-gray-50'
                              }`}
                            >
                              {editModeActivity?.dayIndex === dayIndex && editModeActivity?.activityIndex === activityIndex ? (
                                // Edit mode
                                <div className="space-y-2">
                                  <div className="flex">
                                    <input 
                                      type="text" 
                                      value={newActivityValues.time || ''} 
                                      onChange={(e) => setNewActivityValues({...newActivityValues, time: e.target.value})}
                                      className="w-20 p-1 mr-2 text-xs border rounded"
                                      placeholder="Time"
                                    />
                                    <input 
                                      type="text" 
                                      value={newActivityValues.description || ''} 
                                      onChange={(e) => setNewActivityValues({...newActivityValues, description: e.target.value})}
                                      className="flex-grow p-1 text-xs border rounded"
                                      placeholder="Description"
                                    />
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <button 
                                      onClick={cancelActivityEdit} 
                                      className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                                    >
                                      Cancel
                                    </button>
                                    <button 
                                      onClick={saveActivityEdit} 
                                      className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // View mode
                                <>
                                  <div className="flex justify-between">
                                    <div className="flex items-start">
                                      <span className="font-medium mr-2">{activity.time}</span>
                                      <span>{activity.description}</span>
                                    </div>
                                    <div className="flex space-x-1">
                                      <button 
                                        onClick={() => toggleActivityCompletion(dayIndex, activityIndex)}
                                        className={`p-1 rounded-full ${
                                          activity.completed ? 'text-green-600 bg-green-100' : 'text-gray-400 bg-gray-100'
                                        }`}
                                      >
                                        <FaCheck className="w-3 h-3" />
                                      </button>
                                      <button 
                                        onClick={() => startEditActivity(dayIndex, activityIndex)}
                                        className="p-1 rounded-full text-gray-400 bg-gray-100 hover:text-blue-500"
                                      >
                                        <FaEdit className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="flex justify-between mt-1">
                                    <div className="flex items-center">
                                      <span className="text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded flex items-center">
                                        {getActivityIcon(activity.type)}
                                        <span className="ml-1 capitalize">{activity.type}</span>
                                      </span>
                                    </div>
                                    <div className="flex -space-x-2">
                                      {activity.assigned.map((userId, i) => {
                                        const participant = currentTripItinerary.participants.find(p => p.id === userId);
                                        return participant ? (
                                          <img 
                                            key={userId} 
                                            src={participant.avatar} 
                                            alt={participant.name} 
                                            className="w-5 h-5 rounded-full border border-white object-cover"
                                            title={participant.name}
                                          />
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                          <button className="w-full py-1 mt-1 text-xs text-blue-600 flex items-center justify-center hover:bg-blue-50 rounded">
                            <FaPlus className="mr-1" /> Add Activity
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessengerPage;
