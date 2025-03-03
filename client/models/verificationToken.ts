import mongoose, { Schema } from 'mongoose';

export interface IVerificationToken {
  userId: mongoose.Types.ObjectId;
  token: string;
  type: 'emailVerification' | 'passwordReset';
  expiresAt: Date;
  createdAt: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['emailVerification', 'passwordReset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h' // Automatically delete documents after 24 hours
  }
});

const VerificationToken = mongoose.models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', verificationTokenSchema);
export default VerificationToken; 