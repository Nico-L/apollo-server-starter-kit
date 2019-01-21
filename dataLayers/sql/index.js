const knex = require("knex");
const config = require("./knexfile");

const { knexcamelCaseMappers } = require("./helpers");
const Hooks = require("./hooks");
const Logger = require("./logger");
const SQLExtension = require("./sqlExtension");
const SQLDataSource = require("./sqlDataSource");
const ModelFactory = require("./modelFactory");

const environment = process.env.NODE_ENV || "development";
let Database = Logger(
  knex({
    ...config[environment],
    ...knexcamelCaseMappers()
  })
);
Hooks(Database);

module.exports = {
  SQLExtension,
  Database,
  SQLDataSource,
  ModelFactory
};
