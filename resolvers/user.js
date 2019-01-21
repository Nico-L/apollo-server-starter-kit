const { AuthenticationError } = require("apollo-server");

const resolvers = {
  Query: {
    me: (parent, args, { me }, info) => {
      if (!me) {
        throw new AuthenticationError("Not authenticated.");
      }
      return me;
    },
  },
  Mutation: {
    signup: async (
      parent,
      { signupInput },
      { dataSources: { UserSQLDataSource } },
      info
    ) => UserSQLDataSource.signup(signupInput),
    login: async (
      parent,
      { email, password },
      { dataSources: { UserSQLDataSource } },
      info
    ) => UserSQLDataSource.login({ email, password })
  }
};

module.exports = resolvers;
