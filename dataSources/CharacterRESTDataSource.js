const { RESTDataSource } = require("../dataLayers/rest");

class CharacterRESTDataSource extends RESTDataSource {
  constructor() {
    super();
    if (!process.env.ENDPOINT_GOT_API) {
      throw new Error(
        "You have not set the `ENDPOINT_GOT_API` environment variable !"
      );
    }
    this.baseURL = process.env.ENDPOINT_GOT_API;
  }

  getErrorFromResponseAndBody(response, body) {
    let code = "INTERNAL_SERVER_ERROR";
    if (response.status === 404) {
      code = "NOT_FOUND";
    }
    return {
      code: code,
      message: body.error.message
    };
  }

  get characters() {
    return this.get("/characters");
  }

  async findCharacterBySlug(slug) {
    const characters = await this.characters;
    return characters.find(character => character.slug === slug);
    // return this.get(`/character/${slug}`);
  }
}

module.exports = CharacterRESTDataSource;
