const { ApolloServer } = require("apollo-server");
const TracingExtension = require("./helpers/tracingExtension");
const GraphQLHelper = require("./helpers/graphql");

const { RestExtension } = require("./dataLayers/rest");
const { SQLExtension, Database } = require("./dataLayers/sql");

const server = new ApolloServer({
  typeDefs: GraphQLHelper.typeDefs,
  schemaDirectives: GraphQLHelper.schemaDirectives,
  resolvers: GraphQLHelper.resolvers,
  dataSources: () => GraphQLHelper.dataSources,
  extensions: [
    // () => new TracingExtension(),
    () => new RestExtension(),
    () => new SQLExtension()
  ],
  context: async ({ req, connection }) => ({
    dataLayers: {
      sql: {
        Database,
      }
    }
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
