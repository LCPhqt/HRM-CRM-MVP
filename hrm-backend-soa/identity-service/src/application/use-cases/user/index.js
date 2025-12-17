const { userModel } = require('../../../container');
const assignRole = require('./assignRole');

const deps = { userModel };

module.exports = {
  assignRole: assignRole(deps),
};
