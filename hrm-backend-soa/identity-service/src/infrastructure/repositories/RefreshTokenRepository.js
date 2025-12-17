class RefreshTokenRepository {
  constructor(model) {
    this.model = model;
  }

  create(payload) {
    return this.model.create(payload);
  }

  findByToken(token) {
    return this.model.findOne({ token }).lean();
  }

  deleteByToken(token) {
    return this.model.deleteOne({ token });
  }

  deleteByUser(userId) {
    return this.model.deleteMany({ userId });
  }
}

module.exports = RefreshTokenRepository;
