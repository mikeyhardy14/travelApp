import React, { useState } from 'react';
import CommentSection from './CommentSection';
import styles from './Itinerary.module.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface Comment {
  text: string;
}

interface ItineraryProps {
  itinerary: {
    id: string;
    title: string;
    profile: {
      name: string;
      avatarUrl: string;
    };
    flights: string[];
    accommodations: string;
    restaurants: string[];
    activities: string[];
    media: MediaItem[];
    likes: number;
    comments: Comment[];
  };
}

const Itinerary: React.FC<ItineraryProps> = ({ itinerary }) => {
  const [likes, setLikes] = useState(itinerary.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const handleCopyTrip = () => {
    navigator.clipboard.writeText(JSON.stringify(itinerary));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className={`${styles.itineraryContainer} ${showComments ? styles.expanded : ''}`}>
      {/* Itinerary Details Section */}
      <div className={styles.detailsSection}>
        <div className={styles.profile}>
          <img src={itinerary.profile.avatarUrl} alt={itinerary.profile.name} className={styles.avatar} />
          <span>{itinerary.profile.name}</span>
        </div>
        <h2 className={styles.title}>{itinerary.title}</h2>
        <p className={styles.details}>
          <strong>Flights:</strong> {itinerary.flights.join(', ')}<br />
          <strong>Stayed at:</strong> {itinerary.accommodations}<br />
          <strong>Restaurants:</strong> {itinerary.restaurants.join(', ')}<br />
          <strong>Activities:</strong> {itinerary.activities.join(', ')}
        </p>
        <div className={styles.actions}>
          <button onClick={handleLike} className={styles.likeButton}>
            {isLiked ? '❤️' : '🤍'} {likes}
          </button>
          <button onClick={handleCopyTrip} className={styles.copyButton}>
            {isCopied ? 'Copied!' : 'Copy Trip'}
          </button>
        </div>
        <button onClick={toggleComments} className={styles.showCommentsButton}>
          {showComments ? 'Hide Comments' : `Show all ${itinerary.comments.length} comments`}
        </button>
      </div>

      {/* Media Carousel Section */}
      <div className={styles.mediaContainer}>
        <Carousel responsive={{ all: { breakpoint: { max: 4000, min: 0 }, items: 1 } }}>
          {itinerary.media.map((mediaItem, index) =>
            mediaItem.type === 'image' ? (
              <img key={index} src={mediaItem.url} alt={itinerary.title} className={styles.media} />
            ) : (
              <video key={index} src={mediaItem.url} controls className={styles.media} />
            )
          )}
        </Carousel>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className={styles.commentSection}>
          <CommentSection comments={itinerary.comments} itineraryId={itinerary.id} />
        </div>
      )}
    </div>
  );
};

export default Itinerary;
