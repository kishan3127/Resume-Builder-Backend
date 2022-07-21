const { ApolloServer, AuthenticationError } = require("apollo-server");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
require("dotenv").config();

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
// The GraphQL schema

const getUser = (token, req, res) => {
  const splitedToken = token.split(" ")[1];
  return jwt.verify(splitedToken, process.env.SECRET_KEY, (err, decoded) => {
    //   // if token not verified throw 403
    if (err) {
      return new AuthenticationError(`Your Token Expired ${err}`);
    }
    req.decodedToken = decoded;
  });
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: ({ req, res }) => {
    const token = req.headers.authorization || "";

    getUser(token, req, res);
    const user = req.decodedToken;
    if (user) {
      return { user };
    }
    return {};
  },
});

mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() => {
    return server.listen({
      port: process.env.PORT || 5000,
    });
  })
  .then(({ url }) => {
    console.log(url);
    console.log(`🚀 Server ready at ${url}`);
  });
