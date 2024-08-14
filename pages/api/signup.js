// pages/api/signup.js
import bcrypt from 'bcryptjs';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password, profilePicture, description } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      profilePicture: profilePicture || '',
      description: description || '',
      messages: [],  // New field for storing messages
    };

    await db.collection('users').insertOne(newUser);

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}
