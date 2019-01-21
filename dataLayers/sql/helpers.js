const { camelCase } = require("lodash");

const convertToCamel = result =>
  Object.keys(result).reduce((acc, key) => {
    const value = result[key];
    acc[camelCase(key)] = value;
    return acc;
  }, {});

const knexcamelCaseMappers = () => ({
  postProcessResponse: (result, queryContext) => {
    if (Array.isArray(result)) {
      return result.map(row => convertToCamel(row));
    } else if (typeof result === "object") {
      return convertToCamel(result);
    }

    return result;
  }
});

module.exports = {
  knexcamelCaseMappers
};
