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
  // (err, decoded) => {
  //   // if token not verified throw 403
  //   if (err) {
  //     console.log(err, "Error");
  //     return new AuthenticationError(`Your Token Expired ${err}`);
  //   }
  //   req.decodedToken = decoded;
  // };
  return jwt.verify(splitedToken, process.env.SECRET_KEY);
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: ({ req, res }) => {
    const token = req.headers.authorization || "";

    try {
      const user = getUser(token, req, res);
      console.log(user);
      return { user };
    } catch (error) {
      throw new AuthenticationError(`Invalid/Expired Token:  ${error}`);
    }
    return { user };
  },
});

mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() => {
    return server.listen({ port: 5000 });
  })
  .then(({ url }) => {
    console.log(url);
    console.log(`🚀 Server ready at ${url}`);
  });
