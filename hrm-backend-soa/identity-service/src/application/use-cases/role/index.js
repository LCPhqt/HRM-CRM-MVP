const { roleRepository } = require('../../../container');
const createRole = require('./createRole');
const listRoles = require('./listRoles');
const addPermissions = require('./addPermissions');

const deps = { roleRepository };

module.exports = {
  createRole: createRole(deps),
  listRoles: listRoles(deps),
  addPermissions: addPermissions(deps),
};
