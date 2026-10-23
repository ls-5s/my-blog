import { model, Schema, type InferSchemaType } from 'mongoose';

const adminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, minlength: 2 },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin', required: true },
  },
  { timestamps: true },
);

export type AdminDocument = InferSchemaType<typeof adminSchema>;
export const Admin = model('Admin', adminSchema);
