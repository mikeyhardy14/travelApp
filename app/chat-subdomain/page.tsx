"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaPaperPlane, FaSmile, FaPaperclip, FaUsers, FaUser, FaImage, FaLink, 
  FaMicrophone, FaInfoCircle, FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaPlane } from 'react-icons/fa';

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

const ChatPage: React.FC = () => {
  // State variables
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const router = useRouter();

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  // State for group info sidebar
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState<'members' | 'media' | 'links' | 'itinerary'>('members');
  
  // Function to toggle group info sidebar
  const toggleGroupInfo = () => {
    setShowGroupInfo(!showGroupInfo);
  };
  
  // Function to change active tab in group info
  const changeInfoTab = (tab: 'members' | 'media' | 'links' | 'itinerary') => {
    setActiveInfoTab(tab);
  };

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
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
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

  const goToDashboard = () => {
    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev ? 'localhost:3000' : window.location.host.split('.').slice(-2).join('.');
    window.location.href = `//dashboard.${baseUrl}`;
  };

  return (
    <div className="flex h-screen overflow-hidden pt-16 md:pt-20 bg-gray-100">
      <div className="flex-shrink-0 w-72 md:w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Travel Chat</h2>
          <button
            onClick={goToDashboard}
            className="text-sm bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded-full"
          >
            Dashboard
          </button>
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
                  {/* Chat avatar */}
                </div>
                {/* Chat name and message preview */}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Chat messages area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="text-lg font-semibold">{selectedChat.name}</div>
              </div>
              <div>
                <button
                  onClick={toggleGroupInfo}
                  className="text-gray-600 hover:text-gray-800"
                  title="Chat Info"
                >
                  <FaInfoCircle size={20} />
                </button>
              </div>
            </div>
            
            {/* Messages container */}
            <div 
              ref={messagesEndRef}
              className="flex-grow overflow-y-auto p-4" 
            >
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-bounce text-orange-500">Loading messages...</div>
                </div>
              ) : currentChatMessages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Message bubbles would go here */}
                </div>
              )}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="text-gray-500 hover:text-gray-700" title="Add emoji">
                  <FaSmile size={20} />
                </button>
                <button className="text-gray-500 hover:text-gray-700" title="Attach file">
                  <FaPaperclip size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()} 
                  className={`rounded-full p-2 ${
                    newMessage.trim() ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <FaPaperPlane size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            {loadingChats ? "Loading chats..." : "Select a chat to start messaging"}
          </div>
        )}
      </div>
      
      {/* Group info sidebar - conditionally rendered */}
      {selectedChat && showGroupInfo && (
        <div className="w-72 md:w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Group info header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="font-semibold">Chat Info</div>
            <button 
              onClick={toggleGroupInfo}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={16} />
            </button>
          </div>
          
          {/* Group info tabs */}
          <div className="flex border-b border-gray-200">
            {/* Tab buttons */}
          </div>
          
          {/* Tab content */}
          <div className="flex-grow overflow-y-auto p-4">
            {/* Dynamic content based on active tab */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage; 