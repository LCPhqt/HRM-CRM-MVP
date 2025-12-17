const { permissionRepository } = require('../../../container');

const list = async (req, res, next) => {
  try {
    const perms = await permissionRepository.findAll();
    res.json({ data: perms });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const perm = await permissionRepository.create(req.body);
    res.status(201).json({ data: perm });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, create };
