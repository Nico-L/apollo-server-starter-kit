const resolvers = {
  Query: {
    characters: async (
      parent,
      args,
      { dataSources: { CharacterRESTDataSource } },
      info
    ) => CharacterRESTDataSource.characters
  },
  Character: {
    house: parent => parent.royalHouse ? parent.royalHouse : null,
    birth: parent =>
      parent.dateOfBirth || parent.placeOfBirth
        ? {
            date: parent.dateOfBirth ? parent.dateOfBirth : null,
            place: parent.placeOfBirth ? parent.placeOfBirth : null
          }
        : null,
    death: parent => parent.dateOfDeath || parent.placeOfDeath ? ({
      date: parent.dateOfDeath ? parent.dateOfDeath : null,
      place: parent.placeOfDeath ? parent.placeOfDeath : null
    }) : null,
    mother: (parent, args, { dataSources: { CharacterRESTDataSource } }) =>
      parent.mother
        ? CharacterRESTDataSource.findCharacterBySlug(parent.mother)
        : null,
    father: (parent, args, { dataSources: { CharacterRESTDataSource } }) =>
      parent.father
        ? CharacterRESTDataSource.findCharacterBySlug(parent.father)
        : null,
    heir: (parent, args, { dataSources: { CharacterRESTDataSource } }) =>
      parent.heir
        ? CharacterRESTDataSource.findCharacterBySlug(parent.heir)
        : null
  }
};

module.exports = resolvers;
