const { ApolloServer } = require("apollo-server");
const TracingExtension = require("./helpers/tracingExtension");
const GraphQLHelper = require("./helpers/graphql");
const AuthHelper = require("./helpers/auth");

const { RestExtension } = require("./dataLayers/rest");
const { SQLExtension, Database, ModelFactory } = require("./dataLayers/sql");

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
  context: async ({ req, connection }) => {
    let context = {
      dataLayers: {
        sql: {
          Database,
          ModelFactory: ModelFactory.setDatabase(Database)
        }
      }
    };

    if (req) {
      const accessToken = req.headers["authorization"]
        ? req.headers["authorization"].replace("Bearer ", "")
        : null;
      if (accessToken) {
        const { userId } = AuthHelper.getAuthPayloadByAccessToken(accessToken);
        context.me = {
          accessToken,
          user: await Database.where({ id: userId })
            .from("user")
            .first()
        };
      }
    }

    return context;
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
