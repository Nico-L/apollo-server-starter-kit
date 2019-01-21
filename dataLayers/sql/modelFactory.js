const { snakeCase } = require("lodash");
const Model = require("./model");

class ModelFactory {
  constructor() {
    this.models = [];
  }

  setDatabase(Database) {
    this.Database = Database;
    return this;
  }

  create(modelName) {
    if (!this.models[modelName]) {
      this.models[modelName] = new Model(this.Database, snakeCase(modelName));
    }

    return this.models[modelName];
  }

  static getInstance() {
    if (!ModelFactory.instance) {
      ModelFactory.instance = new ModelFactory();
    }

    return ModelFactory.instance;
  }
}

module.exports = ModelFactory.getInstance();
