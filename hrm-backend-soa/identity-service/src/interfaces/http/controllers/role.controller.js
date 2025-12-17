const roleUseCases = require('../../../application/use-cases/role');

const list = async (req, res, next) => {
  try {
    const roles = await roleUseCases.listRoles();
    res.json({ data: roles });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const role = await roleUseCases.createRole(req.body);
    res.status(201).json({ data: role });
  } catch (err) {
    next(err);
  }
};

const addPermissions = async (req, res, next) => {
  try {
    const role = await roleUseCases.addPermissions({ roleId: req.params.id, permissionIds: req.body.permissionIds || [] });
    res.json({ data: role });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create, addPermissions };
