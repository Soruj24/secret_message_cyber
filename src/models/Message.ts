import { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  // For media sharing
  mediaType: { type: String, enum: ['text', 'image', 'video', 'audio'], default: 'text' },
  mediaUrl: { type: String }
});

const Message = models.Message || model('Message', MessageSchema);

export default Message;