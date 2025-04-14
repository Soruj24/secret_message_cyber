import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  status: { type: String, enum: ['online', 'offline', 'away'], default: 'offline' },
  lastSeen: { type: Date },
  contacts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default models.User || model('User', UserSchema);