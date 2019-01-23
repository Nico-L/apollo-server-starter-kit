const resolvers = {
  Query: {
    characters: async (
      parent,
      args,
      { dataSources: { CharacterRESTDataSource } },
      info
    ) => CharacterRESTDataSource.characters
  },

  House: {
    lord: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.lord ? CharacterRESTDataSource.findCharacterBySlug(parent.lord) : null,
    heirs: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.heirs ? CharacterRESTDataSource.findCharactersBySlug(parent.heirs) : null,
    characters: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.father ? CharacterRESTDataSource.findCharactersByHouseSlug(parent.slug) : null,
  },

  Character: {
    father: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.father ? CharacterRESTDataSource.findCharacterBySlug(parent.father) : null,
    mother: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.mother ? CharacterRESTDataSource.findCharacterBySlug(parent.mother) : null,
    spouses: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.spouses ? CharacterRESTDataSource.findCharactersBySlug(parent.spouses) : null,
    childrens: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.childrens ? CharacterRESTDataSource.findCharactersBySlug(parent.childrens) : null,
    house: (parent, args, { dataSources: { HouseRESTDataSource } }) => parent.house ? HouseRESTDataSource.findHouseBySlug(parent.house) : null,
  }

  // Character: {
  //   house: parent => parent.royalHouse ? parent.royalHouse : null,
  //   birth: parent =>
  //     parent.dateOfBirth || parent.placeOfBirth
  //       ? {
  //           date: parent.dateOfBirth ? parent.dateOfBirth : null,
  //           place: parent.placeOfBirth ? parent.placeOfBirth : null
  //         }
  //       : null,
  //   death: parent => parent.dateOfDeath || parent.placeOfDeath ? ({
  //     date: parent.dateOfDeath ? parent.dateOfDeath : null,
  //     place: parent.placeOfDeath ? parent.placeOfDeath : null
  //   }) : null,
  //   mother: (parent, args, { dataSources: { CharacterRESTDataSource } }) =>
  //     parent.mother
  //       ? CharacterRESTDataSource.findCharacterBySlug(parent.mother)
  //       : null,
  //   father: (parent, args, { dataSources: { CharacterRESTDataSource } }) =>
  //     parent.father
  //       ? CharacterRESTDataSource.findCharacterBySlug(parent.father)
  //       : null,
  //   heir: (parent, args, { dataSources: { CharacterRESTDataSource } }) =>
  //     parent.heir
  //       ? CharacterRESTDataSource.findCharacterBySlug(parent.heir)
  //       : null
  // }
};

module.exports = resolvers;
