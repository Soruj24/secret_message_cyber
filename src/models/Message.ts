import { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  attachments: [{ 
    url: { type: String },
    type: { type: String, enum: ['image', 'video', 'file'] },
    name: { type: String }
  }],
}, { timestamps: true });

export default models.Message || model('Message', MessageSchema);