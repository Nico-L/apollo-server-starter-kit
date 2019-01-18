const { SQLDataSource } = require("../dataLayers/sql");

class CharacterSQLDataSource extends SQLDataSource {

    initialize(config) {
        const { Database } = config.context.dataLayers.sql;
        this.Database = Database;
    }

    get characters() {
        return this.Database.from("character");
    }

    async findCharacterBySlug(slug) {
       return this.Database.from("character").where("slug", slug).first();
    }
}

module.exports = CharacterSQLDataSource;