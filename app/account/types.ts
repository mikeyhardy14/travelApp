// app/account/types.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  description?: string;
}

export interface Message {
  fromUserId: string;
  toUserId: string;
  message: string;
  timestamp: Date;
}
