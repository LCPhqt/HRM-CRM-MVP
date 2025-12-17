const AppError = require('../../../shared/AppError');

module.exports = (deps) => async ({ userId, roleId }) => {
  const { userModel } = deps;

  const updated = await userModel.findByIdAndUpdate(
    userId,
    { $addToSet: { roles: roleId } },
    { new: true, lean: true }
  );
  if (!updated) throw new AppError('User not found', 404, 'NOT_FOUND');
  return updated;
};
