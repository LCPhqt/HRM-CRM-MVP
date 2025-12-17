const { Schema, model } = require('mongoose');

const permissionSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

const PermissionModel = model('Permission', permissionSchema);

module.exports = PermissionModel;
