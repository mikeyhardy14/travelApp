import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userID, otherUserId } = req.query;

  // Validate ObjectIds
  if (!ObjectId.isValid(userID) || !ObjectId.isValid(otherUserId)) {
    return res.status(400).json({ message: 'Invalid ObjectId format' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch messages between the two users
    const messages = await db.collection('messages').find({
      $or: [
        { fromUserId: new ObjectId(userID), toUserId: new ObjectId(otherUserId) },
        { fromUserId: new ObjectId(otherUserId), toUserId: new ObjectId(userID) }
      ],
    }).sort({ timestamp: 1 }).toArray();

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// src="/images/home_page.jpg" 