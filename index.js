const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { makeExecutableSchema } = require('@graphql-tools/schema');

const mongoose = require("mongoose");
require("dotenv").config();

const { AuthMiddleware } = require("./middlewares/auth");
const upperDirectiveTransformer = require("./directives/upper");
const isAuthDirectiveTransformer  = require("./directives/authDirective");

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const schemaDirectives = require("./directives")


const app = express();

app.use(AuthMiddleware)

const logger = { log: e => console.log(e,"from logger") }

const directiveTransformers = schemaDirectives;
let schema = makeExecutableSchema({
  logger,
  typeDefs,
  resolvers
});

// Transform the schema by applying directive logic
schema = upperDirectiveTransformer(schema, 'upper');
schema = isAuthDirectiveTransformer(schema, 'isAuth');


const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: ({ req }) => {
    let { isAuth, user } = req;
    return {
      req,
      isAuth,
      user
    }
  },
});

apolloServerStart = async () => {
  // Use Express app as middleware in Apollo Server instance
  await server.start();
  server.applyMiddleware({ app, path: "/mongo" });
};

apolloServerStart();
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }).then(() => {
  return app.listen({ port: process.env.PORT || 9002 }, () =>
    console.log(
      `🚀Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
  );
});
