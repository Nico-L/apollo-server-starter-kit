const { SQLDataSource } = require("../dataLayers/sql");
const DataLoader = require("dataloader");

class CharacterSQLDataSource extends SQLDataSource {
  initialize(config) {
    const { Database, ModelFactory } = config.context.dataLayers.sql;
    this.Database = Database;
    this.Character = ModelFactory.create("Character");
  }

  get characters() {
    return this.Character.all();
    // return this.Database.from("character");
  }

  async findCharacterBySlug(slug) {
    return this.dataLoaders.characterBySlug.load(slug);
    // return this.Character.findOne({ slug });
    // return this.Database.from("character")
    //   .where("slug", slug)
    //   .first();
  }

  get dataLoaders() {
    if (!this._dataLoaders) {
      this._dataLoaders = {
        characterBySlug: this._characterBySlugDataLoader
      };
    }

    return this._dataLoaders;
  }

  get _characterBySlugDataLoader() {
    return new DataLoader(slugs =>
      this.Database.from("character")
        .whereIn("slug", slugs)
        .then(items =>
          slugs.map(slug =>
            items.find(({ slug: currentSlug }) => currentSlug === slug)
          )
        )
    );
  }
}

module.exports = CharacterSQLDataSource;
