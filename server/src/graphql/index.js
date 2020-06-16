const { makeExecutableSchema } = require("apollo-server-express");

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");

module.exports = makeExecutableSchema({ resolvers, typeDefs });
