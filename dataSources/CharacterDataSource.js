const { RESTDataSource } = require("../dataLayers/rest");

class CharacterDataSource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.got.show/api/';
    }

    get characters() {
        return this.get('characters');
    }
}

module.exports = CharacterDataSource;