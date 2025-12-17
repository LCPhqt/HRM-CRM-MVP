class RoleRepository {
  constructor(model) {
    this.model = model;
  }

  findAll() {
    return this.model.find().populate('permissions').lean();
  }

  create(payload) {
    return this.model.create(payload);
  }

  addPermissions(roleId, permissionIds) {
    return this.model.findByIdAndUpdate(
      roleId,
      { $addToSet: { permissions: { $each: permissionIds } } },
      { new: true, lean: true }
    );
  }
}

module.exports = RoleRepository;
