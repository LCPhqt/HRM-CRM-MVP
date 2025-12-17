const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    company: { type: String },
    title: { type: String },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  },
  { timestamps: true }
);

const UserModel = model('User', userSchema);

module.exports = UserModel;
