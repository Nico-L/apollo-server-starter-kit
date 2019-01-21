const knexHooks = require("knex-hooks");
const AuthHelper = require("../../helpers/auth");

module.exports = Database => {
  knexHooks(Database);

  Database.addHook(
    "before",
    ["insert", "update"],
    "user",
    async (when, method, table, params) => {
      let data;
      if (method === "update") {
        data = knexHooks.helpers.getUpdateData(params.query);
      } else {
        data = knexHooks.helpers.getInsertData(params.query);
      }

      let rows = Array.isArray(data) ? data : [data];

      for (const key in rows) {
        let row = rows[key];
        if (!AuthHelper.isBcryptHash(row.password)) {
          let passwordHashed = await AuthHelper.generateHash(row.password);
          rows[key].password = passwordHashed;
        }
      }
    }
  );

  return Database;
};
