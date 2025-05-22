import { Document } from 'mongoose';

export const toJSON = (schema: any) => {
  schema.set('toJSON', {
    transform: (_: any, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
}; 