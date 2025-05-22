import mongoose, { Document } from 'mongoose';

export interface ICard extends Document {
  name: string;
  isHuman: boolean;
  isAI: boolean;
  original_name: string;
}

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isHuman: {
      type: Boolean,
      required: true,
    },
    isAI: {
      type: Boolean,
      required: true,
    },
    original_name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Card =  mongoose.model<ICard>('Card', cardSchema); 