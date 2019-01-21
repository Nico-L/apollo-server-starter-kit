const axios = require("axios");
const Seeder = require("../seeder");

const CharacterSeeder = async ({ progress, Database }) => {
  await Database.raw(`TRUNCATE "character" RESTART IDENTITY CASCADE`);
  
  if (!process.env.ENDPOINT_GOT_API) {
    throw new Error(
      "You have not set the `ENDPOINT_GOT_API` environment variable !"
    );
  }
  const baseURL = process.env.ENDPOINT_GOT_API;

  let charactersMockData = await axios
    .get(`${baseURL}/characters`)
    .then(({ data }) => data);

  progress.start(charactersMockData.length, 0);
  for (const key in charactersMockData) {
    const character = charactersMockData[key];
    await Database.insert({
      slug: character.slug,
      name: character.name,
      titles: character.titles ? JSON.stringify(character.titles) : null,
      gender: character.gender || null,
      culture: character.culture || null
    }).into("character");
    progress.increment();
  }
  progress.stop();


  const characters = await Database.from("character");
  progress.start(characters.length, 0);
  for (const key in characters) {
    const character = characters[key];
    const characterMockData = charactersMockData.find(
      currentCharacter => currentCharacter.slug === character.slug
    );

    const mother = characters.find(
      currentCharacter => currentCharacter.slug === characterMockData.mother
    );
    const father = characters.find(
      currentCharacter => currentCharacter.slug === characterMockData.father
    );

    await Database.table("character")
      .where("id", character.id)
      .update({
        mother_id: mother ? mother.id : null,
        father_id: father ? father.id : null
      });
    progress.increment();
  }

  progress.stop();
};

exports.seed = Seeder(CharacterSeeder);
