module.exports = (deps) => async ({ roleId, permissionIds }) => {
  const { roleRepository } = deps;
  return roleRepository.addPermissions(roleId, permissionIds);
};
