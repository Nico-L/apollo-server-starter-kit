const { defaultFieldResolver } = require("graphql");
const { SchemaDirectiveVisitor, ApolloError } = require("apollo-server");

class HasRoleDirective extends SchemaDirectiveVisitor {
  static get name() {
    return "hasRole";
  }

  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredRole = this.args.role;
  }

  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredRole = this.args.role;
  }

  ensureFieldsWrapped(objectType) {
    if (objectType._hasRoleFieldsWrapped) return;
    objectType._hasRoleFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        const requiredRole = field._requiredRole || objectType._requiredRole;

        if (!requiredRole) {
          return resolve.apply(this, args);
        }

        const context = args[2];
        if (
          !context.me ||
          (context.me && !context.me.user.roles.includes(requiredRole))
        ) {
          throw new ApolloError(
            "You are not authorized to perform this operation.",
            "NOT_AUTHORIZED"
          );
        }

        return resolve.apply(this, args);
      };
    });
  }
}

module.exports = HasRoleDirective;
