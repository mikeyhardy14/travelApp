import React, { useState } from 'react';
import styles from './CommentSection.module.css';

interface Comment {
  text: string;
}

interface CommentSectionProps {
  comments: Comment[];
  itineraryId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, itineraryId }) => {
  const [newComment, setNewComment] = useState('');
  const [commentList, setCommentList] = useState<Comment[]>(comments);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    // Update the comment list optimistically
    const updatedComments = [...commentList, { text: newComment }];
    setCommentList(updatedComments);
    setNewComment('');

    // Send the new comment to the API
    await fetch(`/api/itineraries/${itineraryId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newComment }),
    });
  };

  return (
    <div className={styles.commentSection}>
      <h3>Comments</h3>
      <div className={styles.commentList}>
        {commentList.map((comment, index) => (
          <div key={index} className={styles.comment}>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CommentSection;
