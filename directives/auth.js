const { defaultFieldResolver } = require("graphql");
const { ApolloError, SchemaDirectiveVisitor } = require("apollo-server");

class AuthDirective extends SchemaDirectiveVisitor {
  static get name() {
    return "auth";
  }

  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const context = args[2];
      if (!context.user) {
        throw new ApolloError("User not permitted.", "USER_NOT_PERMITTED");
      }

      return resolve.apply(this, args);
    };
  }
}

module.exports = AuthDirective;
