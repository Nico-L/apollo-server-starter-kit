const cliProgress = require("cli-progress");
const SQLCollector = require("./sqlCollector");

const Seeder = callback => async Database => {
  const progress = new cliProgress.Bar({}, cliProgress.Presets.shades_classic);
  console.log(`\n<--- Start seeded: ${callback.name} --->\n`);
  await callback({ Database, progress });
  progress.stop();

  SQLCollector.reset();

  console.log(`\n<--- End seeded: ${callback.name} --->\n`);
};

module.exports = Seeder;
