import { Schema, model, models } from 'mongoose';

const GroupMessageSchema = new Schema({
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  mediaType: { type: String, enum: ['text', 'image', 'video', 'audio'], default: 'text' },
  mediaUrl: { type: String }
});

const GroupMessage = models.GroupMessage || model('GroupMessage', GroupMessageSchema);

export default GroupMessage;