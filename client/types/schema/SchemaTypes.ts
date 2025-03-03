import { Document } from "mongoose"

export interface IUser extends Document {
    _id: string;
    name: {
      firstName: string;
      lastName: string;
    };
    email: string;
    password: string;
    role: 'free' | 'paid';
    emailVerified: boolean;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
  }