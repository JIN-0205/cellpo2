// src/models/user.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  matches: number;
  win: number;
  signUpDate: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  matches: { type: Number, default: 0 },
  win: { type: Number, default: 0 },
  signUpDate: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>("User", UserSchema);
