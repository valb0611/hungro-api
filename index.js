const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./database/Schemas/schema");
const resolvers = require("./database/Resolvers/resolvers");
const dbConnection = require("./config/database");
const jwtMiddleware = require("./middleware/AuthMiddleWare");
const cors = require("cors");

dbConnection();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  },
  context: ({ req }) => {
    return {
      userId: req.userId,
      userType: req.userType,
    };
  },
});

const app = express();

// Uso del middleware
app.use(jwtMiddleware);

app.use(cors());

(async () => {
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 3000 }, () => {
    console.log(`Server running on http://localhost:3000${server.graphqlPath}`);
  });
})();
