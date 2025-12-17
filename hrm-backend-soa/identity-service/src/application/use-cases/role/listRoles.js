module.exports = (deps) => async () => {
  const { roleRepository } = deps;
  return roleRepository.findAll();
};
