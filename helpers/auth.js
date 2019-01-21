const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { AuthenticationError } = require("apollo-server");

const RECOMMENDED_ROUNDS = 12;
const REGEXP = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;

class AuthHelper {
  async generateHash(password) {
    if (this.isBcryptHash(password)) {
      throw new Error("bcrypt tried to hash another bcrypt hash.");
    }

    return bcrypt.hash(password, RECOMMENDED_ROUNDS);
  }

  isBcryptHash(password) {
    return REGEXP.test(password);
  }

  verifyPassword(currentPassword, password) {
    return bcrypt.compare(password, currentPassword);
  }

  createToken(user, expiresIn = "30m") {
    return jwt.sign({ userId: user.id }, process.env.APP_SECRET, {
      expiresIn
    });
  }

  getAuthPayloadByAccessToken(accessToken) {
    if (accessToken) {
      try {
        const { userId } = jwt.verify(accessToken, process.env.APP_SECRET);
        return { userId };
      } catch (e) {
        throw new AuthenticationError("Your session expired. Sign in again.");
      }
    }

    return { userId: null };
  }
}

module.exports = new AuthHelper();
