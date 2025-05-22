// app/chat-subdomain/layout.tsx
import React from 'react';
import '../globals.css';

export const metadata = {
  title: 'Travel Chat',
  description: 'Chat with your travel companions',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
} 