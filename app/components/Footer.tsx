import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/press">Press</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4>Services</h4>
          <ul>
            <li><a href="/flights">Flights</a></li>
            <li><a href="/hotels">Hotels</a></li>
            <li><a href="/car-rentals">Car Rentals</a></li>
            <li><a href="/vacations">Vacations</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4>Support</h4>
          <ul>
            <li><a href="/help">Help</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>
        <div className={styles.column}>
          <h4>Follow Us</h4>
          <ul className={styles.socialIcons}>
            <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} TravelApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
