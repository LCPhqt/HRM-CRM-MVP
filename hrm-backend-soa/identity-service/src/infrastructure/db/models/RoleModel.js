const { Schema, model } = require('mongoose');

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  },
  { timestamps: true }
);

const RoleModel = model('Role', roleSchema);

module.exports = RoleModel;
