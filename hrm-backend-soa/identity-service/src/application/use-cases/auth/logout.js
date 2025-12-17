module.exports = (deps) => async ({ refreshToken, userId }) => {
  const { refreshTokenRepository } = deps;

  if (refreshToken) {
    await refreshTokenRepository.deleteByToken(refreshToken);
  } else if (userId) {
    await refreshTokenRepository.deleteByUser(userId);
  }

  return { success: true };
};
