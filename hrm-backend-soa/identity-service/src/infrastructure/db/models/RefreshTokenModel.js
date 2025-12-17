const { Schema, model } = require('mongoose');

const refreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const RefreshTokenModel = model('RefreshToken', refreshTokenSchema);

module.exports = RefreshTokenModel;
