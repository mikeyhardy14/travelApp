// pages/api/messages/send.js
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fromUserId, toUserId, message } = req.body;

  if (!fromUserId || !toUserId || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const newMessage = {
      fromUserId: new ObjectId(fromUserId),
      toUserId: new ObjectId(toUserId),
      message,
      timestamp: new Date(),
    };

    await db.collection('messages').insertOne(newMessage);

    res.status(201).json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}
