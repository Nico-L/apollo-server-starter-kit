const DataLoader = require("dataloader");
const { ApolloError } = require("apollo-server-express");
const { SQLDataSource, ModelFactory } = require("../dataLayers/sql");
const AuthHelper = require("../helpers/auth");

class UserSQLDataSource extends SQLDataSource {
  initialize(config) {
    const { Database } = config.context.dataLayers.sql;
    this.Database = Database;
  }

  async findByEmail(email) {
    return this.dataLoaders.userByEmail.load(email);
  }

  async signup(signupInput) {
    const User = ModelFactory.create("User");
    if (!signupInput.email || !signupInput.username || !signupInput.password) {
      throw new ApolloError(
        `Email, username and password arguments are required.`
      );
    }

    let user = await this.findByEmail(signupInput.email);
    if (user) {
      throw new ApolloError(
        `User with email \`${signupInput.email}\` already exists.`,
        "ALREADY_EXISTS"
      );
    }

    user = await User.create(signupInput);
    return {
      accessToken: AuthHelper.createToken(user),
      user: user
    };
  }

  async login(payload) {
    const { email, password } = payload;

    let user = await this.findByEmail(email);
    if (!user) {
      throw new ApolloError(
        `No such user found for email: \`${email}\`.`,
        "NOT_FOUND"
      );
    }

    const valid = await AuthHelper.verifyPassword(user.password, password);
    if (!valid) {
      throw new ApolloError(`Invalid password.`, "INVALID_PASSWORD");
    }

    return {
      accessToken: AuthHelper.createToken(user),
      user
    };
  }

  get dataLoaders() {
    if (!this._dataLoaders) {
      this._dataLoaders = {
        userByEmail: this._userByEmailDataLoader
      };
    }

    return this._dataLoaders;
  }

  get _userByEmailDataLoader() {
    return new DataLoader(emails =>
      this.Database.from("user")
        .whereIn("email", emails)
        .then(items =>
          emails.map(email =>
            items.find(({ email: currentEmail }) => currentEmail === email)
          )
        )
    );
  }
}

module.exports = UserSQLDataSource;
