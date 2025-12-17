const { userRepository, refreshTokenRepository } = require('../../../container');
const register = require('./register');
const login = require('./login');
const refresh = require('./refresh');
const logout = require('./logout');

const deps = { userRepository, refreshTokenRepository };

module.exports = {
  register: register(deps),
  login: login(deps),
  refresh: refresh(deps),
  logout: logout(deps),
};
