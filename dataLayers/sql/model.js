class Model {
  constructor(Database, tableName) {
    this.Database = Database;
    this.tableName = tableName;
  }

  all() {
    return this.Database.from(this.tableName);
  }

  findOne(where) {
    return this.Database.from(this.tableName)
      .where(where)
      .first();
  }

  async create(payload) {
    return this.Database.insert(payload)
      .into(this.tableName)
      .returning("*")
      .then(rows => rows[0]);
  }
}

module.exports = Model;
