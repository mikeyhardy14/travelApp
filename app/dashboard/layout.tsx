// app/dashboard/layout.tsx
import React from 'react';
import '../globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Travel Dashboard',
  description: 'Manage your trips and travel plans',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen pl-12">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
} 