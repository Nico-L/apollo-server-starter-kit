const { ApolloServer } = require("apollo-server");
const GraphQLHelper = require("./helpers/graphql");

const { RestExtension } = require("./dataLayers/rest");

const server = new ApolloServer({
  typeDefs: GraphQLHelper.typeDefs,
  schemaDirectives: GraphQLHelper.schemaDirectives,
  resolvers: GraphQLHelper.resolvers,
  dataSources: () => GraphQLHelper.dataSources,
  extensions: [() => new RestExtension()],
  tracing: true
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
