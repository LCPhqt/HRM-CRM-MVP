const authUseCases = require('../../../application/use-cases/auth');

const register = async (req, res, next) => {
  try {
    const result = await authUseCases.register(req.body);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authUseCases.login(req.body);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const result = await authUseCases.refresh(req.body);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await authUseCases.logout({ refreshToken: req.body.refreshToken, userId: req.user?.sub });
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, logout };
