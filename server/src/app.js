const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const { config } = require("dotenv");
const { verify } = require("jsonwebtoken");

config();

const schema = require("./graphql");
const models = require("./models");

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log("Connected to database"))
  .catch(() => console.log("Failed connecting to database"));

const app = express();

app.use(compression());
app.use(helmet());

const checkToken = token => {
  let decoded = null;
  try {
    decoded = verify(token, process.env.JWT_KEY);
  } catch (e) {
    return null;
  }
  return models.UserModel.findById(decoded._id);
};

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const token = req.headers.authorization;
    const user = await checkToken(token);
    return { models, user };
  }
});

apolloServer.applyMiddleware({ app });

module.exports = { app };
