import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userID } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db();
    console.log(userID)

    // Fetch users who have existing chats with the logged-in user
    const messages = await db.collection('messages').aggregate([
      {
        $match: {
          $or: [
            { fromUserId: new ObjectId(userID) },
            { toUserId: new ObjectId(userID) }
          ]
        }
      },
      {
        $group: {
          _id: null,
          userIds: { $addToSet: { $cond: { if: { $ne: ['$fromUserId', new ObjectId(userID)] }, then: '$fromUserId', else: '$toUserId' } } }
        }
      },
      { $unwind: '$userIds' },
      {
        $lookup: {
          from: 'users',
          localField: 'userIds',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.password': 0
        }
      }
    ]).toArray();
    res.status(200).json(messages.map((m) => m.user));
  } catch (error) {
    console.error('Error fetching users with chats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
