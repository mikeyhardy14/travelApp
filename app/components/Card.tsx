// app/components/Card.tsx
import React from 'react';
import Link from 'next/link';
import styles from './Card.module.css'; // Import the CSS module

interface CardProps {
  title: string;
  description: string;
  href: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, href, children }) => {
  return (
    <Link href={href} className={styles.card}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardDescription}>{description}</p>
      {children}
    </Link>
  );
};

export default Card;
