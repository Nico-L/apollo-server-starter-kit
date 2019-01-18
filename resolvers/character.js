const resolvers = {
    Query: {
        characters: async (parent, args, { dataSources: { CharacterRESTDataSource } }, info) => CharacterRESTDataSource.characters,
    },
    Character: {
        gender: (parent) => parent.male ? 'MALE' : 'FEMALE',
        mother: (parent, args, { dataSources: { CharacterRESTDataSource } }) => parent.mother ? CharacterRESTDataSource.findCharacterBySlug(parent.mother) : null,
        father: (parent, args, { dataSources: { CharacterSQLDataSource } }) => parent.father ? CharacterSQLDataSource.findCharacterBySlug(parent.father) : null,
    }
};

module.exports = resolvers;
