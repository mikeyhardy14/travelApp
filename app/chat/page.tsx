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

const MessengerPage: React.FC = () => {
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

  return (
    <div className="flex h-screen overflow-hidden pt-16 md:pt-20 bg-gray-100">
      <div className="flex-shrink-0 w-72 md:w-80 bg-white border-r border-gray-200 flex flex-col">
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

      <div className="flex-grow flex flex-col bg-gray-50">
        {selectedChat && currentUser ? (
          <>
            <div className="border-b border-gray-200 p-4 bg-white flex items-center space-x-3">
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

            <div ref={messagesEndRef} className="flex-grow overflow-y-auto p-4 space-y-4">
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
                currentChatMessages.map((msg) => (
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
                            <p className="text-xs font-semibold mb-1" style={{color: msg.fromUserId === chatList[1]._id ? '#3B82F6' : '#10B981'}}>
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
                ))
              )}
            </div>

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
  );
};

export default MessengerPage;
