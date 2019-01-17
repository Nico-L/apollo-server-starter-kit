const resolvers = {
    Query: {
        characters: async (parent, args, { dataSources: { CharacterDataSource } }, info) => CharacterDataSource.characters,
    },
    Character: {
        gender: (parent) => parent.male ? 'MALE' : 'FEMALE',
        mother: (parent) => null,
        father: (parent) => null,
    }
};

module.exports = resolvers;
