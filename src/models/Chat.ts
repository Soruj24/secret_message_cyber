import { Schema, model, models } from 'mongoose';

const ChatSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isGroup: { type: Boolean, default: false },
  groupName: { type: String },
  groupAdmin: { type: Schema.Types.ObjectId, ref: 'User' },
  groupImage: { type: String },
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

export default models.Chat || model('Chat', ChatSchema);