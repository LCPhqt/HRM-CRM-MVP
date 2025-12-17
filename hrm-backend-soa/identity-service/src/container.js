const UserModel = require('./infrastructure/db/models/UserModel');
const RoleModel = require('./infrastructure/db/models/RoleModel');
const PermissionModel = require('./infrastructure/db/models/PermissionModel');
const RefreshTokenModel = require('./infrastructure/db/models/RefreshTokenModel');

const UserRepository = require('./infrastructure/repositories/UserRepository');
const RoleRepository = require('./infrastructure/repositories/RoleRepository');
const PermissionRepository = require('./infrastructure/repositories/PermissionRepository');
const RefreshTokenRepository = require('./infrastructure/repositories/RefreshTokenRepository');

const userRepository = new UserRepository(UserModel);
const roleRepository = new RoleRepository(RoleModel);
const permissionRepository = new PermissionRepository(PermissionModel);
const refreshTokenRepository = new RefreshTokenRepository(RefreshTokenModel);

module.exports = {
  // models (dùng cho một vài use-case trực tiếp)
  userModel: UserModel,

  // repositories
  userRepository,
  roleRepository,
  permissionRepository,
  refreshTokenRepository,
};
