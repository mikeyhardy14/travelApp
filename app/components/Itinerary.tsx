import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [likes, setLikes] = useState(itinerary.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const handleCopyTrip = () => {
    const queryString = new URLSearchParams({
      title: itinerary.title,
      profileName: itinerary.profile.name,
      profileAvatarUrl: itinerary.profile.avatarUrl,
      flights: itinerary.flights.join(','),
      accommodations: itinerary.accommodations,
      restaurants: itinerary.restaurants.join(','),
      activities: itinerary.activities.join(','),
      // mediaUrls: itinerary.media.map((media) => media.url).join(','), c
    }).toString();

    // Navigate to /create with the query string
    router.push(`/create?${queryString}`);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className={`${styles.itineraryContainer} ${showComments ? styles.expanded : ''}`}>
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
            Copy Trip
          </button>
        </div>
        <button onClick={toggleComments} className={styles.showCommentsButton}>
          {showComments ? 'Hide Comments' : `Show all ${itinerary.comments.length} comments`}
        </button>
      </div>

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

      {showComments && (
        <div className={styles.commentSection}>
          <CommentSection comments={itinerary.comments} itineraryId={itinerary.id} />
        </div>
      )}
    </div>
  );
};

export default Itinerary;
