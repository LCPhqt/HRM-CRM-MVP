class User {
  constructor({ id, email, passwordHash, roles = [], permissions = [], status = 'active' }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.roles = roles;
    this.permissions = permissions;
    this.status = status;
  }
}

module.exports = User;
