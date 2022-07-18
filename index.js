const { ApolloServer } = require("apollo-server");
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core')

const mongoose = require("mongoose");
require("dotenv").config();

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
// The GraphQL schema

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],  

});

mongoose
  .connect(process.env.DB_URL, {useNewUrlParser: true})
  .then(() => {
    return server.listen({ port: 5000 });
  })
  .then(({ url }) => {
    console.log(url);
    console.log(`🚀 Server ready at ${url}`);
});

