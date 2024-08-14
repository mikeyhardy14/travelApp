"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Message } from '../account/types';

const MessengerPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/account/login');
        return;
      }

      try {
        const res = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          router.push('/account/login');
        }
      } catch (error) {
        router.push('/account/login');
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
    fetchUsers();
  }, [router]);

  useEffect(() => {
    if (selectedUser && user) {
      const fetchMessages = async () => {
        try {
          const res = await fetch(`/api/messages/${user._id}?otherUserId=${selectedUser._id}`);
          const data = await res.json();
          if (res.ok) {
            setMessages(data);
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchMessages();
    }
  }, [selectedUser, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedUser) return;

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: user._id,
          toUserId: selectedUser._id,
          message: newMessage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages([...messages, { fromUserId: user._id, toUserId: selectedUser._id, message: newMessage, timestamp: new Date() }]);
        setNewMessage('');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartConversation = (u: User) => {
    setSelectedUser(u);
    setMessages([]); // Clear messages to load the new conversation
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <ul>
          {users.map((u) => (
            <li key={u._id} className="mb-2 flex justify-between items-center">
              <span>{u.name}</span>
              <button
                onClick={() => handleStartConversation(u)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Start Conversation
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 bg-white p-4 ml-52">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-bold mb-4">Chat with {selectedUser.name}</h2>
            <div className="mb-4 overflow-y-scroll h-96 border p-4">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.fromUserId === user?._id ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded ${msg.fromUserId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                    {msg.message}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="flex-grow p-2 border rounded"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded">Send</button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default MessengerPage;
