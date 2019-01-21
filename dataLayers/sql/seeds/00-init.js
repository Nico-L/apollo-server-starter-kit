const Logger = require("../logger");
const Hooks = require("../hooks");

exports.seed = knex => {
  Logger(knex);
  Hooks(knex);
};
