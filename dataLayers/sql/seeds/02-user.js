const Seeder = require("../seeder");

const UserSeeder = async ({ progress, Database }) => {
  await Database.raw(`TRUNCATE "user" RESTART IDENTITY CASCADE`);

  const users = [
    {
      email: "admin@eleven-labs.com",
      username: "admin",
      password: "admin",
      roles: JSON.stringify(["ADMIN"])
    },
    {
      email: "wilson@eleven-labs.com",
      username: "wilson",
      password: "wilson",
      roles: JSON.stringify(["ADMIN"])
    }
  ];

  progress.start(users.length, 0);
  await Database.batchInsert("user", users, users.length);
  progress.increment(users.length);
  progress.stop();
};

exports.seed = Seeder(UserSeeder);
