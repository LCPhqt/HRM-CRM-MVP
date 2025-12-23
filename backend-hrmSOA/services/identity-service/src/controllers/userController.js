const userRepo = require('../repositories/userRepo');

async function listUsers(_req, res) {
  const users = await userRepo.listUsers();
  return res.json(users);
}

async function getUser(req, res) {
  const user = await userRepo.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
}

module.exports = { listUsers, getUser };

