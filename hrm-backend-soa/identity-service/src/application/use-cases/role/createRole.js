module.exports = (deps) => async ({ name, description, permissions = [] }) => {
  const { roleRepository } = deps;
  return roleRepository.create({ name, description, permissions });
};
