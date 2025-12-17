class UserRepository {
  constructor(model) {
    this.model = model;
  }

  findByEmail(email) {
    return this.model.findOne({ email }).populate('roles').populate('permissions').lean();
  }

  findById(id) {
    return this.model.findById(id).populate('roles').populate('permissions').lean();
  }

  create(payload) {
    return this.model.create(payload);
  }
}

module.exports = UserRepository;
