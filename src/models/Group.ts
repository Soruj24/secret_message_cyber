import { Schema, model, models } from 'mongoose';

const GroupSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  avatar: { type: String }
});

const Group = models.Group || model('Group', GroupSchema);

export default Group;